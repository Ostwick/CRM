import React from 'react';
import { useAppContext } from '../App';
import { NegotiationStatus } from '../types';

const NegotiationsScreen = ({ setScreen }: { setScreen: (screen: any) => void }) => {
  const { negotiations, clients } = useAppContext();

  const getClientName = (clientId: number) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };
  
  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Negotiations</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody>
            {negotiations.map(neg => (
              <tr key={neg.id} onClick={() => setScreen({ name: 'negotiation-detail', negotiationId: neg.id })} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{neg.description}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{getClientName(neg.clientId)}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                    neg.status === NegotiationStatus.WON ? 'text-green-900' : neg.status === NegotiationStatus.LOST ? 'text-red-900' : 'text-yellow-900'
                  }`}>
                    <span aria-hidden className={`absolute inset-0 ${
                      neg.status === NegotiationStatus.WON ? 'bg-green-200' : neg.status === NegotiationStatus.LOST ? 'bg-red-200' : 'bg-yellow-200'
                    } opacity-50 rounded-full`}></span>
                    <span className="relative">{neg.status}</span>
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{formatDate(neg.createdAt)}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NegotiationsScreen;