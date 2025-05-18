import React from 'react';
import { FiUsers, FiClipboard, FiClock, FiCheckCircle } from 'react-icons/fi';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import OrdersChart from '../../components/dashboard/OrdersChart';
import ResponseTimeChart from '../../components/dashboard/ResponseTimeChart';

// Componente para mostrar o ranking dos técnicos
const TechnicianRanking: React.FC = () => {
    const technicians = [
        { id: 1, name: 'Allan', completedOrders: 28, avgResponseTime: 85, rating: 4.8 },
        { id: 2, name: 'Douglas', completedOrders: 24, avgResponseTime: 92, rating: 4.6 },
        { id: 3, name: 'Edinei', completedOrders: 22, avgResponseTime: 88, rating: 4.7 },
        { id: 4, name: 'Carlos', completedOrders: 19, avgResponseTime: 95, rating: 4.5 },
        { id: 5, name: 'Roberto', completedOrders: 17, avgResponseTime: 105, rating: 4.3 },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Ranking de Técnicos</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Posição
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Técnico
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ordens Concluídas
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tempo Médio (min)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Avaliação
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {technicians.map((tech, index) => (
                            <tr key={tech.id} className={index < 3 ? "bg-blue-50" : ""}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index + 1}º
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tech.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tech.completedOrders}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tech.avgResponseTime}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 mr-1">{tech.rating}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(tech.rating) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SupervisorDashboard: React.FC = () => {
    return (
        <SupervisorLayout title="Dashboard do Supervisor">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <MetricCard
                    title="Técnicos Ativos"
                    value="5"
                    icon={<FiUsers size={24} />}
                    trend={{ value: 1, isPositive: true }}
                />
                <MetricCard
                    title="Ordens em Aberto"
                    value="12"
                    icon={<FiClipboard size={24} />}
                    trend={{ value: 3, isPositive: false }}
                />
                <MetricCard
                    title="Tempo Médio de Resposta"
                    value="93 min"
                    icon={<FiClock size={24} />}
                    trend={{ value: 5, isPositive: true }}
                />
                <MetricCard
                    title="Taxa de Conclusão"
                    value="87%"
                    icon={<FiCheckCircle size={24} />}
                    trend={{ value: 2, isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <OrdersChart />
                <ResponseTimeChart />
            </div>

            <div className="mb-6">
                <TechnicianRanking />
            </div>
        </SupervisorLayout>
    );
};

export default SupervisorDashboard;
