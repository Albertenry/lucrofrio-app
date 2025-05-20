import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck, FiShoppingCart, FiPackage } from 'react-icons/fi';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';

// Dados de exemplo
const solicitacoesIniciais = [
    {
        id: 1,
        ordemId: 1,
        cliente: 'São Luiz',
        unidade: 'Unid Padaria',
        material: 'Contactor 25A',
        quantidade: 2,
        notas: 'Necessário para substituir peça com defeito no sistema de refrigeração.',
        status: 'Solicitado',
        dataSolicitacao: '16/05/2025',
        dataCompra: '',
        dataInstalacao: ''
    },
    {
        id: 2,
        ordemId: 1,
        cliente: 'São Luiz',
        unidade: 'Unid Padaria',
        material: 'Cabo de alimentação 4mm',
        quantidade: 5,
        notas: 'Metragem em metros. Cabo flexível.',
        status: 'Comprado',
        dataSolicitacao: '16/05/2025',
        dataCompra: '17/05/2025',
        dataInstalacao: ''
    },
    {
        id: 3,
        ordemId: 3,
        cliente: 'CARNAÚBA',
        unidade: 'Unid Messejana',
        material: 'Contactor 40A',
        quantidade: 1,
        notas: 'Modelo específico para compressor industrial.',
        status: 'Instalado',
        dataSolicitacao: '15/05/2025',
        dataCompra: '16/05/2025',
        dataInstalacao: '17/05/2025'
    },
    {
        id: 4,
        ordemId: 4,
        cliente: 'NIDOBOX',
        unidade: 'Unid MARACANAU',
        material: 'Gás refrigerante R-410A',
        quantidade: 1,
        notas: 'Cilindro de 11kg.',
        status: 'Comprado',
        dataSolicitacao: '14/05/2025',
        dataCompra: '15/05/2025',
        dataInstalacao: ''
    },
    {
        id: 5,
        ordemId: 5,
        cliente: 'BARATÃO',
        unidade: 'Unid MATRIZ',
        material: 'Filtro secador 3/8"',
        quantidade: 3,
        notas: 'Para manutenção preventiva das câmaras frias.',
        status: 'Solicitado',
        dataSolicitacao: '16/05/2025',
        dataCompra: '',
        dataInstalacao: ''
    },
];

// Lista de ordens para o dropdown
const ordens = [
    { id: 1, cliente: 'São Luiz', unidade: 'Unid Padaria', descricao: 'Verificar acúmulo de gelo no evaporador da confeitaria' },
    { id: 2, cliente: 'NIDOBOX', unidade: 'Unid PASSARE', descricao: 'Ilha com baixo rendimento' },
    { id: 3, cliente: 'CARNAÚBA', unidade: 'Unid Messejana', descricao: 'Trocar contactor e cabo de alimentação do compressor' },
    { id: 4, cliente: 'NIDOBOX', unidade: 'Unid MARACANAU', descricao: 'Verificar duas ilhas' },
    { id: 5, cliente: 'BARATÃO', unidade: 'Unid MATRIZ', descricao: 'Câmara de frios' },
];

const Solicitacoes: React.FC = () => {
    const [solicitacoes, setSolicitacoes] = useState(solicitacoesIniciais);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentSolicitacao, setCurrentSolicitacao] = useState({
        id: 0,
        ordemId: 0,
        cliente: '',
        unidade: '',
        material: '',
        quantidade: 1,
        notas: '',
        status: 'Solicitado',
        dataSolicitacao: new Date().toLocaleDateString('pt-BR'),
        dataCompra: '',
        dataInstalacao: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [showFilters, setShowFilters] = useState(false);

    // Filtrar solicitações com base nos filtros selecionados
    const filteredSolicitacoes = solicitacoes.filter(solicitacao => {
        const matchStatus = filtroStatus === 'Todos' || solicitacao.status === filtroStatus;
        return matchStatus;
    });

    const handleAddClick = () => {
        setCurrentSolicitacao({
            id: 0,
            ordemId: 0,
            cliente: '',
            unidade: '',
            material: '',
            quantidade: 1,
            notas: '',
            status: 'Solicitado',
            dataSolicitacao: new Date().toLocaleDateString('pt-BR'),
            dataCompra: '',
            dataInstalacao: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditClick = (solicitacao: any) => {
        setCurrentSolicitacao(solicitacao);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleViewClick = (solicitacao: any) => {
        setCurrentSolicitacao(solicitacao);
        setShowViewModal(true);
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta solicitação de material?')) {
            setSolicitacoes(solicitacoes.filter(solicitacao => solicitacao.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            setSolicitacoes(solicitacoes.map(solicitacao =>
                solicitacao.id === currentSolicitacao.id ? currentSolicitacao : solicitacao
            ));
        } else {
            const newId = Math.max(0, ...solicitacoes.map(s => s.id)) + 1;
            setSolicitacoes([...solicitacoes, { ...currentSolicitacao, id: newId }]);
        }

        setShowModal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentSolicitacao({ ...currentSolicitacao, [name]: value });
    };

    const handleOrdemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ordemId = parseInt(e.target.value);

        const ordemSelecionada = ordens.find(o => o.id === ordemId);
        if (ordemSelecionada) {
            setCurrentSolicitacao({
                ...currentSolicitacao,
                ordemId,
                cliente: ordemSelecionada.cliente,
                unidade: ordemSelecionada.unidade
            });
        } else {
            setCurrentSolicitacao({
                ...currentSolicitacao,
                ordemId: 0,
                cliente: '',
                unidade: ''
            });
        }
    };

    const handleStatusChange = (id: number, newStatus: string) => {
        const today = new Date().toLocaleDateString('pt-BR');

        setSolicitacoes(solicitacoes.map(solicitacao => {
            if (solicitacao.id === id) {
                let updatedSolicitacao = { ...solicitacao, status: newStatus };

                if (newStatus === 'Comprado') {
                    updatedSolicitacao.dataCompra = today;
                } else if (newStatus === 'Instalado') {
                    updatedSolicitacao.dataInstalacao = today;
                }

                return updatedSolicitacao;
            }
            return solicitacao;
        }));
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
        <SupervisorLayout title="Solicitações de Material">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Solicitações</h2>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FiEye className="mr-2" /> Filtros
                    </button>

                    <button
                        onClick={handleAddClick}
                        className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FiPlus className="mr-2" /> Nova Solicitação
                    </button>
                </div>
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
                                <option value="Solicitado">Solicitado</option>
                                <option value="Comprado">Comprado</option>
                                <option value="Instalado">Instalado</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                                Unidade
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
                        {filteredSolicitacoes.map((solicitacao) => (
                            <tr key={solicitacao.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{solicitacao.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {solicitacao.cliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {solicitacao.unidade}
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
                                    {solicitacao.dataSolicitacao}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewClick(solicitacao)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                        title="Visualizar"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(solicitacao)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        title="Editar"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(solicitacao.id)}
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

            {/* Modal de Cadastro/Edição */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {isEditing ? 'Editar Solicitação de Material' : 'Nova Solicitação de Material'}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ordemId">
                                        Ordem de Serviço
                                    </label>
                                    <select
                                        id="ordemId"
                                        value={currentSolicitacao.ordemId}
                                        onChange={handleOrdemChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    >
                                        <option value="">Selecione uma ordem de serviço</option>
                                        {ordens.map(ordem => (
                                            <option key={ordem.id} value={ordem.id}>
                                                #{ordem.id} - {ordem.cliente} ({ordem.unidade}) - {ordem.descricao.substring(0, 30)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="material">
                                            Material
                                        </label>
                                        <input
                                            type="text"
                                            id="material"
                                            name="material"
                                            value={currentSolicitacao.material}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantidade">
                                            Quantidade
                                        </label>
                                        <input
                                            type="number"
                                            id="quantidade"
                                            name="quantidade"
                                            value={currentSolicitacao.quantidade}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notas">
                                        Notas
                                    </label>
                                    <textarea
                                        id="notas"
                                        name="notas"
                                        value={currentSolicitacao.notas}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows={3}
                                    ></textarea>
                                </div>

                                {isEditing && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={currentSolicitacao.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="Solicitado">Solicitado</option>
                                            <option value="Comprado">Comprado</option>
                                            <option value="Instalado">Instalado</option>
                                        </select>
                                    </div>
                                )}

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

            {/* Modal de Visualização */}
            {showViewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Detalhes da Solicitação #{currentSolicitacao.id}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Cliente:</p>
                                    <p className="text-sm text-gray-900">{currentSolicitacao.cliente}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Unidade:</p>
                                    <p className="text-sm text-gray-900">{currentSolicitacao.unidade}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Material:</p>
                                    <p className="text-sm text-gray-900">{currentSolicitacao.material}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Quantidade:</p>
                                    <p className="text-sm text-gray-900">{currentSolicitacao.quantidade}</p>
                                </div>
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
                                    <p className="text-sm text-gray-900">{currentSolicitacao.dataSolicitacao}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Data de Compra:</p>
                                    <p className="text-sm text-gray-900">{currentSolicitacao.dataCompra || 'Não registrado'}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm font-bold text-gray-700">Data de Instalação:</p>
                                <p className="text-sm text-gray-900">{currentSolicitacao.dataInstalacao || 'Não registrado'}</p>
                            </div>

                            <div className="flex flex-wrap justify-between">
                                <div className="mb-4">
                                    {currentSolicitacao.status === 'Solicitado' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleStatusChange(currentSolicitacao.id, 'Comprado');
                                                setShowViewModal(false);
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center mr-2"
                                        >
                                            <FiShoppingCart className="mr-2" /> Marcar como Comprado
                                        </button>
                                    )}

                                    {currentSolicitacao.status === 'Comprado' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleStatusChange(currentSolicitacao.id, 'Instalado');
                                                setShowViewModal(false);
                                            }}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center mr-2"
                                        >
                                            <FiCheck className="mr-2" /> Marcar como Instalado
                                        </button>
                                    )}
                                </div>

                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => setShowViewModal(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2"
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handleEditClick(currentSolicitacao);
                                        }}
                                        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SupervisorLayout>
    );
};

export default Solicitacoes;
