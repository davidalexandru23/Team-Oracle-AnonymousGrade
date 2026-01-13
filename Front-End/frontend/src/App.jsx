import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authStore.jsx';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import MpDashboard from './pages/MpDashboard';
import ProjectDetails from './pages/ProjectDetails';
import EvaluatorAssignments from './pages/EvaluatorAssignments';
import TeacherDashboard from './pages/TeacherDashboard';
import './index.css';

// home redirect based on role
function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'TEACHER') {
    return <Navigate to="/teacher" replace />;
  }

  return <Navigate to="/mp" replace />;
}

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* home redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* student routes */}
          <Route
            path="/mp"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['STUDENT']}>
                  <MpDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['STUDENT']}>
                  <EvaluatorAssignments />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['TEACHER']}>
                  <TeacherDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* shared routes */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
