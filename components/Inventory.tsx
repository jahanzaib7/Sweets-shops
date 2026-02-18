
import React, { useState } from 'react';
import { 
  Plus, 
  Minus,
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  History,
  AlertCircle
} from 'lucide-react';
import { Item, Category, UserRole } from '../types';

interface InventoryProps {
  items: Item[];
  onUpdateStock: (itemId: string, quantity: number, type: 'IN' | 'OUT', reason: string) => void;
  role: UserRole;
  onAddItem: (item: Item) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (item: Item) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onUpdateStock, role, onAddItem, onRemoveItem, onUpdateItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [stockAction, setStockAction] = useState<{ type: 'IN' | 'OUT'; quantity: number; reason: string } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      category: formData.get('category') as Category,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      unit: formData.get('unit') as string,
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
      category: formData.get('category') as Category,
      price: Number(formData.get('price')),
      unit: formData.get('unit') as string,
    };
    onUpdateItem(updated);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {role === UserRole.ADMIN && (
          <button 
            onClick={() => setIsAddingNew(true)}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-xs text-slate-400 font-medium">SKU: {item.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">Rs. {item.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 ml-1">/{item.unit}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${item.stock < 10 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {item.stock} {item.unit}
                    </span>
                    {item.stock < 10 && <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => { setSelectedItem(item); setStockAction({ type: 'IN', quantity: 0, reason: '' }); }}
                      className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                      title="Update Stock"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {role === UserRole.ADMIN && (
                      <>
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(confirm("Are you sure?")) onRemoveItem(item.id); }}
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Update Modal */}
      {selectedItem && stockAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Adjust Stock</h3>
                <p className="text-sm text-slate-400">{selectedItem.name}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleStockSubmit} className="p-6 space-y-4">
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setStockAction({ ...stockAction, type: 'IN' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${stockAction.type === 'IN' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-100 text-slate-400'}`}
                >
                  <Plus className="w-4 h-4" /> Stock In
                </button>
                <button 
                  type="button"
                  onClick={() => setStockAction({ ...stockAction, type: 'OUT' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${stockAction.type === 'OUT' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-100 text-slate-400'}`}
                >
                  <Minus className="w-4 h-4" /> Stock Out
                </button>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Quantity ({selectedItem.unit})</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={stockAction.quantity}
                  onChange={(e) => setStockAction({ ...stockAction, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Reason/Reference</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Daily Fresh Stock, Expired, Damages"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={stockAction.reason}
                  onChange={(e) => setStockAction({ ...stockAction, reason: e.target.value })}
                />
              </div>
              <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg mt-2">
                Confirm Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">New Product Registration</h3>
              <button onClick={() => setIsAddingNew(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleNewItemSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Name</label>
                <input name="name" required className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                <select name="category" required className="w-full px-4 py-2 border rounded-xl">
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price (Rs.)</label>
                <input type="number" name="price" required className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Initial Stock</label>
                <input type="number" name="stock" required className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Unit</label>
                <input name="unit" required placeholder="kg, pc, lb" className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div className="col-span-2 mt-4">
                <button type="submit" className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Product</h3>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateItemSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Name</label>
                <input name="name" defaultValue={editingItem.name} required className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                <select name="category" defaultValue={editingItem.category} required className="w-full px-4 py-2 border rounded-xl">
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price (Rs.)</label>
                <input type="number" name="price" defaultValue={editingItem.price} required className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Unit</label>
                <input name="unit" defaultValue={editingItem.unit} required className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div className="col-span-2 mt-4">
                <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Update Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
