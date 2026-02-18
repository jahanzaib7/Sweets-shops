
import { Category, Item } from './types';

export const INITIAL_ITEMS: Item[] = [
  // Mitha (Sweets)
  { id: 'm1', name: 'Gulab Jamun', category: Category.MITHA, price: 1200, stock: 50, unit: 'kg' },
  { id: 'm2', name: 'Barfi (Special)', category: Category.MITHA, price: 1400, stock: 30, unit: 'kg' },
  { id: 'm3', name: 'Jalebi', category: Category.MITHA, price: 600, stock: 100, unit: 'kg' },
  { id: 'm4', name: 'Ras Malai', category: Category.MITHA, price: 200, stock: 40, unit: 'pc' },
  { id: 'm5', name: 'Motichoor Laddu', category: Category.MITHA, price: 900, stock: 60, unit: 'kg' },
  { id: 'm6', name: 'Sohan Halwa', category: Category.MITHA, price: 1800, stock: 20, unit: 'kg' },
  { id: 'm7', name: 'Kalakand', category: Category.MITHA, price: 1500, stock: 25, unit: 'kg' },
  { id: 'm8', name: 'Chum Chum', category: Category.MITHA, price: 1100, stock: 35, unit: 'kg' },
  { id: 'm9', name: 'Balushahi', category: Category.MITHA, price: 1000, stock: 40, unit: 'kg' },
  { id: 'm10', name: 'Petha', category: Category.MITHA, price: 800, stock: 45, unit: 'kg' },

  // Savory Items
  { id: 's1', name: 'Samosa (Potato)', category: Category.SAVORY, price: 30, stock: 200, unit: 'pc' },
  { id: 's2', name: 'Chicken Patty', category: Category.SAVORY, price: 80, stock: 50, unit: 'pc' },
  { id: 's3', name: 'Vegetable Roll', category: Category.SAVORY, price: 60, stock: 80, unit: 'pc' },
  { id: 's4', name: 'Paneer Pakora', category: Category.SAVORY, price: 120, stock: 100, unit: 'plate' },
  { id: 's5', name: 'Kachori', category: Category.SAVORY, price: 40, stock: 150, unit: 'pc' },
  { id: 's6', name: 'Mix Nimko', category: Category.SAVORY, price: 500, stock: 30, unit: 'kg' },
  { id: 's7', name: 'Dahi Bhalle', category: Category.SAVORY, price: 180, stock: 40, unit: 'plate' },
  { id: 's8', name: 'Papri Chaat', category: Category.SAVORY, price: 150, stock: 40, unit: 'plate' },

  // Baked Goods
  { id: 'b1', name: 'Plain Cake', category: Category.BAKED, price: 600, stock: 15, unit: 'lb' },
  { id: 'b2', name: 'Fruit Cake', category: Category.BAKED, price: 750, stock: 10, unit: 'lb' },
  { id: 'b3', name: 'Chocolate Cookies', category: Category.BAKED, price: 800, stock: 20, unit: 'kg' },
  { id: 'b4', name: 'Bread (Large)', category: Category.BAKED, price: 120, stock: 30, unit: 'pc' },
  { id: 'b5', name: 'Butter Croissant', category: Category.BAKED, price: 150, stock: 20, unit: 'pc' },
  { id: 'b6', name: 'Chocolate Brownie', category: Category.BAKED, price: 180, stock: 25, unit: 'pc' },
  { id: 'b7', name: 'Apple Puff', category: Category.BAKED, price: 90, stock: 40, unit: 'pc' },

  // Halwa Puri Items
  { id: 'h1', name: 'Puri', category: Category.HALWA_PURI, price: 25, stock: 500, unit: 'pc' },
  { id: 'h2', name: 'Cholay (Curry)', category: Category.HALWA_PURI, price: 150, stock: 50, unit: 'portion' },
  { id: 'h3', name: 'Suji Halwa', category: Category.HALWA_PURI, price: 120, stock: 40, unit: 'portion' },
  { id: 'h4', name: 'Aloo Bhujia', category: Category.HALWA_PURI, price: 100, stock: 40, unit: 'portion' },
  { id: 'h5', name: 'Sweet Lassi', category: Category.HALWA_PURI, price: 150, stock: 60, unit: 'glass' },
];

export const TAX_RATE = 0.05; // 5%
