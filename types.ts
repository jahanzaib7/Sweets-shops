
export enum Category {
  MITHA = 'Mitha (Sweets)',
  SAVORY = 'Savory Items',
  BAKED = 'Baked Goods',
  HALWA_PURI = 'Halwa Puri Items'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface Item {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  unit: string;
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
