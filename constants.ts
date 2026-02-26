
import { Category, Item } from './types';

export const INITIAL_ITEMS: Item[] = [
  // Mitha (Sweets)
  { id: 'm1', name: 'Gulab Jamun', category: Category.MITHA, price: 1200, stock: 50, unit: 'kg', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=400' },
  { id: 'm2', name: 'Barfi (Special)', category: Category.MITHA, price: 1400, stock: 30, unit: 'kg', image: 'https://images.unsplash.com/photo-1605192554106-d549b1b975cd?auto=format&fit=crop&q=80&w=400' },
  { id: 'm3', name: 'Jalebi', category: Category.MITHA, price: 600, stock: 100, unit: 'kg', image: 'https://images.unsplash.com/photo-1589119908679-0559f27329d4?auto=format&fit=crop&q=80&w=400' },
  { id: 'm4', name: 'Ras Malai', category: Category.MITHA, price: 200, stock: 40, unit: 'pc', image: 'https://images.unsplash.com/photo-1634840882338-23961622353a?auto=format&fit=crop&q=80&w=400' },
  { id: 'm5', name: 'Motichoor Laddu', category: Category.MITHA, price: 900, stock: 60, unit: 'kg', image: 'https://images.unsplash.com/photo-1605192554106-d549b1b975cd?auto=format&fit=crop&q=80&w=400' },
  { id: 'm6', name: 'Sohan Halwa', category: Category.MITHA, price: 1800, stock: 20, unit: 'kg', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&q=80&w=400' },
  { id: 'm7', name: 'Kalakand', category: Category.MITHA, price: 1500, stock: 25, unit: 'kg', image: 'https://images.unsplash.com/photo-1616431775246-6552e043684a?auto=format&fit=crop&q=80&w=400' },
  { id: 'm8', name: 'Chum Chum', category: Category.MITHA, price: 1100, stock: 35, unit: 'kg', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=400' },
  { id: 'm9', name: 'Balushahi', category: Category.MITHA, price: 1000, stock: 40, unit: 'kg', image: 'https://images.unsplash.com/photo-1605192554106-d549b1b975cd?auto=format&fit=crop&q=80&w=400' },
  { id: 'm10', name: 'Petha', category: Category.MITHA, price: 800, stock: 45, unit: 'kg', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&q=80&w=400' },

  // Savory Items
  { id: 's1', name: 'Samosa (Potato)', category: Category.SAVORY, price: 30, stock: 200, unit: 'pc', image: 'https://images.unsplash.com/photo-1601050633647-81a35d377a66?auto=format&fit=crop&q=80&w=400' },
  { id: 's2', name: 'Chicken Patty', category: Category.SAVORY, price: 80, stock: 50, unit: 'pc', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400' },
  { id: 's3', name: 'Vegetable Roll', category: Category.SAVORY, price: 60, stock: 80, unit: 'pc', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400' },
  { id: 's4', name: 'Paneer Pakora', category: Category.SAVORY, price: 120, stock: 100, unit: 'plate', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400' },
  { id: 's5', name: 'Kachori', category: Category.SAVORY, price: 40, stock: 150, unit: 'pc', image: 'https://images.unsplash.com/photo-1601050633647-81a35d377a66?auto=format&fit=crop&q=80&w=400' },
  { id: 's6', name: 'Mix Nimko', category: Category.SAVORY, price: 500, stock: 30, unit: 'kg', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=400' },
  { id: 's7', name: 'Dahi Bhalle', category: Category.SAVORY, price: 180, stock: 40, unit: 'plate', image: 'https://images.unsplash.com/photo-1626777553730-b8f6951739c6?auto=format&fit=crop&q=80&w=400' },
  { id: 's8', name: 'Papri Chaat', category: Category.SAVORY, price: 150, stock: 40, unit: 'plate', image: 'https://images.unsplash.com/photo-1626777553730-b8f6951739c6?auto=format&fit=crop&q=80&w=400' },

  // Baked Goods
  { id: 'b1', name: 'Plain Cake', category: Category.BAKED, price: 600, stock: 15, unit: 'lb', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400' },
  { id: 'b2', name: 'Fruit Cake', category: Category.BAKED, price: 750, stock: 10, unit: 'lb', image: 'https://images.unsplash.com/photo-1519340333755-50721343aa82?auto=format&fit=crop&q=80&w=400' },
  { id: 'b3', name: 'Chocolate Cookies', category: Category.BAKED, price: 800, stock: 20, unit: 'kg', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400' },
  { id: 'b4', name: 'Bread (Large)', category: Category.BAKED, price: 120, stock: 30, unit: 'pc', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'b5', name: 'Butter Croissant', category: Category.BAKED, price: 150, stock: 20, unit: 'pc', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400' },
  { id: 'b6', name: 'Chocolate Brownie', category: Category.BAKED, price: 180, stock: 25, unit: 'pc', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400' },
  { id: 'b7', name: 'Apple Puff', category: Category.BAKED, price: 90, stock: 40, unit: 'pc', image: 'https://images.unsplash.com/photo-1601050633647-81a35d377a66?auto=format&fit=crop&q=80&w=400' },

  // Halwa Puri Items
  { id: 'h1', name: 'Puri', category: Category.HALWA_PURI, price: 25, stock: 500, unit: 'pc', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=400' },
  { id: 'h2', name: 'Cholay (Curry)', category: Category.HALWA_PURI, price: 150, stock: 50, unit: 'portion', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400' },
  { id: 'h3', name: 'Suji Halwa', category: Category.HALWA_PURI, price: 120, stock: 40, unit: 'portion', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&q=80&w=400' },
  { id: 'h4', name: 'Aloo Bhujia', category: Category.HALWA_PURI, price: 100, stock: 40, unit: 'portion', image: 'https://images.unsplash.com/photo-1601050633647-81a35d377a66?auto=format&fit=crop&q=80&w=400' },
  { id: 'h5', name: 'Sweet Lassi', category: Category.HALWA_PURI, price: 150, stock: 60, unit: 'glass', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed2bb4?auto=format&fit=crop&q=80&w=400' },
];

export const TAX_RATE = 0.05; // 5%
