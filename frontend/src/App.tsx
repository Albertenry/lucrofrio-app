import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import Usuarios from './pages/admin/Usuarios';


// Páginas públicas
import Login from './pages/Login';

// Área do Administrador
import AdminDashboard from './pages/admin/Dashboard';
import Empresas from './pages/admin/Empresas';

// Área do Supervisor
import SupervisorDashboard from './pages/supervisor/Dashboard';
import Tecnicos from './pages/supervisor/Tecnicos';
import Clientes from './pages/supervisor/Clientes';
import Ordens from './pages/supervisor/Ordens';
import Solicitacoes from './pages/supervisor/Solicitacoes';

// Área do Técnico
import TecnicoLayout from './components/tecnico/TecnicoLayout';
import TecnicoDashboard from './pages/tecnico/Dashboard';
import Deslocamento from './pages/tecnico/Deslocamento';
import AssistenteIA from './pages/tecnico/Assistente';
import Materiais from './pages/tecnico/Materiais';
import Avaliacao from './pages/tecnico/Avaliacao';

// Componente de Rota Protegida
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento inicial
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas do Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/empresas"
          element={
            <ProtectedRoute>
              <Empresas />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/Usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          } />

        {/* Rotas do Supervisor */}
        <Route
          path="/supervisor/dashboard"
          element={
            <ProtectedRoute>
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/tecnicos"
          element={
            <ProtectedRoute>
              <Tecnicos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/ordens"
          element={
            <ProtectedRoute>
              <Ordens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/solicitacoes"
          element={
            <ProtectedRoute>
              <Solicitacoes />
            </ProtectedRoute>
          }
        />

        {/* Rotas do Técnico com layout e aninhamento */}
        <Route
          path="/tecnico"
          element={
            <ProtectedRoute>
              <TecnicoLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/tecnico/dashboard" replace />} />
          <Route path="dashboard" element={<TecnicoDashboard />} />
          <Route path="deslocamento" element={<Deslocamento />} />
          <Route path="assistente" element={<AssistenteIA />} />
          <Route path="materiais" element={<Materiais />} />
          <Route path="avaliacao" element={<Avaliacao />} />
        </Route>

        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
