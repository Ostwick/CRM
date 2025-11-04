import React from 'react';
import { useAppContext } from '../App';
import { NegotiationStatus } from '../types';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { CalendarIcon } from './icons/CalendarIcon';

const Dashboard = ({ setScreen }: { setScreen: (screen: any) => void }) => {
  const { clients, negotiations, schedules, negotiationProducts } = useAppContext();

  const openNegotiations = negotiations.filter(n => n.status === NegotiationStatus.OPEN).length;
  const wonNegotiations = negotiations.filter(n => n.status === NegotiationStatus.WON);
  
  const totalRevenue = wonNegotiations.reduce((total, neg) => {
    const productsInNeg = negotiationProducts.filter(np => np.negotiationId === neg.id);
    const negTotal = productsInNeg.reduce((sum, p) => sum + (p.price * p.quantity - p.discount), 0);
    return total + negTotal;
  }, 0);

  const upcomingAppointments = schedules
    .filter(s => {
      if (!s.date) return false;
      const scheduleDate = new Date(s.date);
      return !isNaN(scheduleDate.getTime()) && scheduleDate > new Date();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: string }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
  
  const getClientName = (clientId: number) => clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  const formatDate = (isoString: string) => new Date(isoString).toLocaleString();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={<UserGroupIcon className="w-6 h-6 text-white" />} 
            title="Total Clients" 
            value={clients.length} 
            color="bg-blue-500"
        />
        <StatCard 
            icon={<BriefcaseIcon className="w-6 h-6 text-white" />} 
            title="Open Negotiations" 
            value={openNegotiations} 
            color="bg-yellow-500"
        />
        <StatCard 
            icon={<DollarSignIcon className="w-6 h-6 text-white" />} 
            title="Total Revenue (Won)" 
            value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
            color="bg-green-500"
        />
        <StatCard 
            icon={<CalendarIcon className="w-6 h-6 text-white" />} 
            title="Upcoming Appointments" 
            value={upcomingAppointments.length} 
            color="bg-purple-500"
        />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <ul className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <li 
                key={appointment.id}
                onClick={() => setScreen({ name: 'client-detail', clientId: appointment.clientId })}
                className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{getClientName(appointment.clientId)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.type}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(appointment.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;