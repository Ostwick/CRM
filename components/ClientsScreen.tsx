
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Client } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/PlusIcon';

const ClientsScreen = ({ setScreen }: { setScreen: (screen: any) => void }) => {
  const { clients, setClients } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({ name: '', document: '', address: '', number: '', email: '', phone: '' });

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      setClients([...clients, { ...newClient, id: Date.now() }]);
      setIsModalOpen(false);
      setNewClient({ name: '', document: '', address: '', number: '', email: '', phone: '' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Phone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} onClick={() => setScreen({ name: 'client-detail', clientId: client.id })} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{client.name}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{client.email}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{client.phone}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" placeholder="Name" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document</label>
            <input type="text" placeholder="Document (CPF/CNPJ)" value={newClient.document} onChange={e => setNewClient({ ...newClient, document: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input type="text" placeholder="Address" value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Number</label>
            <input type="text" placeholder="Number" value={newClient.number} onChange={e => setNewClient({ ...newClient, number: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" placeholder="Email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input type="tel" placeholder="Phone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button onClick={handleAddClient} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Add Client</button>
        </div>
      </Modal>
    </div>
  );
};

export default ClientsScreen;
