import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';

// Dados de exemplo
const ordensIniciais = [
    {
        id: 1,
        cliente: 'São Luiz',
        unidade: 'Unid Padaria',
        tecnico: 'Allan',
        descricao: 'Verificar acúmulo de gelo no evaporador da confeitaria. Câmara de congelados evaporadores fazendo barulho.',
        criticidade: 'Alta',
        status: 'Em andamento',
        data: '16/05/2025',
        horaChegada: '11:00:28',
        horaSaida: '14:58:04'
    },
    {
        id: 2,
        cliente: 'NIDOBOX',
        unidade: 'Unid PASSARE',
        tecnico: 'Allan',
        descricao: 'Ilha com baixo rendimento A 005.205 e 005.206',
        criticidade: 'Média',
        status: 'Concluído',
        data: '16/05/2025',
        horaChegada: '09:11:00',
        horaSaida: '16:25:55'
    },
    {
        id: 3,
        cliente: 'CARNAÚBA',
        unidade: 'Unid Messejana',
        tecnico: 'Allan',
        descricao: 'Trocar contactor e cabo de alimentação do compressor. Material em loja.',
        criticidade: 'Baixa',
        status: 'Pendente',
        data: '16/05/2025',
        horaChegada: '',
        horaSaida: ''
    },
    {
        id: 4,
        cliente: 'NIDOBOX',
        unidade: 'Unid MARACANAU',
        tecnico: 'Douglas',
        descricao: 'Verificar duas ilhas: uma no salão setor de frios e outra no subsolo',
        criticidade: 'Alta',
        status: 'Concluído',
        data: '16/05/2025',
        horaChegada: '08:55:11',
        horaSaida: '10:14:38'
    },
    {
        id: 5,
        cliente: 'BARATÃO',
        unidade: 'Unid MATRIZ',
        tecnico: 'Douglas',
        descricao: 'Câmara de frios',
        criticidade: 'Média',
        status: 'Em andamento',
        data: '16/05/2025',
        horaChegada: '08:25:00',
        horaSaida: ''
    },
];

// Lista de técnicos para o dropdown
const tecnicos = [
    { id: 1, nome: 'Allan Silva' },
    { id: 2, nome: 'Douglas Oliveira' },
    { id: 3, nome: 'Edinei Nogueira' },
    { id: 4, nome: 'Carlos Mendes' },
    { id: 5, nome: 'Roberto Alves' },
];

// Lista de clientes para o dropdown
const clientes = [
    { id: 1, nome: 'São Luiz', unidades: ['Unid Padaria', 'Unid Cocó'] },
    { id: 2, nome: 'NIDOBOX', unidades: ['Unid PASSARE', 'Unid MARACANAU'] },
    { id: 3, nome: 'CARNAÚBA', unidades: ['Unid Messejana', 'Unid Itaitinga'] },
    { id: 4, nome: 'BARATÃO', unidades: ['Unid MATRIZ'] },
    { id: 5, nome: 'Spovo', unidades: ['Unid Loja 9'] },
];

const Ordens: React.FC = () => {
    const [ordens, setOrdens] = useState(ordensIniciais);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentOrdem, setCurrentOrdem] = useState({
        id: 0,
        cliente: '',
        unidade: '',
        tecnico: '',
        descricao: '',
        criticidade: 'Média',
        status: 'Pendente',
        data: new Date().toLocaleDateString('pt-BR'),
        horaChegada: '',
        horaSaida: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [filtroCriticidade, setFiltroCriticidade] = useState('Todas');
    const [filtroTecnico, setFiltroTecnico] = useState('Todos');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState(0);
    const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<string[]>([]);

    // Filtrar ordens com base nos filtros selecionados
    const filteredOrdens = ordens.filter(ordem => {
        const matchStatus = filtroStatus === 'Todos' || ordem.status === filtroStatus;
        const matchCriticidade = filtroCriticidade === 'Todas' || ordem.criticidade === filtroCriticidade;
        const matchTecnico = filtroTecnico === 'Todos' || ordem.tecnico === filtroTecnico;
        return matchStatus && matchCriticidade && matchTecnico;
    });

    const handleAddClick = () => {
        setCurrentOrdem({
            id: 0,
            cliente: '',
            unidade: '',
            tecnico: '',
            descricao: '',
            criticidade: 'Média',
            status: 'Pendente',
            data: new Date().toLocaleDateString('pt-BR'),
            horaChegada: '',
            horaSaida: ''
        });
        setIsEditing(false);
        setSelectedClienteId(0);
        setUnidadesDisponiveis([]);
        setShowModal(true);
    };

    const handleEditClick = (ordem: any) => {
        setCurrentOrdem(ordem);
        setIsEditing(true);

        // Encontrar o ID do cliente selecionado
        const clienteObj = clientes.find(c => c.nome === ordem.cliente);
        setSelectedClienteId(clienteObj ? clienteObj.id : 0);

        // Atualizar unidades disponíveis
        if (clienteObj) {
            setUnidadesDisponiveis(clienteObj.unidades);
        }

        setShowModal(true);
    };

    const handleViewClick = (ordem: any) => {
        setCurrentOrdem(ordem);
        setShowViewModal(true);
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            setOrdens(ordens.filter(ordem => ordem.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            setOrdens(ordens.map(ordem =>
                ordem.id === currentOrdem.id ? currentOrdem : ordem
            ));
        } else {
            const newId = Math.max(0, ...ordens.map(o => o.id)) + 1;
            setOrdens([...ordens, { ...currentOrdem, id: newId }]);
        }

        setShowModal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentOrdem({ ...currentOrdem, [name]: value });
    };

    const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clienteId = parseInt(e.target.value);
        setSelectedClienteId(clienteId);

        const clienteSelecionado = clientes.find(c => c.id === clienteId);
        if (clienteSelecionado) {
            setCurrentOrdem({
                ...currentOrdem,
                cliente: clienteSelecionado.nome,
                unidade: '' // Limpar a unidade quando o cliente muda
            });
            setUnidadesDisponiveis(clienteSelecionado.unidades);
        } else {
            setCurrentOrdem({
                ...currentOrdem,
                cliente: '',
                unidade: ''
            });
            setUnidadesDisponiveis([]);
        }
    };

    const getCriticidadeClass = (criticidade: string) => {
        switch (criticidade.toLowerCase()) {
            case 'alta':
                return 'bg-red-100 text-red-800';
            case 'média':
                return 'bg-yellow-100 text-yellow-800';
            case 'baixa':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
        <SupervisorLayout title="Gerenciamento de Ordens de Serviço">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Ordens de Serviço</h2>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FiFilter className="mr-2" /> Filtros
                    </button>

                    <button
                        onClick={handleAddClick}
                        className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FiPlus className="mr-2" /> Nova Ordem
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
                                <option value="Pendente">Pendente</option>
                                <option value="Em andamento">Em andamento</option>
                                <option value="Concluído">Concluído</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Criticidade
                            </label>
                            <select
                                value={filtroCriticidade}
                                onChange={(e) => setFiltroCriticidade(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Todas">Todas</option>
                                <option value="Baixa">Baixa</option>
                                <option value="Média">Média</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Técnico
                            </label>
                            <select
                                value={filtroTecnico}
                                onChange={(e) => setFiltroTecnico(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Todos">Todos</option>
                                {tecnicos.map(tecnico => (
                                    <option key={tecnico.id} value={tecnico.nome}>{tecnico.nome}</option>
                                ))}
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
                                Técnico
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Criticidade
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
                        {filteredOrdens.map((ordem) => (
                            <tr key={ordem.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{ordem.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ordem.cliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ordem.unidade}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ordem.tecnico}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCriticidadeClass(ordem.criticidade)}`}>
                                        {ordem.criticidade}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ordem.status)}`}>
                                        {ordem.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ordem.data}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewClick(ordem)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                        title="Visualizar"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(ordem)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        title="Editar"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(ordem.id)}
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
                                {isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cliente">
                                            Cliente
                                        </label>
                                        <select
                                            id="cliente"
                                            value={selectedClienteId}
                                            onChange={handleClienteChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="">Selecione um cliente</option>
                                            {clientes.map(cliente => (
                                                <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unidade">
                                            Unidade
                                        </label>
                                        <select
                                            id="unidade"
                                            name="unidade"
                                            value={currentOrdem.unidade}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                            disabled={unidadesDisponiveis.length === 0}
                                        >
                                            <option value="">Selecione uma unidade</option>
                                            {unidadesDisponiveis.map(unidade => (
                                                <option key={unidade} value={unidade}>{unidade}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tecnico">
                                            Técnico
                                        </label>
                                        <select
                                            id="tecnico"
                                            name="tecnico"
                                            value={currentOrdem.tecnico}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="">Selecione um técnico</option>
                                            {tecnicos.map(tecnico => (
                                                <option key={tecnico.id} value={tecnico.nome}>{tecnico.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="criticidade">
                                            Criticidade
                                        </label>
                                        <select
                                            id="criticidade"
                                            name="criticidade"
                                            value={currentOrdem.criticidade}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="Baixa">Baixa</option>
                                            <option value="Média">Média</option>
                                            <option value="Alta">Alta</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={currentOrdem.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="Pendente">Pendente</option>
                                            <option value="Em andamento">Em andamento</option>
                                            <option value="Concluído">Concluído</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
                                        Descrição
                                    </label>
                                    <textarea
                                        id="descricao"
                                        name="descricao"
                                        value={currentOrdem.descricao}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows={4}
                                        required
                                    ></textarea>
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

            {/* Modal de Visualização */}
            {showViewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Detalhes da Ordem de Serviço #{currentOrdem.id}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Cliente:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.cliente}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Unidade:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.unidade}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Técnico:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.tecnico}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Criticidade:</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCriticidadeClass(currentOrdem.criticidade)}`}>
                                        {currentOrdem.criticidade}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Status:</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(currentOrdem.status)}`}>
                                        {currentOrdem.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-bold text-gray-700">Descrição:</p>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{currentOrdem.descricao}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Data:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.data}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Hora de Chegada:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.horaChegada || 'Não registrado'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700">Hora de Saída:</p>
                                    <p className="text-sm text-gray-900">{currentOrdem.horaSaida || 'Não registrado'}</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
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
                                        handleEditClick(currentOrdem);
                                    }}
                                    className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SupervisorLayout>
    );
};

export default Ordens;
