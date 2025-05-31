import React, { useState, useEffect } from 'react';
import { FiClipboard, FiClock, FiStar } from 'react-icons/fi';
import MetricCard from '@/components/dashboard/MetricCard';
import { tecnicoService, authService } from '@/services/api';

const TecnicoDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_ordens: 0,
    tempo_medio: 0,
    avaliacao: 0
  });
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obter estatísticas do técnico
        const avaliacaoData = await tecnicoService.getAvaliacao();
        setStats(avaliacaoData);
        
        // Obter ordens de serviço
        const ordensData = await tecnicoService.getOrdens();
        setOrdens(ordensData);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Falha ao carregar dados. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluído':
        return 'bg-green-100 text-green-800';
      case 'em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard do Técnico</h1>
        <p className="text-gray-600">Bem-vindo, {user?.nome_completo || 'Técnico'}</p>
        <p className="text-gray-600">Aqui está um resumo das suas atividades</p>
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard 
              title="Ordens Concluídas" 
              value={stats.total_ordens.toString()} 
              icon={<FiClipboard size={24} />} 
            />
            <MetricCard 
              title="Tempo Médio (min)" 
              value={stats.tempo_medio.toFixed(0)} 
              icon={<FiClock size={24} />} 
            />
            <MetricCard 
              title="Avaliação" 
              value={stats.avaliacao.toFixed(1)} 
              icon={<FiStar size={24} />} 
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Ordens de Serviço Recentes</h3>
            </div>
            
            {ordens.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhuma ordem de serviço encontrada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordens.slice(0, 5).map((ordem: any) => (
                      <tr key={ordem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{ordem.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ordem.cliente_nome}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {ordem.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ordem.status)}`}>
                            {ordem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ordem.criado_em).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TecnicoDashboard;
