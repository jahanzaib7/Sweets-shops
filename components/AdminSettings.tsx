
import React from 'react';
import { 
  Database, 
  RefreshCcw, 
  FileJson, 
  Trash2, 
  ShieldAlert,
  Save
} from 'lucide-react';
import { Item } from '../types';
import { INITIAL_ITEMS } from '../constants';

interface AdminSettingsProps {
  items: Item[];
  setItems: (items: Item[]) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ items, setItems }) => {
  const resetToInitial = () => {
    if (confirm("This will overwrite all items with factory defaults and clear stock. Are you sure?")) {
      setItems(INITIAL_ITEMS);
      localStorage.removeItem('bakery_sales');
      localStorage.removeItem('bakery_stock_logs');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      items,
      sales: JSON.parse(localStorage.getItem('bakery_sales') || '[]'),
      logs: JSON.parse(localStorage.getItem('bakery_stock_logs') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bakery_pos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Database className="w-6 h-6 text-amber-500" />
          Data Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold mb-2">Export Business Data</h4>
              <p className="text-sm text-slate-500 mb-6">Download a complete JSON backup of your items, sales history, and stock logs for secure storage.</p>
            </div>
            <button 
              onClick={exportData}
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              <FileJson className="w-5 h-5" />
              Download Backup
            </button>
          </div>

          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-rose-800 mb-2">Reset Database</h4>
              <p className="text-sm text-rose-600 mb-6">DANGER: This action will restore initial 30 bakery items and delete all transaction history permanently.</p>
            </div>
            <button 
              onClick={resetToInitial}
              className="flex items-center justify-center gap-2 w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              Factory Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200">
        <div className="flex gap-4">
          <ShieldAlert className="w-12 h-12 text-amber-600 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Administrator Security Note</h3>
            <p className="text-amber-700">You are currently in Admin mode. This grants you full access to stock modification, report generation, and system configuration. Ensure you sign out or lock the terminal when leaving the counter unattended.</p>
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 transition-all">Review Audit Logs</button>
              <button className="px-6 py-2 bg-white text-amber-700 font-bold rounded-lg border border-amber-200 hover:bg-amber-100 transition-all">Staff Management</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
