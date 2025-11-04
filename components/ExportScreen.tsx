
import React from 'react';
import { useAppContext } from '../App';

// Make TypeScript aware of the global XLSX object from the CDN
declare const XLSX: any;

const ExportScreen = () => {
  const appContext = useAppContext();

  const exportToExcel = (data: any[], fileName: string) => {
    if (typeof XLSX === 'undefined') {
        alert('Excel export library is not available. Please check your internet connection and try again.');
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Export Data</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Click the buttons below to download your CRM data as Excel files.
          This can be used for backups, reporting, or importing into other systems.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button onClick={() => exportToExcel(appContext.clients, 'clients')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Export Clients
            </button>
            <button onClick={() => exportToExcel(appContext.contacts, 'contacts')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Export Contacts
            </button>
            <button onClick={() => exportToExcel(appContext.schedules, 'schedules')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Export Schedules
            </button>
            <button onClick={() => exportToExcel(appContext.negotiations, 'negotiations')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Export Negotiations
            </button>
            <button onClick={() => exportToExcel(appContext.negotiationProducts, 'negotiation_products')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Export Negotiation Products
            </button>
            <button onClick={() => exportToExcel(appContext.products, 'products')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Export Products
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExportScreen;