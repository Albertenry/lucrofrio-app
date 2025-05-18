import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

interface SupervisorLayoutProps {
  children: React.ReactNode;
  title: string;
}

const SupervisorLayout = ({ children, title }: SupervisorLayoutProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        onLogout={handleLogout}
        menuItems={[
          { path: '/supervisor/dashboard', icon: 'home', label: 'Dashboard' },
          { path: '/supervisor/tecnicos', icon: 'users', label: 'Técnicos' },
          { path: '/supervisor/clientes', icon: 'briefcase', label: 'Clientes' },
          { path: '/supervisor/ordens', icon: 'clipboard', label: 'Ordens de Serviço' },
          { path: '/supervisor/solicitacoes', icon: 'package', label: 'Solicitações' },
        ]}
      />
      
      <div className="flex-1 lg:ml-64 p-0">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SupervisorLayout;
