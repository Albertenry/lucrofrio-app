import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard do Administrador</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo</p>
        
        <button
          onClick={handleLogout}
          className="mt-4 bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
