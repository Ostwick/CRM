
import React from 'react';
import { useAppContext, useTranslation } from '../App';

// Make TypeScript aware of the global XLSX object from the CDN
declare const XLSX: any;

const ExportScreen = () => {
  const appContext = useAppContext();
  const { t } = useTranslation();

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
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('export.title')}</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {t('export.description')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button onClick={() => exportToExcel(appContext.clients, 'clients')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                {t('export.clients')}
            </button>
            <button onClick={() => exportToExcel(appContext.contacts, 'contacts')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                {t('export.contacts')}
            </button>
            <button onClick={() => exportToExcel(appContext.schedules, 'schedules')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                {t('export.schedules')}
            </button>
            <button onClick={() => exportToExcel(appContext.negotiations, 'negotiations')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                {t('export.negotiations')}
            </button>
            <button onClick={() => exportToExcel(appContext.negotiationProducts, 'negotiation_products')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                {t('export.negotiationProducts')}
            </button>
            <button onClick={() => exportToExcel(appContext.products, 'products')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                {t('export.products')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExportScreen;
