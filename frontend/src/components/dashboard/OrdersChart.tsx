import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Dados de exemplo
const data = [
    { name: 'Jan', ordens: 40, concluidas: 24 },
    { name: 'Fev', ordens: 30, concluidas: 13 },
    { name: 'Mar', ordens: 20, concluidas: 18 },
    { name: 'Abr', ordens: 27, concluidas: 25 },
    { name: 'Mai', ordens: 18, concluidas: 15 },
    { name: 'Jun', ordens: 23, concluidas: 20 },
];

const OrdersChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ordens de Serviço</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ordens" name="Total de Ordens" fill="#0000ff" />
                        <Bar dataKey="concluidas" name="Ordens Concluídas" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrdersChart;
