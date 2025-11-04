
import React, { useState } from 'react';
import { useAppContext, useTranslation } from '../App';
import { Client } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

const ClientsScreen = ({ setScreen }: { setScreen: (screen: any) => void }) => {
  const { 
    clients, setClients, 
    contacts, setContacts, 
    schedules, setSchedules, 
    negotiations, setNegotiations, 
    negotiationProducts, setNegotiationProducts 
  } = useAppContext();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client>>({});

  const openAddModal = () => {
    setCurrentClient({ name: '', document: '', address: '', number: '', email: '', phone: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setCurrentClient(client);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!currentClient.name || !currentClient.email) {
      alert(t('clients.requiredFields'));
      return;
    }

    if (isEditing) {
      setClients(clients.map(c => (c.id === currentClient.id ? (currentClient as Client) : c)));
    } else {
      setClients([...clients, { ...(currentClient as Omit<Client, 'id'>), id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClient = (clientId: number) => {
    if (window.confirm(t('clients.deleteConfirm'))) {
      const negsToDelete = negotiations.filter(n => n.clientId === clientId);
      const negIdsToDelete = negsToDelete.map(n => n.id);

      setNegotiationProducts(negotiationProducts.filter(np => !negIdsToDelete.includes(np.negotiationId)));
      setNegotiations(negotiations.filter(n => n.clientId !== clientId));
      setSchedules(schedules.filter(s => s.clientId !== clientId));
      setContacts(contacts.filter(c => c.clientId !== clientId));
      setClients(clients.filter(c => c.id !== clientId));
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('clients.title')}</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          {t('clients.add')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t('clients.table.name')}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t('clients.table.email')}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t('clients.table.phone')}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"></th>
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
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(client); }} className="text-blue-600 hover:text-blue-800 mr-2"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? t('clients.modal.editTitle') : t('clients.modal.addTitle')}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clients.modal.name')}</label>
            <input type="text" placeholder={t('clients.modal.name')} value={currentClient.name || ''} onChange={e => setCurrentClient({ ...currentClient, name: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clients.modal.document')}</label>
            <input type="text" placeholder={t('clients.modal.documentPlaceholder')} value={currentClient.document || ''} onChange={e => setCurrentClient({ ...currentClient, document: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clients.modal.address')}</label>
            <input type="text" placeholder={t('clients.modal.address')} value={currentClient.address || ''} onChange={e => setCurrentClient({ ...currentClient, address: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clients.modal.number')}</label>
            <input type="text" placeholder={t('clients.modal.number')} value={currentClient.number || ''} onChange={e => setCurrentClient({ ...currentClient, number: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clients.modal.email')}</label>
            <input type="email" placeholder={t('clients.modal.email')} value={currentClient.email || ''} onChange={e => setCurrentClient({ ...currentClient, email: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clients.modal.phone')}</label>
            <input type="tel" placeholder={t('clients.modal.phone')} value={currentClient.phone || ''} onChange={e => setCurrentClient({ ...currentClient, phone: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button onClick={handleSaveClient} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">{isEditing ? t('clients.modal.save') : t('clients.modal.add')}</button>
        </div>
      </Modal>
    </div>
  );
};

export default ClientsScreen;
