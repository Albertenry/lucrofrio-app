import { FiUsers, FiBriefcase, FiClipboard, FiClock } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import OrdersChart from '../../components/dashboard/OrdersChart';
import ResponseTimeChart from '../../components/dashboard/ResponseTimeChart';
import RecentOrders from '../../components/dashboard/RecentOrders';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total de Empresas" 
          value="8" 
          icon={<FiBriefcase size={24} />} 
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard 
          title="Total de Usuários" 
          value="42" 
          icon={<FiUsers size={24} />} 
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard 
          title="Ordens de Serviço" 
          value="158" 
          icon={<FiClipboard size={24} />} 
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard 
          title="Tempo Médio de Resposta" 
          value="85 min" 
          icon={<FiClock size={24} />} 
          trend={{ value: 12, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <OrdersChart />
        <ResponseTimeChart />
      </div>
      
      <div className="mb-6">
        <RecentOrders />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
