
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { NegotiationProduct, NegotiationStatus } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface NegotiationDetailProps {
  negotiationId: number;
  setScreen: (screen: any) => void;
}

const NegotiationDetail: React.FC<NegotiationDetailProps> = ({ negotiationId, setScreen }) => {
  const { 
    negotiations, setNegotiations, 
    clients, 
    products, 
    negotiationProducts, setNegotiationProducts 
  } = useAppContext();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  const negotiation = negotiations.find(n => n.id === negotiationId);

  if (!negotiation) {
    return <div>Negotiation not found. <button onClick={() => setScreen({ name: 'negotiations' })}>Go back</button></div>;
  }

  const client = clients.find(c => c.id === negotiation.clientId);
  const productsInNegotiation = negotiationProducts.filter(p => p.negotiationId === negotiationId);
  
  const handleAddProduct = () => {
    const productToAdd = products.find(p => p.id === selectedProductId);
    if (!productToAdd || quantity <= 0) return;

    const newNegProduct: NegotiationProduct = {
      id: `${negotiationId}-${productToAdd.id}-${Date.now()}`,
      negotiationId,
      productId: productToAdd.id,
      productName: productToAdd.name,
      quantity,
      price: productToAdd.price,
      discount
    };

    setNegotiationProducts([...negotiationProducts, newNegProduct]);
    setIsProductModalOpen(false);
  };
  
  const handleRemoveProduct = (negProductId: string) => {
    setNegotiationProducts(negotiationProducts.filter(p => p.id !== negProductId));
  };

  const handleStatusChange = (newStatus: NegotiationStatus) => {
    setNegotiations(negotiations.map(n => n.id === negotiationId ? { ...n, status: newStatus } : n));
  };
  
  const calculateTotal = () => {
    return productsInNegotiation.reduce((total, p) => total + (p.price * p.quantity - p.discount), 0);
  };
  
  const openProductModal = () => {
    if (products.length > 0) {
      if (!products.find(p => p.id === selectedProductId)) {
        setSelectedProductId(products[0].id);
      }
    } else {
      setSelectedProductId('');
    }
    setQuantity(1);
    setDiscount(0);
    setIsProductModalOpen(true);
  };

  const total = calculateTotal();
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div>
      <button onClick={() => setScreen({ name: 'negotiations' })} className="mb-4 text-blue-600 dark:text-blue-400 hover:underline">
        &larr; Back to Negotiations
      </button>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{negotiation.description}</h1>
                <p 
                    className="text-lg text-gray-600 dark:text-gray-300 cursor-pointer hover:underline"
                    onClick={() => setScreen({ name: 'client-detail', clientId: client?.id })}
                >
                    Client: {client?.name || 'Unknown'}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                <select 
                    value={negotiation.status} 
                    onChange={e => handleStatusChange(e.target.value as NegotiationStatus)}
                    className="p-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                    {Object.values(NegotiationStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>
      
      {/* Products in Negotiation */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products</h2>
          <button onClick={openProductModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg flex items-center text-sm">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Discount</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subtotal</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {productsInNegotiation.map(p => (
                        <tr key={p.id}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{p.productName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">{p.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">{p.price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                            <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 text-right">{p.discount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                                {(p.price * p.quantity - p.discount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => handleRemoveProduct(p.id)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className="px-4 py-3 text-right font-bold text-gray-700 dark:text-gray-200">Total</td>
                        <td className="px-4 py-3 text-right font-bold text-lg text-gray-900 dark:text-white">
                            {total.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        {productsInNegotiation.length === 0 && (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">No products added yet.</p>
        )}
      </div>

       {/* Add Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Add Product to Negotiation">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="product-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
            <select id="product-select" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
           <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="product-price" className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input
              id="product-price"
              type="text"
              readOnly
              value={selectedProduct ? selectedProduct.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : ''}
              className="col-span-2 w-full p-2 border rounded bg-gray-200 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="product-quantity" className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <input id="product-quantity" type="number" min="1" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="product-discount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
            <input id="product-discount" type="number" min="0" placeholder="Discount (value)" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="col-span-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button onClick={handleAddProduct} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Add Product</button>
        </div>
      </Modal>
    </div>
  );
};

export default NegotiationDetail;
