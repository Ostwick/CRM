
export interface Client {
  id: number;
  name: string;
  document: string; // CPF/CNPJ
  address: string;
  number: string;
  email: string;
  phone: string;
}

export interface Contact {
  id: number;
  clientId: number;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export enum AppointmentType {
  LOCAL_VISIT = 'Local Visit',
  VIDEO_CONFERENCE = 'Video Conference',
  PHONE_CALL = 'Phone/WhatsApp Call',
}

export interface Schedule {
  id: number;
  clientId: number;
  type: AppointmentType;
  date: string; // ISO string for date and time
  notes: string;
}

export enum NegotiationStatus {
  OPEN = 'Open',
  WON = 'Won',
  LOST = 'Lost',
}

export interface NegotiationProduct {
  id: string; // "negId-prodId"
  negotiationId: number;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number; // direct value discount
}

export interface Negotiation {
  id: number;
  clientId: number;
  status: NegotiationStatus;
  description: string;
  createdAt: string; // ISO string
}

export interface Product {
  id: string; // text based ID
  name: string;
  price: number;
}
