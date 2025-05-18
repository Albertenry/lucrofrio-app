import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

// Dados de exemplo
const empresasIniciais = [
  { id: 1, nome: 'Lucrofrio', cnpj: '00.000.000/0001-00', endereco: 'Rua Principal, 123', telefone: '(85) 3333-3333' },
  { id: 2, nome: 'São Luiz', cnpj: '11.111.111/0001-11', endereco: 'Av. Central, 456', telefone: '(85) 4444-4444' },
  { id: 3, nome: 'NIDOBOX', cnpj: '22.222.222/0001-22', endereco: 'Rua Comercial, 789', telefone: '(85) 5555-5555' },
];

const Empresas = () => {
  const [empresas, setEmpresas] = useState(empresasIniciais);
  const [showModal, setShowModal] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState({ id: 0, nome: '', cnpj: '', endereco: '', telefone: '' });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleAddClick = () => {
    setCurrentEmpresa({ id: 0, nome: '', cnpj: '', endereco: '', telefone: '' });
    setIsEditing(false);
    setShowModal(true);
  };
  
  const handleEditClick = (empresa: any) => {
    setCurrentEmpresa(empresa);
    setIsEditing(true);
    setShowModal(true);
  };
  
  const handleDeleteClick = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      setEmpresas(empresas.filter(empresa => empresa.id !== id));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      setEmpresas(empresas.map(empresa => 
        empresa.id === currentEmpresa.id ? currentEmpresa : empresa
      ));
    } else {
      const newId = Math.max(0, ...empresas.map(e => e.id)) + 1;
      setEmpresas([...empresas, { ...currentEmpresa, id: newId }]);
    }
    
    setShowModal(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEmpresa({ ...currentEmpresa, [name]: value });
  };
  
  return (
    <AdminLayout title="Empresas">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Empresas</h2>
        <button
          onClick={handleAddClick}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FiPlus className="mr-2" /> Nova Empresa
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CNPJ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endereço
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empresas.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{empresa.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empresa.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empresa.cnpj}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empresa.endereco}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empresa.telefone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditClick(empresa)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(empresa.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={currentEmpresa.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cnpj">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={currentEmpresa.cnpj}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endereco">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={currentEmpresa.endereco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefone">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    value={currentEmpresa.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    {isEditing ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Empresas;
