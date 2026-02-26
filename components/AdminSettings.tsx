
import React, { useState } from 'react';
import { 
  Database, 
  RefreshCcw, 
  FileJson, 
  Trash2, 
  Users,
  UserPlus,
  X,
  Shield,
  ShieldCheck,
  Tag,
  Plus
} from 'lucide-react';
import { Item, StaffMember, UserRole } from '../types';
import { INITIAL_ITEMS } from '../constants';

interface AdminSettingsProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  staff: StaffMember[];
  onAddStaff: (staff: StaffMember) => void;
  onRemoveStaff: (id: string) => void;
  categories: string[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  items, setItems, staff, onAddStaff, onRemoveStaff, categories, onAddCategory, onRemoveCategory 
}) => {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  const resetToInitial = () => {
    if (confirm("Reset everything to factory defaults? All sales and staff data will be cleared.")) {
      setItems(INITIAL_ITEMS);
      localStorage.clear();
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = { items, sales: JSON.parse(localStorage.getItem('bakery_sales') || '[]'), staff, categories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shaan_sweets_backup.json`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Category Management */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        <h3 className="text-xl font-black flex items-center gap-3 text-slate-800 mb-6">
          <Tag className="w-6 h-6 text-amber-500" />
          Category Management
        </h3>
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Add new category..."
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button 
            onClick={() => {
              if (newCatName.trim()) {
                onAddCategory(newCatName.trim());
                setNewCatName('');
              }
            }}
            className="px-6 bg-slate-900 text-white font-bold rounded-2xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <div key={cat} className="group flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 border border-slate-200 hover:border-amber-500 transition-all">
              {cat}
              <button 
                onClick={() => onRemoveCategory(cat)}
                className="p-1 hover:text-rose-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-xl font-black flex items-center gap-3 text-slate-800">
              <Users className="w-6 h-6 text-amber-500" />
              Staff Registry
            </h3>
          </div>
          <button onClick={() => setShowAddStaff(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-all">
            <UserPlus className="w-5 h-5" />
            Add New
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(member => (
                <tr key={member.id}>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{member.name}</span>
                      <span className="text-[10px] text-amber-500 font-bold uppercase">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-medium text-slate-500">@{member.username}</td>
                  <td className="px-8 py-4 text-center">
                    <button onClick={() => onRemoveStaff(member.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black flex items-center gap-3 mb-6 text-slate-800">
          <Database className="w-6 h-6 text-amber-500" />
          Maintenance
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <button onClick={exportData} className="p-8 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex flex-col items-center gap-4">
            <FileJson className="w-8 h-8" />
            Export System Data
          </button>
          <button onClick={resetToInitial} className="p-8 bg-rose-50 text-rose-600 rounded-[2rem] font-black text-lg flex flex-col items-center gap-4 border border-rose-100">
            <RefreshCcw className="w-8 h-8" />
            Factory Reset
          </button>
        </div>
      </div>

      {showAddStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8">
            <div className="flex justify-between mb-8">
              <h3 className="text-2xl font-black">Register Staff</h3>
              <button onClick={() => setShowAddStaff(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              onAddStaff({ id: `st-${Date.now()}`, name: d.get('name') as string, username: d.get('username') as string, role: d.get('role') as UserRole, joinedAt: Date.now() });
              setShowAddStaff(false);
            }} className="space-y-6">
              <input name="name" required placeholder="Full Name" className="w-full px-5 py-3.5 border rounded-2xl" />
              <input name="username" required placeholder="Username" className="w-full px-5 py-3.5 border rounded-2xl" />
              <select name="role" className="w-full px-5 py-3.5 border rounded-2xl">
                <option value={UserRole.STAFF}>Staff Member</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
              <button type="submit" className="w-full py-5 bg-amber-500 text-white font-black rounded-3xl">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
