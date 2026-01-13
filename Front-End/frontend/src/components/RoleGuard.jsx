import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';

function RoleGuard({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Se incarca...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RoleGuard;
