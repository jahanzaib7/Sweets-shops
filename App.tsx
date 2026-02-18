
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  UserCircle,
  Plus,
  Minus,
  Trash2,
  Printer,
  ChevronRight,
  TrendingUp,
  Store,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { Category, UserRole, Item, CartItem, Sale, StockLog } from './types';
import { INITIAL_ITEMS, TAX_RATE } from './constants';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import AdminSettings from './components/AdminSettings';

const App: React.FC = () => {
  // Authentication State
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeTab, setActiveTab] = useState<'POS' | 'Inventory' | 'Reports' | 'Settings'>('POS');

  // Business Data State
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('bakery_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('bakery_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    const saved = localStorage.getItem('bakery_stock_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('bakery_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('bakery_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('bakery_stock_logs', JSON.stringify(stockLogs));
  }, [stockLogs]);

  // Handlers
  const handleUpdateStock = (itemId: string, quantity: number, type: 'IN' | 'OUT', reason: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = type === 'IN' ? item.stock + quantity : Math.max(0, item.stock - quantity);
        return { ...item, stock: newStock };
      }
      return item;
    }));

    const targetItem = items.find(i => i.id === itemId);
    const newLog: StockLog = {
      id: Date.now().toString(),
      itemId,
      itemName: targetItem?.name || 'Unknown',
      quantity,
      type,
      reason,
      timestamp: Date.now()
    };
    setStockLogs(prev => [newLog, ...prev]);
  };

  const handleCreateSale = (cartItems: CartItem[], totals: any) => {
    const newSale: Sale = {
      id: `INV-${Date.now()}`,
      timestamp: Date.now(),
      items: cartItems,
      totalBeforeTax: totals.subtotal,
      tax: totals.tax,
      discountTotal: totals.discount,
      grandTotal: totals.total,
      staffName: role === UserRole.ADMIN ? 'Admin User' : 'Staff User'
    };

    // Record Sale
    setSales(prev => [newSale, ...prev]);

    // Adjust Stock
    cartItems.forEach(item => {
      handleUpdateStock(item.id, item.quantity, 'OUT', `Sale ${newSale.id}`);
    });

    return newSale;
  };

  const handleAddItem = (newItem: Item) => {
    setItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const logout = () => {
    // Just a UI mock
    alert("In a real app, this would clear session cookies.");
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-900">
      {/* Sidebar - Hidden on print */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col no-print shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Shaan Sweets</h1>
            <p className="text-xs text-slate-400">POS System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <SidebarLink 
            active={activeTab === 'POS'} 
            onClick={() => setActiveTab('POS')} 
            icon={<ShoppingCart className="w-5 h-5" />} 
            label="POS Terminal" 
          />
          <SidebarLink 
            active={activeTab === 'Inventory'} 
            onClick={() => setActiveTab('Inventory')} 
            icon={<Package className="w-5 h-5" />} 
            label="Stock Management" 
          />
          <SidebarLink 
            active={activeTab === 'Reports'} 
            onClick={() => setActiveTab('Reports')} 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Sales Analytics" 
          />
          {role === UserRole.ADMIN && (
            <SidebarLink 
              active={activeTab === 'Settings'} 
              onClick={() => setActiveTab('Settings')} 
              icon={<Settings className="w-5 h-5" />} 
              label="Admin Controls" 
            />
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl mb-4">
            <UserCircle className="w-10 h-10 text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{role === UserRole.ADMIN ? 'Administrator' : 'Staff Member'}</p>
              <p className="text-xs text-slate-400">{role}</p>
            </div>
            <button 
              onClick={() => setRole(role === UserRole.ADMIN ? UserRole.STAFF : UserRole.ADMIN)}
              title="Toggle Role Demo"
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </button>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 no-print shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-xl text-slate-800">
              {activeTab === 'POS' && 'New Sale'}
              {activeTab === 'Inventory' && 'Inventory Dashboard'}
              {activeTab === 'Reports' && 'Business Intelligence'}
              {activeTab === 'Settings' && 'System Configuration'}
            </h2>
            <div className="h-4 w-[1px] bg-slate-300 mx-2" />
            <span className="text-sm text-slate-500 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Today's Revenue</span>
              <span className="font-bold text-lg text-emerald-600">
                Rs. {sales.reduce((acc, sale) => {
                  const today = new Date().setHours(0,0,0,0);
                  const saleDay = new Date(sale.timestamp).setHours(0,0,0,0);
                  return saleDay === today ? acc + sale.grandTotal : acc;
                }, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'POS' && (
            <POS 
              items={items} 
              onCheckout={handleCreateSale} 
              role={role}
            />
          )}
          {activeTab === 'Inventory' && (
            <Inventory 
              items={items} 
              onUpdateStock={handleUpdateStock} 
              role={role}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
            />
          )}
          {activeTab === 'Reports' && (
            <Reports sales={sales} items={items} />
          )}
          {activeTab === 'Settings' && role === UserRole.ADMIN && (
            <AdminSettings items={items} setItems={setItems} />
          )}
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default App;
