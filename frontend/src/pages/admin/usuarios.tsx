import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

// Definindo a interface para o tipo Usuario
interface Usuario {
  id: number;
  nome_completo: string;
  email: string;
  login: string;
  funcao: string;
  empresa_id: number;
  senha?: string;
}

// Definindo a interface para o formulário
interface FormData {
  nome_completo: string;
  email: string;
  senha?: string;
  login: string;
  funcao: string;
  empresa_id: number;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome_completo: '',
    email: '',
    senha: '',
    login: '',
    funcao: 'tecnico',
    empresa_id: 1
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Função para buscar usuários da API
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/usuarios', {
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar usuários');
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Não foi possível carregar a lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuários com base no termo de busca
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para adicionar novo usuário
  const handleAddClick = () => {
    setFormData({
      nome_completo: '',
      email: '',
      senha: '',
      login: '',
      funcao: 'tecnico',
      empresa_id: 1
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar usuário existente
  const handleEditClick = (usuario: Usuario) => {
    setFormData({
      ...usuario,
      senha: '' // Não preencher senha para edição
    });
    setIsEditing(true);
    setCurrentUsuario(usuario);
    setShowModal(true);
  };

  // Atualizar estado do formulário quando os campos mudam
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Enviar formulário para criar/atualizar usuário
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

      // Se estiver editando e a senha estiver vazia, remova-a do payload
      const payload = { ...formData };
      if (isEditing && !payload.senha) {
        delete payload.senha;
      }

      // Se o login estiver vazio, use o email como login
      if (!payload.login) {
        payload.login = payload.email;
      }

      console.log('Enviando payload:', payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao processar a solicitação');
      }

      // Atualizar lista de usuários
      await fetchUsuarios();

      // Fechar modal e mostrar mensagem de sucesso
      setShowModal(false);
      setSuccess(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error: any) {
      console.error('Erro:', error);
      setError(error.message || 'Ocorreu um erro ao processar a solicitação.');
    }
  };

  // Excluir usuário
  const handleDeleteClick = async (usuario: Usuario) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome_completo}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/usuarios/${usuario.id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir usuário');
      }

      // Atualizar lista de usuários
      await fetchUsuarios();
      setSuccess('Usuário excluído com sucesso!');

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setError('Não foi possível excluir o usuário.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
        <p className="text-gray-600">Cadastre e gerencie usuários do sistema</p>
      </div>

      {/* Mensagens de erro e sucesso */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>{success}</p>
        </div>
      )}

      {/* Barra de ações */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
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
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors md:w-auto w-full"
        >
          <FiPlus className="mr-2" /> Novo Usuário
        </button>
      </div>

      {/* Lista de usuários */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredUsuarios.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{usuario.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.nome_completo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.login}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.funcao === 'admin' ? 'bg-purple-100 text-purple-800' :
                            usuario.funcao === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {usuario.funcao === 'admin' ? 'Administrador' :
                            usuario.funcao === 'supervisor' ? 'Supervisor' : 'Técnico'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(usuario)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Editar"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(usuario)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
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

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome_completo">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome_completo"
                    name="nome_completo"
                    value={formData.nome_completo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login">
                    Login (deixe em branco para usar o email)
                  </label>
                  <input
                    type="text"
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="senha">
                    Senha {isEditing && '(deixe em branco para manter a atual)'}
                  </label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required={!isEditing}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="funcao">
                    Função
                  </label>
                  <select
                    id="funcao"
                    name="funcao"
                    value={formData.funcao}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="tecnico">Técnico</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa_id">
                    Empresa ID
                  </label>
                  <input
                    type="number"
                    id="empresa_id"
                    name="empresa_id"
                    value={formData.empresa_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
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
    </div>
  );
};

export default Usuarios;
