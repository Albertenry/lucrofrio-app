import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

interface Usuario {
  id: number;
  nome_completo: string;
  email: string;
  senha?: string;
  funcao: 'admin' | 'supervisor' | 'tecnico';
  empresa_id: number;
}

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<Omit<Usuario, 'id'> & { senha: string }>({
    nome_completo: '',
    email: '',
    senha: '',
    funcao: 'tecnico',
    empresa_id: 1
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/usuarios', {
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (!res.ok) throw new Error('Falha ao carregar usuários');

      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar a lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({
      nome_completo: '',
      email: '',
      senha: '',
      funcao: 'tecnico',
      empresa_id: 1
    });
    setIsEditing(false);
    setCurrentUsuario(null);
    setShowModal(true);
  };

  const handleEditClick = (usuario: Usuario) => {
    setFormData({
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      senha: '',
      funcao: usuario.funcao,
      empresa_id: usuario.empresa_id
    });
    setIsEditing(true);
    setCurrentUsuario(usuario);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'empresa_id' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const url = isEditing && currentUsuario
        ? `http://localhost:5000/api/auth/usuarios/${currentUsuario.id}`
        : 'http://localhost:5000/api/auth/register';

      const method = isEditing ? 'PUT' : 'POST';
      const payload: any = { ...formData };

      if (isEditing && !payload.senha) {
        delete payload.senha;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Erro ao processar a solicitação');
      }

      await fetchUsuarios();
      setShowModal(false);
      setSuccess(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao processar a solicitação.');
    }
  };

  const handleDeleteClick = async (usuario: Usuario) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome_completo}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/usuarios/${usuario.id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (!res.ok) throw new Error('Falha ao excluir usuário');

      await fetchUsuarios();
      setSuccess('Usuário excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Não foi possível excluir o usuário.');
    }
  };

  return (
    <div>
      {/* Mensagens */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
        <p className="text-gray-600">Cadastre e gerencie usuários do sistema</p>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}

      {/* Ações */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <button
          onClick={handleAddClick}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> Novo Usuário
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredUsuarios.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nenhum usuário encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{usuario.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{usuario.nome_completo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{usuario.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          usuario.funcao === 'admin' ? 'bg-purple-100 text-purple-800' :
                          usuario.funcao === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {usuario.funcao === 'admin' ? 'Administrador' :
                           usuario.funcao === 'supervisor' ? 'Supervisor' : 'Técnico'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(usuario)} className="text-blue-600 hover:text-blue-900 mr-3">
                          <FiEdit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteClick(usuario)} className="text-red-600 hover:text-red-900">
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={handleSubmit}>
              {['nome_completo', 'email', 'senha'].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {field === 'senha' && isEditing ? 'Senha (deixe em branco para manter)' : field.replace('_', ' ')}
                  </label>
                  <input
                    type={field === 'senha' ? 'password' : 'text'}
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required={field !== 'senha' || !isEditing}
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Função</label>
                <select
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="tecnico">Técnico</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Empresa ID</label>
                <input
                  type="number"
                  name="empresa_id"
                  value={formData.empresa_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  {isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
