import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';

// Dados de exemplo
const tecnicosIniciais = [
    { id: 1, nome: 'Allan Silva', email: 'allan@lucrofrio.com', telefone: '(85) 98765-4321', especialidade: 'Refrigeração Industrial', avaliacao: 4.8 },
    { id: 2, nome: 'Douglas Oliveira', email: 'douglas@lucrofrio.com', telefone: '(85) 98765-4322', especialidade: 'Ar Condicionado', avaliacao: 4.6 },
    { id: 3, nome: 'Edinei Nogueira', email: 'edinei@lucrofrio.com', telefone: '(85) 98765-4323', especialidade: 'Câmaras Frigoríficas', avaliacao: 4.7 },
    { id: 4, nome: 'Carlos Mendes', email: 'carlos@lucrofrio.com', telefone: '(85) 98765-4324', especialidade: 'Manutenção Preventiva', avaliacao: 4.5 },
    { id: 5, nome: 'Roberto Alves', email: 'roberto@lucrofrio.com', telefone: '(85) 98765-4325', especialidade: 'Instalação', avaliacao: 4.3 },
];

const Tecnicos: React.FC = () => {
    const [tecnicos, setTecnicos] = useState(tecnicosIniciais);
    const [showModal, setShowModal] = useState(false);
    const [currentTecnico, setCurrentTecnico] = useState({ id: 0, nome: '', email: '', telefone: '', especialidade: '', avaliacao: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
    const [avaliacaoTemp, setAvaliacaoTemp] = useState(0);

    const handleAddClick = () => {
        setCurrentTecnico({ id: 0, nome: '', email: '', telefone: '', especialidade: '', avaliacao: 0 });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditClick = (tecnico: any) => {
        setCurrentTecnico(tecnico);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este técnico?')) {
            setTecnicos(tecnicos.filter(tecnico => tecnico.id !== id));
        }
    };

    const handleAvaliacaoClick = (tecnico: any) => {
        setCurrentTecnico(tecnico);
        setAvaliacaoTemp(tecnico.avaliacao);
        setShowAvaliacaoModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            setTecnicos(tecnicos.map(tecnico =>
                tecnico.id === currentTecnico.id ? currentTecnico : tecnico
            ));
        } else {
            const newId = Math.max(0, ...tecnicos.map(t => t.id)) + 1;
            setTecnicos([...tecnicos, { ...currentTecnico, id: newId, avaliacao: 0 }]);
        }

        setShowModal(false);
    };

    const handleAvaliacaoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTecnicos(tecnicos.map(tecnico =>
            tecnico.id === currentTecnico.id ? { ...tecnico, avaliacao: avaliacaoTemp } : tecnico
        ));

        setShowAvaliacaoModal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentTecnico({ ...currentTecnico, [name]: value });
    };

    return (
        <SupervisorLayout title="Gerenciamento de Técnicos">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Técnicos</h2>
                <button
                    onClick={handleAddClick}
                    className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <FiPlus className="mr-2" /> Novo Técnico
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
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Telefone
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Especialidade
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Avaliação
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tecnicos.map((tecnico) => (
                            <tr key={tecnico.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{tecnico.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tecnico.nome}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tecnico.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tecnico.telefone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tecnico.especialidade}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 mr-1">{tecnico.avaliacao.toFixed(1)}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(tecnico.avaliacao) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleAvaliacaoClick(tecnico)}
                                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                                        title="Avaliar"
                                    >
                                        <FiStar size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(tecnico)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        title="Editar"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(tecnico.id)}
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
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {isEditing ? 'Editar Técnico' : 'Novo Técnico'}
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
                                        value={currentTecnico.nome}
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
                                        value={currentTecnico.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefone">
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        id="telefone"
                                        name="telefone"
                                        value={currentTecnico.telefone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="especialidade">
                                        Especialidade
                                    </label>
                                    <input
                                        type="text"
                                        id="especialidade"
                                        name="especialidade"
                                        value={currentTecnico.especialidade}
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

            {/* Modal de Avaliação */}
            {showAvaliacaoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Avaliar Técnico: {currentTecnico.nome}
                            </h3>

                            <form onSubmit={handleAvaliacaoSubmit}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Avaliação
                                    </label>
                                    <div className="flex items-center justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setAvaliacaoTemp(star)}
                                                className="focus:outline-none mx-1"
                                            >
                                                <svg
                                                    className={`w-10 h-10 ${star <= avaliacaoTemp ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-lg font-bold text-gray-700">{avaliacaoTemp.toFixed(1)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowAvaliacaoModal(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Salvar Avaliação
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </SupervisorLayout>
    );
};

export default Tecnicos;
