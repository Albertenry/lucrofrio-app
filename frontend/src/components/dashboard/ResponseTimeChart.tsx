import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Dados de exemplo
const data = [
  { name: 'Jan', tempo: 120 },
  { name: 'Fev', tempo: 132 },
  { name: 'Mar', tempo: 101 },
  { name: 'Abr', tempo: 134 },
  { name: 'Mai', tempo: 90 },
  { name: 'Jun', tempo: 85 },
];

const ResponseTimeChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tempo Médio de Resposta (minutos)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="tempo"
              name="Tempo Médio (min)"
              stroke="#0000ff"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResponseTimeChart;
