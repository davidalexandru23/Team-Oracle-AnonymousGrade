// App.jsx - componenta principala a aplicatiei
// aici se configureaza rutele si se impacheteaza totul in provideri

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authStore.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import TeamsDashboard from './pages/TeamsDashboard';
import TeamDetails from './pages/TeamDetails';
import ProjectDetails from './pages/ProjectDetails';
import EvaluatorAssignments from './pages/EvaluatorAssignments';
import TeacherDashboard from './pages/TeacherDashboard';
import './index.css';

// componenta care redirecteaza userul catre pagina potrivita in functie de rol
// daca e profesor -> /teacher, daca e student -> /teams
function HomeRedirect() {
  const { user, loading } = useAuth();

  // cat timp se verifica daca userul e logat, afisam loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // daca nu e logat, il trimitem la login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // profesorii merg la dashboard-ul lor
  if (user.role === 'TEACHER') {
    return <Navigate to="/teacher" replace />;
  }

  // studentii merg la lista de echipe
  return <Navigate to="/teams" replace />;
}

// continutul aplicatiei - navbar, rutele, si footer-ul cu citate
function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* rute publice - login si register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* pagina principala - redirecteaza in functie de rol */}
          <Route path="/" element={<HomeRedirect />} />

          {/* rutele pentru studenti - echipe si evaluari */}
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['STUDENT']}>
                  <TeamsDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:id"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['STUDENT']}>
                  <TeamDetails />
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

          {/* rutele pentru profesori */}
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

          {/* ruta comuna - detalii proiect (poate fi accesat de oricine logat) */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          {/* orice alta ruta necunoscuta redirecteaza la home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* footer cu citat de la API extern */}
      <Footer />
    </div>
  );
}

// componenta principala - impacheteaza totul in BrowserRouter si AuthProvider
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
