
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

// --- I18n Setup ---
const translations = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      clients: 'Clients',
      products: 'Products',
      negotiations: 'Negotiations',
      export: 'Export',
    },
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
    },
    footer: {
      version: 'Version',
      developedBy: 'Developed by Ostwick Software',
    },
    dashboard: {
      title: 'Dashboard',
      totalClients: 'Total Clients',
      openNegotiations: 'Open Negotiations',
      totalRevenue: 'Total Revenue (Won)',
      upcomingAppointments: 'Upcoming Appointments',
      upcomingAppointmentsTitle: 'Upcoming Appointments',
      noUpcomingAppointments: 'No upcoming appointments.',
      unknownClient: 'Unknown Client',
    },
    clients: {
      title: 'Clients',
      add: 'Add Client',
      table: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
      },
      modal: {
        editTitle: 'Edit Client',
        addTitle: 'Add New Client',
        name: 'Name',
        document: 'Document',
        documentPlaceholder: 'Document (CPF/CNPJ)',
        address: 'Address',
        number: 'Number',
        email: 'Email',
        phone: 'Phone',
        save: 'Save Changes',
        add: 'Add Client',
      },
      deleteConfirm: 'Are you sure you want to delete this client? This will also delete all associated contacts, schedules, and negotiations.',
      requiredFields: 'Client name and email are required.',
    },
    clientDetail: {
      back: 'Back to Clients',
      notFound: 'Client not found.',
      goBack: 'Go back',
      document: 'Document',
      contacts: 'Contacts',
      add: 'Add',
      noContacts: 'No contacts found.',
      schedules: 'Schedules',
      noSchedules: 'No schedules found.',
      negotiations: 'Negotiations',
      created: 'Created',
      noNegotiations: 'No negotiations found.',
      contactModal: {
        title: 'Add New Contact',
        name: 'Name',
        role: 'Role',
        email: 'Email',
        phone: 'Phone',
        add: 'Add Contact',
      },
      scheduleModal: {
        title: 'Add New Schedule',
        type: 'Type',
        dateTime: 'Date & Time',
        notes: 'Notes',
        add: 'Add Schedule',
      },
    },
    products: {
      title: 'Products',
      add: 'Add Product',
      table: {
        name: 'Name',
        price: 'Price',
      },
      modal: {
        editTitle: 'Edit Product',
        addTitle: 'Add Product',
        name: 'Product Name',
        price: 'Price',
        save: 'Save',
      },
      deleteConfirm: 'Are you sure you want to delete this product?',
    },
    negotiations: {
      title: 'Negotiations',
      table: {
        description: 'Description',
        client: 'Client',
        status: 'Status',
        createdAt: 'Created At',
      },
      unknownClient: 'Unknown Client',
    },
    negotiationDetail: {
      back: 'Back to Negotiations',
      notFound: 'Negotiation not found.',
      goBack: 'Go back',
      client: 'Client',
      unknownClient: 'Unknown',
      status: 'Status',
      products: 'Products',
      addProduct: 'Add Product',
      table: {
        product: 'Product',
        quantity: 'Quantity',
        unitPrice: 'Unit Price',
        discount: 'Discount',
        subtotal: 'Subtotal',
      },
      total: 'Total',
      noProducts: 'No products added yet.',
      productModal: {
        title: 'Add Product to Negotiation',
        product: 'Product',
        price: 'Price',
        quantity: 'Quantity',
        discount: 'Discount',
        discountPlaceholder: 'Discount (value)',
        add: 'Add Product',
      },
    },
    export: {
      title: 'Export Data',
      description: 'Click the buttons below to download your CRM data as Excel files. This can be used for backups, reporting, or importing into other systems.',
      clients: 'Export Clients',
      contacts: 'Export Contacts',
      schedules: 'Export Schedules',
      negotiations: 'Export Negotiations',
      negotiationProducts: 'Export Negotiation Products',
      products: 'Export Products',
    },
    enums: {
      appointmentType: {
        [AppointmentType.LOCAL_VISIT]: 'Local Visit',
        [AppointmentType.VIDEO_CONFERENCE]: 'Video Conference',
        [AppointmentType.PHONE_CALL]: 'Phone/WhatsApp Call',
      },
      negotiationStatus: {
        [NegotiationStatus.OPEN]: 'Open',
        [NegotiationStatus.WON]: 'Won',
        [NegotiationStatus.LOST]: 'Lost',
      },
    },
  },
  'pt-br': {
    nav: {
      dashboard: 'Painel',
      clients: 'Clientes',
      products: 'Produtos',
      negotiations: 'Negociações',
      export: 'Exportar',
    },
    theme: {
      light: 'Modo Claro',
      dark: 'Modo Escuro',
    },
    footer: {
      version: 'Versão',
      developedBy: 'Desenvolvido por Ostwick Software',
    },
    dashboard: {
      title: 'Painel',
      totalClients: 'Total de Clientes',
      openNegotiations: 'Negociações Abertas',
      totalRevenue: 'Receita Total (Ganhas)',
      upcomingAppointments: 'Próximos Compromissos',
      upcomingAppointmentsTitle: 'Próximos Compromissos',
      noUpcomingAppointments: 'Nenhum compromisso futuro.',
      unknownClient: 'Cliente Desconhecido',
    },
    clients: {
      title: 'Clientes',
      add: 'Adicionar Cliente',
      table: {
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
      },
      modal: {
        editTitle: 'Editar Cliente',
        addTitle: 'Adicionar Novo Cliente',
        name: 'Nome',
        document: 'Documento',
        documentPlaceholder: 'Documento (CPF/CNPJ)',
        address: 'Endereço',
        number: 'Número',
        email: 'Email',
        phone: 'Telefone',
        save: 'Salvar Alterações',
        add: 'Adicionar Cliente',
      },
      deleteConfirm: 'Tem certeza que deseja excluir este cliente? Isso também excluirá todos os contatos, agendamentos e negociações associados.',
      requiredFields: 'Nome e email do cliente são obrigatórios.',
    },
    clientDetail: {
      back: 'Voltar para Clientes',
      notFound: 'Cliente não encontrado.',
      goBack: 'Voltar',
      document: 'Documento',
      contacts: 'Contatos',
      add: 'Adicionar',
      noContacts: 'Nenhum contato encontrado.',
      schedules: 'Agendamentos',
      noSchedules: 'Nenhum agendamento encontrado.',
      negotiations: 'Negociações',
      created: 'Criado em',
      noNegotiations: 'Nenhuma negociação encontrada.',
      contactModal: {
        title: 'Adicionar Novo Contato',
        name: 'Nome',
        role: 'Cargo',
        email: 'Email',
        phone: 'Telefone',
        add: 'Adicionar Contato',
      },
      scheduleModal: {
        title: 'Adicionar Novo Agendamento',
        type: 'Tipo',
        dateTime: 'Data e Hora',
        notes: 'Notas',
        add: 'Adicionar Agendamento',
      },
    },
    products: {
      title: 'Produtos',
      add: 'Adicionar Produto',
      table: {
        name: 'Nome',
        price: 'Preço',
      },
      modal: {
        editTitle: 'Editar Produto',
        addTitle: 'Adicionar Produto',
        name: 'Nome do Produto',
        price: 'Preço',
        save: 'Salvar',
      },
      deleteConfirm: 'Tem certeza que deseja excluir este produto?',
    },
    negotiations: {
      title: 'Negociações',
      table: {
        description: 'Descrição',
        client: 'Cliente',
        status: 'Status',
        createdAt: 'Data de Criação',
      },
      unknownClient: 'Cliente Desconhecido',
    },
    negotiationDetail: {
      back: 'Voltar para Negociações',
      notFound: 'Negociação não encontrada.',
      goBack: 'Voltar',
      client: 'Cliente',
      unknownClient: 'Desconhecido',
      status: 'Status',
      products: 'Produtos',
      addProduct: 'Adicionar Produto',
      table: {
        product: 'Produto',
        quantity: 'Quantidade',
        unitPrice: 'Preço Unitário',
        discount: 'Desconto',
        subtotal: 'Subtotal',
      },
      total: 'Total',
      noProducts: 'Nenhum produto adicionado ainda.',
      productModal: {
        title: 'Adicionar Produto à Negociação',
        product: 'Produto',
        price: 'Preço',
        quantity: 'Quantidade',
        discount: 'Desconto',
        discountPlaceholder: 'Desconto (valor)',
        add: 'Adicionar Produto',
      },
    },
    export: {
      title: 'Exportar Dados',
      description: 'Clique nos botões abaixo para baixar seus dados de CRM como arquivos Excel. Isso pode ser usado para backups, relatórios ou importação em outros sistemas.',
      clients: 'Exportar Clientes',
      contacts: 'Exportar Contatos',
      schedules: 'Exportar Agendamentos',
      negotiations: 'Exportar Negociações',
      negotiationProducts: 'Exportar Produtos da Negociação',
      products: 'Exportar Produtos',
    },
    enums: {
      appointmentType: {
        [AppointmentType.LOCAL_VISIT]: 'Visita Local',
        [AppointmentType.VIDEO_CONFERENCE]: 'Videoconferência',
        [AppointmentType.PHONE_CALL]: 'Ligação/WhatsApp',
      },
      negotiationStatus: {
        [NegotiationStatus.OPEN]: 'Aberta',
        [NegotiationStatus.WON]: 'Ganha',
        [NegotiationStatus.LOST]: 'Perdida',
      },
    },
  }
};


type Language = 'en' | 'pt-br';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    try {
      for (const k of keys) {
        result = result[k];
      }
    } catch (e) {
      result = undefined;
    }
    
    if (result === undefined) {
      let fallbackResult: any = translations['en'];
      try {
        for (const k of keys) {
          fallbackResult = fallbackResult[k];
        }
        return fallbackResult || key;
      } catch (e) {
        return key;
      }
    }
    return result as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};

// --- App Context ---
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

const AppContent = () => {
  const { clients, setClients, contacts, setContacts, schedules, setSchedules, negotiations, setNegotiations, products, setProducts, negotiationProducts, setNegotiationProducts } = useAppContext();
  const [screen, setScreen] = useState<Screen>({ name: 'dashboard' });
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  const { language, setLanguage, t } = useTranslation();

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">CRM</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink icon={<HomeIcon className="w-5 h-5" />} label={t('nav.dashboard')} target={{ name: 'dashboard' }} />
          <NavLink icon={<UserGroupIcon className="w-5 h-5" />} label={t('nav.clients')} target={{ name: 'clients' }} />
          <NavLink icon={<CubeIcon className="w-5 h-5" />} label={t('nav.products')} target={{ name: 'products' }} />
          <NavLink icon={<BriefcaseIcon className="w-5 h-5" />} label={t('nav.negotiations')} target={{ name: 'negotiations' }} />
          <NavLink icon={<DownloadIcon className="w-5 h-5" />} label={t('nav.export')} target={{ name: 'export' }} />
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
            <div className="flex justify-center space-x-2 mb-4">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'}`}>EN</button>
                <button onClick={() => setLanguage('pt-br')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'pt-br' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'}`}>PT</button>
            </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
              <span className="ml-2">{isDarkMode ? t('theme.light') : t('theme.dark')}</span>
          </button>
        </div>
        <div className="p-4 border-t dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('footer.version')} 1.0</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('footer.developedBy')}</p>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderScreen()}
      </main>
    </div>
  );
};

// FIX: Refactored to use an AppProvider to manage application state, resolving a component error.
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', initialClients);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', initialContacts);
  const [schedules, setSchedules] = useLocalStorage<Schedule[]>('schedules', initialSchedules);
  const [negotiations, setNegotiations] = useLocalStorage<Negotiation[]>('negotiations', initialNegotiations);
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [negotiationProducts, setNegotiationProducts] = useLocalStorage<NegotiationProduct[]>('negotiationProducts', initialNegotiationProducts);
  
  const appContextValue: AppContextType = {
    clients, setClients,
    contacts, setContacts,
    schedules, setSchedules,
    negotiations, setNegotiations,
    products, setProducts,
    negotiationProducts, setNegotiationProducts
  };
  
  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
