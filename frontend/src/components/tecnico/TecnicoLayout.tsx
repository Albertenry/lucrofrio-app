import { Outlet, useNavigate, Link } from 'react-router-dom';
import { FiHome, FiBriefcase, FiSettings, FiPackage, FiClipboard, FiLogOut } from 'react-icons/fi';
import { useEffect } from 'react';

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const TecnicoLayout = ( ) => {
  const navigate = useNavigate();
  
  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    // Implementação da lógica de logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tecnicoMenuItems: MenuItem[] = [
    {
      path: '/tecnico/dashboard',
      icon: <FiHome size={20} />,
      label: 'Dashboard',
    },
    {
      path: '/tecnico/deslocamento',
      icon: <FiBriefcase size={20} />,
      label: 'Deslocamento',
    },
    {
      path: '/tecnico/assistente',
      icon: <FiSettings size={20} />,
      label: 'Assistente IA',
    },
    {
      path: '/tecnico/materiais',
      icon: <FiPackage size={20} />,
      label: 'Materiais',
    },
    {
      path: '/tecnico/avaliacao',
      icon: <FiClipboard size={20} />,
      label: 'Avaliação',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 lg:translate-x-0 -translate-x-full lg:relative">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <span className="text-primary font-bold text-xl">Lucrofrio</span>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              {tecnicoMenuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="mr-3 text-gray-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <FiLogOut className="mr-3" size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Área do Técnico</h1>
        </header>
        
        {/* Content - This is where the Outlet will render child routes */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TecnicoLayout;
