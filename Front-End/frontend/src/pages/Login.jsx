// Login.jsx - pagina de autentificare
// userul introduce email si parola, apoi e redirectat in functie de rol

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';

function Login() {
  // starea formularului
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // hook-ul de autentificare din context
  const { login } = useAuth();
  const navigate = useNavigate();

  // cand se trimite formularul
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // login-ul din authStore face el apelul API si seteaza userul
      const data = await login(email, password);

      // redirectam in functie de rol
      if (data.user.role === 'TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/teams');
      }
    } catch (err) {
      // afisam eroarea de la server sau una generica
      setError(err.response?.data?.message || err.response?.data?.error || 'Autentificare esuata');
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
