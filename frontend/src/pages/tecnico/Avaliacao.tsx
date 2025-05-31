import React, { useState, useEffect } from 'react';
import { FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { tecnicoService, authService } from '@/services/api';

const Avaliacao: React.FC = () => {
  const [stats, setStats] = useState({
    total_ordens: 0,
    tempo_medio: 0,
    avaliacao: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await tecnicoService.getAvaliacao();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar avaliação:', err);
        setError('Falha ao carregar dados de avaliação. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-8 h-8 ${star <= Math.round(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Minha Avaliação</h1>
        <p className="text-gray-600">Acompanhe seu desempenho e métricas de avaliação</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Avaliação Geral</h3>

            <div className="flex items-center mb-6">
              <div className="mr-4">
                <span className="text-4xl font-bold text-gray-800">{stats.avaliacao.toFixed(1)}</span>
                <span className="text-gray-500">/5.0</span>
              </div>

              <div>
                {renderStars(stats.avaliacao)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiCheckCircle className="text-green-500 mr-2" size={20} />
                  <h4 className="font-semibold text-gray-700">Ordens Concluídas</h4>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.total_ordens}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiClock className="text-blue-500 mr-2" size={20} />
                  <h4 className="font-semibold text-gray-700">Tempo Médio</h4>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.tempo_medio.toFixed(0)} <span className="text-sm text-gray-500">min</span></p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dicas para Melhorar</h3>

            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">Registre a chegada e saída de cada atendimento com precisão</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">Documente detalhadamente os serviços realizados</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">Utilize as ferramentas recomendadas para cada tipo de serviço</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">Mantenha comunicação clara com os clientes</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">Solicite materiais com antecedência para evitar atrasos</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avaliacao;
