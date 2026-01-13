import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../store/authStore.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      login(data.user, data.token);

      if (data.user.role === 'TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/mp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Autentificare esuata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Autentificare</h1>
        <form onSubmit={handleSubmit}>
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
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? 'Se incarca...' : 'Autentificare'}
          </button>
        </form>
        <p className="auth-link">
          Nu ai cont? <Link to="/register">Inregistreaza-te</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
