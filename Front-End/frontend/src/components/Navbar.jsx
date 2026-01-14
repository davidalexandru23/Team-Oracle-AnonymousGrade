import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NotaAnonima</Link>
      </div>
      <div className="navbar-links">
        {user?.role === 'STUDENT' && (
          <>
            <Link 
              to="/teams" 
              className={`nav-link ${isActive('/teams') || isActive('/projects') ? 'active' : ''}`}
            >
              Echipele Mele
            </Link>
            <Link 
              to="/assignments" 
              className={`nav-link ${isActive('/assignments') ? 'active' : ''}`}
            >
              Evaluari
            </Link>
          </>
        )}
        {user?.role === 'TEACHER' && (
          <Link 
            to="/teacher" 
            className={`nav-link ${isActive('/teacher') ? 'active' : ''}`}
          >
            Toate Proiectele
          </Link>
        )}
      </div>
      <div className="navbar-user">
        <span className="user-info">{user?.name} ({getRoleLabel(user?.role)})</span>
        <button onClick={handleLogout} className="btn btn-logout">
          Deconectare
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
