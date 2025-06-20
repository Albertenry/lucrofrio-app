import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import { authService } from '@/services/api'

const TecnicoLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Implementação da lógica de logout
    authService.logout();
    navigate('/login');
  }

  const tecnicoMenuItems = [
    {
      path: '/tecnico/dashboard',
      icon: 'home',
      label: 'Dashboard',
    },
    {
      path: '/tecnico/deslocamento',
      icon: 'briefcase',
      label: 'Deslocamento',
    },
    {
      path: '/tecnico/assistente',
      icon: 'settings',
      label: 'Assistente IA',
    },
    {
      path: '/tecnico/materiais',
      icon: 'package',
      label: 'Materiais',
    },
    {
      path: '/tecnico/avaliacao',
      icon: 'clipboard',
      label: 'Avaliação',
    },
  ]

  return (
    <div className="flex">
      {/* Sidebar personalizado do técnico */}
      <Sidebar onLogout={handleLogout} menuItems={tecnicoMenuItems} />

      {/* Conteúdo principal com espaço para rotas */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default TecnicoLayout
