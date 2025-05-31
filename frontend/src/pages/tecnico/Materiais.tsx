import React, { useState, useEffect } from 'react';
import { FiEye, FiPackage, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { tecnicoService } from '@/services/api';

const Materiais: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentSolicitacao, setCurrentSolicitacao] = useState<any>(null);
  
  useEffect(() => {
    fetchSolicitacoes();
  }, []);
  
  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      const data = await tecnicoService.getSolicitacoes();
      setSolicitacoes(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar solicitações:', err);
      setError('Falha ao carregar solicitações. Tente novamente mais tarde.');
      setLoading(false);
    }
  };
  
  const handleViewClick = (solicitacao: any) => {
    setCurrentSolicitacao(solicitacao);
    setShowModal(true);
  };
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'instalado':
        return 'bg-green-100 text-green-800';
      case 'comprado':
        return 'bg-blue-100 text-blue-800';
      case 'solicitado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'instalado':
        return <FiCheck className="mr-1" />;
      case 'comprado':
        return <FiShoppingCart className="mr-1" />;
      case 'solicitado':
        return <FiPackage className="mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Materiais</h1>
        <p className="text-gray-600">Acompanhe o status das solicitações de material para suas ordens de serviço</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {solicitacoes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma solicitação de material encontrada.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Solicitação
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitacoes.map((solicitacao: any) => (
                  <tr key={solicitacao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{solicitacao.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {solicitacao.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {solicitacao.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusClass(solicitacao.status)}`}>
                        {getStatusIcon(solicitacao.status)}
                        {solicitacao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitacao.data_solicitacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewClick(solicitacao)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {/* Modal de Visualização */}
      {showModal && currentSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Detalhes da Solicitação #{currentSolicitacao.id}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700">Material:</p>
                <p className="text-sm text-gray-900">{currentSolicitacao.material}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700">Quantidade:</p>
                <p className="text-sm text-gray-900">{currentSolicitacao.quantidade}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700">Notas:</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{currentSolicitacao.notas || 'Nenhuma nota adicional.'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Status:</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusClass(currentSolicitacao.status)}`}>
                    {getStatusIcon(currentSolicitacao.status)}
                    {currentSolicitacao.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-gray-700">Data de Solicitação:</p>
                  <p className="text-sm text-gray-900">{new Date(currentSolicitacao.data_solicitacao).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-gray-700">Data de Compra:</p>
                  <p className="text-sm text-gray-900">
                    {currentSolicitacao.data_compra 
                      ? new Date(currentSolicitacao.data_compra).toLocaleDateString('pt-BR') 
                      : 'Não registrado'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700">Data de Instalação:</p>
                <p className="text-sm text-gray-900">
                  {currentSolicitacao.data_instalacao 
                    ? new Date(currentSolicitacao.data_instalacao).toLocaleDateString('pt-BR') 
                    : 'Não registrado'}
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materiais;
