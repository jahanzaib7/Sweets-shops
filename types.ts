
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

// Added missing Category enum to fix import errors in multiple components
export enum Category {
  MITHA = 'Mitha (Sweets)',
  SAVORY = 'Savory Items',
  BAKED = 'Baked Goods',
  HALWA_PURI = 'Halwa Puri Items'
}

export interface StaffMember {
  id: string;
  name: string;
  username: string;
  password?: string; // For login simulation
  role: UserRole;
  joinedAt: number;
}

export interface Item {
  id: string;
  name: string;
  category: Category | string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
}

export interface CartItem extends Item {
  quantity: number;
  discount: number; // percentage
}

export interface Sale {
  id: string;
  timestamp: number;
  items: CartItem[];
  totalBeforeTax: number;
  tax: number;
  discountTotal: number;
  grandTotal: number;
  staffName: string;
  staffId?: string;
}

export interface StockLog {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: string;
  timestamp: number;
}
