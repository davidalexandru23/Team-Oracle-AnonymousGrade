// Navbar.jsx - bara de navigatie din partea de sus
// se afiseaza diferit pentru studenti si profesori
// arata link-uri active (evidentiaza pagina curenta)

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';

function Navbar() {
  // luam datele userului din context
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // location ne spune pe ce pagina suntem
  const location = useLocation();

  // functia de logout - stergem sesiunea si mergem la login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // daca nu e logat, nu afisam navbar-ul
  if (!isAuthenticated) {
    return null;
  }

  // convertim rolul in text romanesc
  const getRoleLabel = (role) => {
    if (role === 'TEACHER') return 'Profesor';
    return 'Student';
  };

  // verificam daca un path e activ (pentru styling)
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      {/* logo-ul care duce la pagina principala */}
      <div className="navbar-brand">
        <Link to="/">NotaAnonima</Link>
      </div>

      {/* link-urile de navigatie - diferite pentru studenti si profesori */}
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

      {/* info user si buton logout */}
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
