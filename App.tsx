
import React, { useState, createContext, useContext } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Client, Contact, Schedule, Negotiation, Product, NegotiationProduct, NegotiationStatus, AppointmentType } from './types';
import Dashboard from './components/Dashboard';
import ClientsScreen from './components/ClientsScreen';
import ClientDetail from './components/ClientDetail';
import ProductsScreen from './components/ProductsScreen';
import NegotiationsScreen from './components/NegotiationsScreen';
import NegotiationDetail from './components/NegotiationDetail';
import ExportScreen from './components/ExportScreen';
import { HomeIcon } from './components/icons/HomeIcon';
import { UserGroupIcon } from './components/icons/UserGroupIcon';
import { CubeIcon } from './components/icons/CubeIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';

// Mock Data
const initialClients: Client[] = [
  { id: 1, name: 'Tech Solutions Inc.', document: '12.345.678/0001-99', address: '123 Tech Street', number: '100', email: 'contact@techsolutions.com', phone: '555-0101' },
  { id: 2, name: 'Innovate Creations', document: '98.765.432/0001-11', address: '456 Innovation Ave', number: '200', email: 'hello@innovate.com', phone: '555-0102' },
];

const initialContacts: Contact[] = [
  { id: 1, clientId: 1, name: 'John Doe', role: 'CEO', phone: '555-0103', email: 'john.doe@techsolutions.com' },
  { id: 2, clientId: 2, name: 'Jane Smith', role: 'CTO', phone: '555-0104', email: 'jane.smith@innovate.com' },
];

const initialSchedules: Schedule[] = [
  { id: 1, clientId: 1, type: AppointmentType.VIDEO_CONFERENCE, date: new Date(Date.now() + 86400000 * 2).toISOString(), notes: 'Discuss new project proposal' },
  { id: 2, clientId: 2, type: AppointmentType.LOCAL_VISIT, date: new Date(Date.now() + 86400000 * 5).toISOString(), notes: 'Onboarding session' },
];

const initialNegotiations: Negotiation[] = [
  { id: 1, clientId: 1, status: NegotiationStatus.OPEN, description: 'Q3 Software License', createdAt: new Date().toISOString() },
  { id: 2, clientId: 2, status: NegotiationStatus.WON, description: 'Website Redesign', createdAt: new Date().toISOString() },
];

const initialProducts: Product[] = [
  { id: 'prod-001', name: 'Software License - Basic', price: 1500 },
  { id: 'prod-002', name: 'Software License - Pro', price: 3000 },
  { id: 'prod-003', name: 'Consulting Hour', price: 200 },
];

const initialNegotiationProducts: NegotiationProduct[] = [
    { id: '1-prod-002', negotiationId: 1, productId: 'prod-002', productName: 'Software License - Pro', quantity: 5, price: 3000, discount: 500 },
    { id: '2-prod-003', negotiationId: 2, productId: 'prod-003', productName: 'Consulting Hour', quantity: 10, price: 200, discount: 0 },
];

// App Context
interface AppContextType {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    contacts: Contact[];
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
    schedules: Schedule[];
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
    negotiations: Negotiation[];
    setNegotiations: React.Dispatch<React.SetStateAction<Negotiation[]>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    negotiationProducts: NegotiationProduct[];
    setNegotiationProducts: React.Dispatch<React.SetStateAction<NegotiationProduct[]>>;
}

const AppContext = createContext<AppContextType | null>(null);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};


export type Screen = 
  | { name: 'dashboard' }
  | { name: 'clients' }
  | { name: 'client-detail', clientId: number }
  | { name: 'products' }
  | { name: 'negotiations' }
  | { name: 'negotiation-detail', negotiationId: number }
  | { name: 'export' };


function App() {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', initialClients);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', initialContacts);
  const [schedules, setSchedules] = useLocalStorage<Schedule[]>('schedules', initialSchedules);
  const [negotiations, setNegotiations] = useLocalStorage<Negotiation[]>('negotiations', initialNegotiations);
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [negotiationProducts, setNegotiationProducts] = useLocalStorage<NegotiationProduct[]>('negotiationProducts', initialNegotiationProducts);
  const [screen, setScreen] = useState<Screen>({ name: 'dashboard' });
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const appContextValue: AppContextType = {
    clients, setClients,
    contacts, setContacts,
    schedules, setSchedules,
    negotiations, setNegotiations,
    products, setProducts,
    negotiationProducts, setNegotiationProducts
  };
  
  const renderScreen = () => {
    switch (screen.name) {
      case 'dashboard':
        return <Dashboard setScreen={setScreen} />;
      case 'clients':
        return <ClientsScreen setScreen={setScreen} />;
      case 'client-detail':
        return <ClientDetail clientId={screen.clientId} setScreen={setScreen} />;
      case 'products':
        return <ProductsScreen />;
      case 'negotiations':
        return <NegotiationsScreen setScreen={setScreen} />;
      case 'negotiation-detail':
        return <NegotiationDetail negotiationId={screen.negotiationId} setScreen={setScreen} />;
      case 'export':
        return <ExportScreen />;
      default:
        return <Dashboard setScreen={setScreen} />;
    }
  };

  const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    target: Screen;
  }> = ({ icon, label, target }) => (
    <button
      onClick={() => setScreen(target)}
      className={`flex items-center w-full px-4 py-2 text-sm font-medium text-left rounded-md transition-colors duration-150 ${
        screen.name === target.name
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
          <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">CRM</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavLink icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" target={{ name: 'dashboard' }} />
            <NavLink icon={<UserGroupIcon className="w-5 h-5" />} label="Clients" target={{ name: 'clients' }} />
            <NavLink icon={<CubeIcon className="w-5 h-5" />} label="Products" target={{ name: 'products' }} />
            <NavLink icon={<BriefcaseIcon className="w-5 h-5" />} label="Negotiations" target={{ name: 'negotiations' }} />
            <NavLink icon={<DownloadIcon className="w-5 h-5" />} label="Export" target={{ name: 'export' }} />
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
          <div className="p-4 border-t dark:border-gray-700 text-center">
             <p className="text-xs text-gray-500 dark:text-gray-400">Version 1.0</p>
             <p className="text-xs text-gray-500 dark:text-gray-400">Developed by Ostwick Software</p>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
