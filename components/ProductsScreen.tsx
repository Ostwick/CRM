
import React, { useState } from 'react';
import { useAppContext, useTranslation } from '../App';
import { Product } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

const ProductsScreen = () => {
  const { products, setProducts } = useAppContext();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    setCurrentProduct({});
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (isEditing) {
      setProducts(products.map(p => p.id === currentProduct.id ? currentProduct as Product : p));
    } else {
      setProducts([...products, { ...currentProduct, id: `prod-${Date.now()}`, price: Number(currentProduct.price || 0) } as Product]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if(window.confirm(t('products.deleteConfirm'))) {
        setProducts(products.filter(p => p.id !== productId));
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('products.title')}</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          {t('products.add')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t('products.table.name')}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t('products.table.price')}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{product.name}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800 mr-2"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? t('products.modal.editTitle') : t('products.modal.addTitle')}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('products.modal.name')}</label>
            <input type="text" placeholder={t('products.modal.name')} value={currentProduct.name || ''} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('products.modal.price')}</label>
            <input type="number" placeholder={t('products.modal.price')} value={currentProduct.price || ''} onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button onClick={handleSaveProduct} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">{t('products.modal.save')}</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsScreen;
