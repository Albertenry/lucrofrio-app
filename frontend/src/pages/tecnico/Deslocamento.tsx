import React, { useState, useEffect } from 'react';
import { FiEye, FiClock, FiCheckCircle, FiFilter } from 'react-icons/fi';
import { tecnicoService } from '@/services/api';

const Deslocamento: React.FC = () => {
    const [ordens, setOrdens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [showFilters, setShowFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentOrdem, setCurrentOrdem] = useState<any>(null);
    const [sugestoes, setSugestoes] = useState<any>(null);
    const [loadingSugestoes, setLoadingSugestoes] = useState(false);

    useEffect(() => {
        fetchOrdens();
    }, []);

    const fetchOrdens = async () => {
        try {
            setLoading(true);
            const data = await tecnicoService.getOrdens();
            setOrdens(data);
            setLoading(false);
        } catch (err) {
            console.error('Erro ao carregar ordens:', err);
            setError('Falha ao carregar ordens. Tente novamente mais tarde.');
            setLoading(false);
        }
    };

    const handleViewClick = async (ordem: any) => {
        setCurrentOrdem(ordem);
        setShowModal(true);

        try {
            setLoadingSugestoes(true);
            const data = await tecnicoService.getSugestoes(ordem.id);
            setSugestoes(data.sugestoes);
            setLoadingSugestoes(false);
        } catch (err) {
            console.error('Erro ao carregar sugestões:', err);
            setSugestoes(null);
            setLoadingSugestoes(false);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        if (!currentOrdem) return;

        const now = new Date().toLocaleTimeString('pt-BR');
        let data: any = { status };

        if (status === 'Em andamento') {
            data.hora_chegada = now;
        } else if (status === 'Concluído') {
            data.hora_saida = now;
        }

        try {
            await tecnicoService.updateOrdemStatus(currentOrdem.id, data);

            // Atualizar a ordem na lista
            setOrdens(ordens.map((ordem: any) =>
                ordem.id === currentOrdem.id
                    ? { ...ordem, status, ...data }
                    : ordem
            ));

            // Atualizar a ordem atual
            setCurrentOrdem({ ...currentOrdem, status, ...data });

            // Fechar o modal após um tempo
            setTimeout(() => {
                setShowModal(false);
            }, 1500);
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
        }
    };

    // Filtrar ordens com base nos filtros selecionados
    const filteredOrdens = ordens.filter((ordem: any) => {
        return filtroStatus === 'Todos' || ordem.status === filtroStatus;
    });

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
                <h1 className="text-2xl font-bold text-gray-800">Deslocamento</h1>
                <p className="text-gray-600">Gerencie suas ordens de serviço e registre chegada/saída</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Ordens</h2>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center transition-colors md:w-auto w-full"
                >
                    <FiFilter className="mr-2" /> Filtros
                </button>
            </div>

            {/* Filtros */}
            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Status
                            </label>
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Em andamento">Em andamento</option>
                                <option value="Concluído">Concluído</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

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
                    {filteredOrdens.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            Nenhuma ordem de serviço encontrada.
                        </div>
                    ) : (
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
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrdens.map((ordem: any) => (
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleViewClick(ordem)}
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

            {/* Modal de Visualização e Atualização */}
            {showModal && currentOrdem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Ordem de Serviço #{currentOrdem.id}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Cliente:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.cliente_nome}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Endereço:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.cliente_endereco || 'Não informado'}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-bold text-gray-700">Descrição:</p>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{currentOrdem.descricao}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Status:</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(currentOrdem.status)}`}>
                                        {currentOrdem.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Hora de Chegada:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.hora_chegada || 'Não registrado'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Hora de Saída:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.hora_saida || 'Não registrado'}</p>
                                </div>
                            </div>

                            {/* Sugestões de IA */}
                            <div className="mb-6">
                                <h4 className="text-md font-semibold text-gray-800 mb-2">Sugestões para o Serviço</h4>

                                {loadingSugestoes ? (
                                    <div className="flex justify-center items-center h-24">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </div>
                                ) : sugestoes ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-blue-800 mb-2">Ferramentas Recomendadas</h5>
                                            <ul className="list-disc pl-5 text-sm text-gray-700">
                                                {sugestoes.ferramentas.map((ferramenta: string, index: number) => (
                                                    <li key={index}>{ferramenta}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-green-800 mb-2">Instruções de Trabalho</h5>
                                            <ol className="list-decimal pl-5 text-sm text-gray-700">
                                                {sugestoes.instrucoes.map((instrucao: string, index: number) => (
                                                    <li key={index}>{instrucao}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Não foi possível carregar sugestões.</p>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-between">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {currentOrdem.status === 'Pendente' && (
                                        <button
                                            type="button"
                                            onClick={() => handleStatusUpdate('Em andamento')}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                                        >
                                            <FiClock className="mr-2" /> Registrar Chegada
                                        </button>
                                    )}

                                    {currentOrdem.status === 'Em andamento' && (
                                        <button
                                            type="button"
                                            onClick={() => handleStatusUpdate('Concluído')}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                                        >
                                            <FiCheckCircle className="mr-2" /> Concluir Serviço
                                        </button>
                                    )}
                                </div>

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

export default Deslocamento;
