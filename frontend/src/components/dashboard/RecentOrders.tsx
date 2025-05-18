import { FiEye } from 'react-icons/fi';

// Dados de exemplo
const orders = [
  { id: 1, cliente: 'São Luiz', unidade: 'Unid Padaria', tecnico: 'Allan', criticidade: 'Alta', status: 'Em andamento', data: '16/05/2025' },
  { id: 2, cliente: 'NIDOBOX', unidade: 'Unid PASSARE', tecnico: 'Allan', criticidade: 'Média', status: 'Concluído', data: '16/05/2025' },
  { id: 3, cliente: 'CARNAÚBA', unidade: 'Unid Messejana', tecnico: 'Allan', criticidade: 'Baixa', status: 'Pendente', data: '16/05/2025' },
  { id: 4, cliente: 'NIDOBOX', unidade: 'Unid MARACANAU', tecnico: 'Douglas', criticidade: 'Alta', status: 'Concluído', data: '16/05/2025' },
  { id: 5, cliente: 'BARATÃO', unidade: 'Unid MATRIZ', tecnico: 'Douglas', criticidade: 'Média', status: 'Em andamento', data: '16/05/2025' },
];

const RecentOrders = () => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Ordens Recentes</h3>
      </div>
      
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.cliente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.unidade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.tecnico}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCriticidadeClass(order.criticidade)}`}>
                    {order.criticidade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.data}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-blue-700">
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
