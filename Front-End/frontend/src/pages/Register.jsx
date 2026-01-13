import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../store/authStore.jsx';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await registerApi(name, email, password, role);
      login(data.user, data.token);

      if (data.user.role === 'TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/mp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Inregistrare esuata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Inregistrare</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nume</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Parola</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Profesor</option>
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? 'Se incarca...' : 'Inregistrare'}
          </button>
        </form>
        <p className="auth-link">
          Ai deja cont? <Link to="/login">Autentificare</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
