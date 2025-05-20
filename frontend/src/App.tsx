import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { JSX } from 'react/jsx-runtime'; // Importante: incluir este import
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Empresas from './pages/admin/Empresas';
import SupervisorDashboard from './pages/supervisor/Dashboard';
import Tecnicos from './pages/supervisor/Tecnicos';
import Clientes from './pages/supervisor/Clientes';
import Ordens from './pages/supervisor/Ordens';
import Solicitacoes from './pages/supervisor/Solicitacoes';

// Componente de proteção de rota
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
        <Route path="/login" element={<Login />} />
        
        {/* Rotas do Administrador */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/empresas" element={
          <ProtectedRoute>
            <Empresas />
          </ProtectedRoute>
        } />
        
        {/* Rotas do Supervisor */}
        <Route path="/supervisor/dashboard" element={
          <ProtectedRoute>
            <SupervisorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/tecnicos" element={
          <ProtectedRoute>
            <Tecnicos />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/clientes" element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/ordens" element={
          <ProtectedRoute>
            <Ordens />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/solicitacoes" element={
          <ProtectedRoute>
            <Solicitacoes />
          </ProtectedRoute>
        } />
        
        {/* Redireciona para login se a rota não for encontrada */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
