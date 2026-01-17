// Core entity types for the CRM system

export type CustomerStatus = 'Lead' | 'Qualified' | 'Active' | 'VIP' | 'Inactive';
export type CustomerType = 'Home Theatre' | '2-Channel' | 'Both';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: CustomerStatus;
  type: CustomerType;
  tags: string[];
  dateAdded: string;
  lastContact: string;
  totalSpent: number;
  notes: string;
  preferences: {
    favoritesBrands: string[];
    budgetRange: string;
    interests: string[];
  };
}

export type ProductCategory =
  | 'Speakers'
  | 'Amplifiers'
  | 'Source Components'
  | 'Home Theatre'
  | 'Cables & Accessories';

export type ProductSubcategory =
  // Speakers
  | 'Floorstanding'
  | 'Bookshelf'
  | 'Center Channel'
  | 'Subwoofers'
  | 'Surround'
  // Amplifiers
  | 'Integrated Amps'
  | 'Power Amps'
  | 'Receivers'
  | 'Pre-amps'
  // Source Components
  | 'Turntables'
  | 'CD Players'
  | 'Streamers'
  | 'DACs'
  // Home Theatre
  | 'Projectors'
  | 'Screens'
  | 'AV Receivers'
  | 'Soundbars'
  // Cables & Accessories
  | 'Speaker Cables'
  | 'Interconnects'
  | 'Power'
  | 'Stands'
  | 'Racks';

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  sku: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  description: string;
  specifications: Record<string, string>;
  retailPrice: number;
  costPrice: number;
  margin: number;
  stockLevel: number;
  lowStockThreshold: number;
  images: string[];
  supplier: string;
  dateAdded: string;
  lastUpdated: string;
}

export type QuoteStatus =
  | 'Draft'
  | 'Sent'
  | 'Viewed'
  | 'Accepted'
  | 'Declined'
  | 'Expired';

export interface QuoteLineItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  isCustom: boolean;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  status: QuoteStatus;
  dateCreated: string;
  dateUpdated: string;
  expiryDate: string;
  items: QuoteLineItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  template?: string;
}

export type DealStage =
  | 'Lead'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type DealPriority = 'Low' | 'Medium' | 'High';

export interface Deal {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  expectedCloseDate: string;
  lastActivity: string;
  productType: 'Home Theatre' | '2-Channel' | 'Both';
  assignedTo: string;
  notes: string;
  wonReason?: string;
  lostReason?: string;
}

export type InstallationStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface Installation {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in hours
  technicianId: string;
  technicianName: string;
  address: string;
  status: InstallationStatus;
  checklist: {
    item: string;
    completed: boolean;
  }[];
  notes: string;
  beforePhotos: string[];
  afterPhotos: string[];
  customerSignature?: string;
}

export type ActivityType =
  | 'Note'
  | 'Call'
  | 'Email'
  | 'Meeting'
  | 'Quote Sent'
  | 'Purchase'
  | 'Installation';

export interface Activity {
  id: string;
  customerId: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Task {
  id: string;
  customerId?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  completedDate?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales' | 'Technician';
  avatar?: string;
}

export interface DashboardMetrics {
  monthlyRevenue: number;
  monthlyRevenueChange: number;
  conversions: number;
  conversionsChange: number;
  pendingQuotes: number;
  pendingQuotesChange: number;
  activeCustomers: number;
}

export interface SalesData {
  month: string;
  revenue: number;
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  brand: string;
  unitsSold: number;
  revenue: number;
}

// Store types
export interface CustomerStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  selectCustomer: (id: string | null) => void;
  searchCustomers: (query: string) => Customer[];
}

export interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectProduct: (id: string | null) => void;
  searchProducts: (query: string) => Product[];
  filterByCategory: (category: ProductCategory) => Product[];
}

export interface QuoteStore {
  quotes: Quote[];
  selectedQuote: Quote | null;
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  selectQuote: (id: string | null) => void;
  duplicateQuote: (id: string) => void;
}

export interface DealStore {
  deals: Deal[];
  selectedDeal: Deal | null;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  selectDeal: (id: string | null) => void;
  moveDeal: (id: string, stage: DealStage) => void;
}

export interface InstallationStore {
  installations: Installation[];
  selectedInstallation: Installation | null;
  addInstallation: (installation: Installation) => void;
  updateInstallation: (id: string, updates: Partial<Installation>) => void;
  deleteInstallation: (id: string) => void;
  selectInstallation: (id: string | null) => void;
}

export interface ActivityStore {
  activities: Activity[];
  tasks: Task[];
  addActivity: (activity: Activity) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getActivitiesByCustomer: (customerId: string) => Activity[];
  getTasksByCustomer: (customerId: string) => Task[];
}

export interface AppStore {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}
