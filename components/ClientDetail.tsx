
import React, { useState } from 'react';
import { useAppContext, useTranslation } from '../App';
import { Contact, Schedule, AppointmentType } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/PlusIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ClientDetailProps {
  clientId: number;
  setScreen: (screen: any) => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ clientId, setScreen }) => {
  const { clients, contacts, setContacts, schedules, setSchedules, negotiations } = useAppContext();
  const { t } = useTranslation();
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'clientId'>>({ name: '', role: '', phone: '', email: '' });
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, 'id' | 'clientId'>>({ type: AppointmentType.LOCAL_VISIT, date: '', notes: '' });

  const client = clients.find(c => c.id === clientId);
  const clientContacts = contacts.filter(c => c.clientId === clientId);
  const clientSchedules = schedules.filter(s => s.clientId === clientId);
  const clientNegotiations = negotiations.filter(n => n.clientId === clientId);

  if (!client) {
    return <div>{t('clientDetail.notFound')} <button onClick={() => setScreen({ name: 'clients' })}>{t('clientDetail.goBack')}</button></div>;
  }

  const handleAddContact = () => {
    if (newContact.name && newContact.email) {
      setContacts([...contacts, { ...newContact, id: Date.now(), clientId }]);
      setIsContactModalOpen(false);
      setNewContact({ name: '', role: '', phone: '', email: '' });
    }
  };

  const handleAddSchedule = () => {
    if (newSchedule.date) {
      setSchedules([...schedules, { ...newSchedule, id: Date.now(), clientId, date: new Date(newSchedule.date).toISOString() }]);
      setIsScheduleModalOpen(false);
      setNewSchedule({ type: AppointmentType.LOCAL_VISIT, date: '', notes: '' });
    }
  };
  
  const formatDate = (isoString: string) => isoString ? new Date(isoString).toLocaleString() : 'N/A';

  return (
    <div>
      <button onClick={() => setScreen({ name: 'clients' })} className="mb-4 text-blue-600 dark:text-blue-400 hover:underline">
        &larr; {t('clientDetail.back')}
      </button>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
        <p className="text-gray-600 dark:text-gray-300">{client.email} | {client.phone}</p>
        <p className="text-gray-600 dark:text-gray-300">{client.address}, {client.number}</p>
        <p className="text-gray-600 dark:text-gray-300">{t('clientDetail.document')}: {client.document}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('clientDetail.contacts')}</h2>
            <button onClick={() => setIsContactModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg flex items-center text-sm">
              <PlusIcon className="w-4 h-4 mr-1" /> {t('clientDetail.add')}
            </button>
          </div>
          {clientContacts.length > 0 ? (
            <ul className="space-y-3">
              {clientContacts.map(contact => (
                <li key={contact.id} className="flex items-center">
                  <UserCircleIcon className="w-8 h-8 mr-3 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{contact.name} ({contact.role})</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{contact.email} | {contact.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 dark:text-gray-400">{t('clientDetail.noContacts')}</p>}
        </div>

        {/* Schedules */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('clientDetail.schedules')}</h2>
            <button onClick={() => setIsScheduleModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg flex items-center text-sm">
              <PlusIcon className="w-4 h-4 mr-1" /> {t('clientDetail.add')}
            </button>
          </div>
          {clientSchedules.length > 0 ? (
            <ul className="space-y-3">
              {clientSchedules.map(schedule => (
                <li key={schedule.id} className="flex items-start">
                  <CalendarIcon className="w-8 h-8 mr-3 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{t(`enums.appointmentType.${schedule.type}`)} - {formatDate(schedule.date)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{schedule.notes}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 dark:text-gray-400">{t('clientDetail.noSchedules')}</p>}
        </div>
      </div>

       {/* Negotiations */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('clientDetail.negotiations')}</h2>
        {clientNegotiations.length > 0 ? (
          <ul>
            {clientNegotiations.map(neg => (
              <li key={neg.id} onClick={() => setScreen({ name: 'negotiation-detail', negotiationId: neg.id})} className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{neg.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('clientDetail.created')}: {formatDate(neg.createdAt)}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  neg.status === 'Won' ? 'bg-green-200 text-green-800' : neg.status === 'Lost' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                }`}>{t(`enums.negotiationStatus.${neg.status}`)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 dark:text-gray-400">{t('clientDetail.noNegotiations')}</p>}
      </div>

      {/* Add Contact Modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title={t('clientDetail.contactModal.title')}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clientDetail.contactModal.name')}</label>
            <input type="text" placeholder={t('clientDetail.contactModal.name')} value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clientDetail.contactModal.role')}</label>
            <input type="text" placeholder={t('clientDetail.contactModal.role')} value={newContact.role} onChange={e => setNewContact({ ...newContact, role: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clientDetail.contactModal.email')}</label>
            <input type="email" placeholder={t('clientDetail.contactModal.email')} value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clientDetail.contactModal.phone')}</label>
            <input type="tel" placeholder={t('clientDetail.contactModal.phone')} value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button onClick={handleAddContact} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">{t('clientDetail.contactModal.add')}</button>
        </div>
      </Modal>

      {/* Add Schedule Modal */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title={t('clientDetail.scheduleModal.title')}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clientDetail.scheduleModal.type')}</label>
            <select value={newSchedule.type} onChange={e => setNewSchedule({ ...newSchedule, type: e.target.value as AppointmentType })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {Object.values(AppointmentType).map(type => <option key={type} value={type}>{t(`enums.appointmentType.${type}`)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clientDetail.scheduleModal.dateTime')}</label>
            <input type="datetime-local" value={newSchedule.date} onChange={e => setNewSchedule({ ...newSchedule, date: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{t('clientDetail.scheduleModal.notes')}</label>
            <textarea placeholder={t('clientDetail.scheduleModal.notes')} value={newSchedule.notes} onChange={e => setNewSchedule({ ...newSchedule, notes: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>
          <button onClick={handleAddSchedule} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">{t('clientDetail.scheduleModal.add')}</button>
        </div>
      </Modal>
    </div>
  );
};

export default ClientDetail;
