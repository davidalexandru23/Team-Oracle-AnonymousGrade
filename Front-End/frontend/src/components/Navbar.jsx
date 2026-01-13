import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const getRoleLabel = (role) => {
    if (role === 'TEACHER') return 'Profesor';
    return 'Student';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NotaAnonima</Link>
      </div>
      <div className="navbar-links">
        {user?.role === 'STUDENT' && (
          <>
            <Link to="/mp">Proiectele Mele</Link>
            <Link to="/assignments">Evaluarile Mele</Link>
          </>
        )}
        {user?.role === 'TEACHER' && (
          <Link to="/teacher">Panou Profesor</Link>
        )}
      </div>
      <div className="navbar-user">
        <span>{user?.name} ({getRoleLabel(user?.role)})</span>
        <button onClick={handleLogout} className="btn btn-logout">
          Deconectare
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
