
import React, { useState } from 'react';
import { 
  Plus, 
  Minus,
  Search, 
  Edit2, 
  Trash2, 
  X,
  AlertCircle,
  ImageIcon,
  Filter
} from 'lucide-react';
import { Item, UserRole } from '../types';

interface InventoryProps {
  items: Item[];
  onUpdateStock: (itemId: string, quantity: number, type: 'IN' | 'OUT', reason: string) => void;
  role: UserRole;
  onAddItem: (item: Item) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (item: Item) => void;
  categories: string[];
}

const Inventory: React.FC<InventoryProps> = ({ items, onUpdateStock, role, onAddItem, onRemoveItem, onUpdateItem, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [stockAction, setStockAction] = useState<{ type: 'IN' | 'OUT'; quantity: number; reason: string } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !stockAction) return;
    onUpdateStock(selectedItem.id, stockAction.quantity, stockAction.type, stockAction.reason);
    setSelectedItem(null);
    setStockAction(null);
  };

  const handleNewItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: Item = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      unit: formData.get('unit') as string,
      image: formData.get('image') as string,
    };
    onAddItem(newItem);
    setIsAddingNew(false);
  };

  const handleUpdateItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    const formData = new FormData(e.currentTarget);
    const updated: Item = {
      ...editingItem,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      unit: formData.get('unit') as string,
      image: formData.get('image') as string,
    };
    onUpdateItem(updated);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select 
              className="pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 shadow-sm appearance-none min-w-[200px] transition-all"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        
        {role === 'ADMIN' && (
          <button 
            onClick={() => setIsAddingNew(true)}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Product
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border shadow-inner">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-6 h-6" /></div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">Rs. {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-wider border border-slate-200">{item.category}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`font-black ${item.stock < 10 ? 'text-rose-500' : 'text-slate-800'}`}>{item.stock} {item.unit}</span>
                      {item.stock < 10 && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setSelectedItem(item); setStockAction({ type: 'IN', quantity: 0, reason: '' }); }} className="p-3 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"><Plus className="w-5 h-5" /></button>
                      {role === 'ADMIN' && (
                        <>
                          <button onClick={() => setEditingItem(item)} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><Edit2 className="w-5 h-5" /></button>
                          <button onClick={() => onRemoveItem(item.id)} className="p-3 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals are updated to use categories list and image fields */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 overflow-hidden">
            <div className="flex justify-between mb-8">
              <h3 className="text-3xl font-black">Register Product</h3>
              <button onClick={() => setIsAddingNew(false)}><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleNewItemSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <input name="name" required placeholder="Display Name" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              </div>
              <select name="category" required className="w-full px-6 py-4 bg-slate-50 border rounded-2xl appearance-none">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" name="price" required placeholder="Price (Rs.)" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              <input type="number" name="stock" required placeholder="Stock" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              <input name="unit" required placeholder="Unit (kg/pc)" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              <div className="col-span-2">
                <input name="image" placeholder="Image URL (Unsplash or direct link)" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              </div>
              <button type="submit" className="col-span-2 py-6 bg-amber-500 text-white font-black text-xl rounded-[2rem]">Commit to Inventory</button>
            </form>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 overflow-hidden">
            <div className="flex justify-between mb-8">
              <h3 className="text-3xl font-black">Update Product</h3>
              <button onClick={() => setEditingItem(null)}><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleUpdateItemSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <input name="name" defaultValue={editingItem.name} required placeholder="Display Name" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              </div>
              <select name="category" defaultValue={editingItem.category} required className="w-full px-6 py-4 bg-slate-50 border rounded-2xl appearance-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" name="price" defaultValue={editingItem.price} required placeholder="Price" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              <input name="unit" defaultValue={editingItem.unit} required placeholder="Unit" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              <div className="col-span-2">
                <input name="image" defaultValue={editingItem.image} placeholder="Image URL" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl" />
              </div>
              <button type="submit" className="col-span-2 py-6 bg-slate-900 text-white font-black text-xl rounded-[2rem]">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {selectedItem && stockAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 overflow-hidden">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Adjust Stock</h3>
                <p className="text-xs text-slate-400 font-bold uppercase">{selectedItem.name}</p>
              </div>
              <button onClick={() => setSelectedItem(null)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleStockSubmit} className="space-y-6">
              <div className="flex gap-4">
                <button type="button" onClick={() => setStockAction({...stockAction, type: 'IN'})} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${stockAction.type === 'IN' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-100 text-slate-400'}`}>Stock In</button>
                <button type="button" onClick={() => setStockAction({...stockAction, type: 'OUT'})} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${stockAction.type === 'OUT' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'border-slate-100 text-slate-400'}`}>Stock Out</button>
              </div>
              <input type="number" required placeholder="Quantity" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={stockAction.quantity || ''} onChange={(e) => setStockAction({...stockAction, quantity: Number(e.target.value)})} />
              <input type="text" required placeholder="Reason for adjustment" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={stockAction.reason} onChange={(e) => setStockAction({...stockAction, reason: e.target.value})} />
              <button className={`w-full py-5 text-white font-black text-lg rounded-[2rem] shadow-xl ${stockAction.type === 'IN' ? 'bg-emerald-600' : 'bg-rose-600'}`}>Confirm Adjustment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
