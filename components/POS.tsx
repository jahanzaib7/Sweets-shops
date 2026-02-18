
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  X, 
  ShoppingCart, 
  Receipt, 
  TicketPercent, 
  Calculator,
  AlertTriangle,
  Printer,
  CreditCard
} from 'lucide-react';
import { Item, Category, CartItem, Sale, UserRole } from '../types';
import { TAX_RATE } from '../constants';
import BillReceipt from './BillReceipt';

interface POSProps {
  items: Item[];
  onCheckout: (cartItems: CartItem[], totals: any) => Sale;
  role: UserRole;
}

const POS: React.FC<POSProps> = ({ items, onCheckout, role }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0); // Overall bill discount percentage
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);

  const categories = ['All', ...Object.values(Category)];

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          alert("Insufficient stock available!");
          return prev;
        }
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      if (item.stock <= 0) {
        alert("Item is out of stock!");
        return prev;
      }
      return [...prev, { ...item, quantity: 1, discount: 0 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === itemId) {
        const itemStock = items.find(i => i.id === itemId)?.stock || 0;
        const newQty = Math.max(1, c.quantity + delta);
        if (newQty > itemStock) {
          alert("Exceeds available stock!");
          return c;
        }
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountVal = (subtotal * discount) / 100;
    const tax = (subtotal - discountVal) * TAX_RATE;
    const total = subtotal - discountVal + tax;
    return { subtotal, discount: discountVal, tax, total };
  }, [cart, discount]);

  const handleProcessCheckout = () => {
    if (cart.length === 0) return;
    const sale = onCheckout(cart, totals);
    setShowReceipt(sale);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Items Section */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items by name..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[500px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Items */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-4">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              disabled={item.stock <= 0}
              className={`group flex flex-col p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-left relative overflow-hidden ${item.stock <= 0 ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
            >
              {item.stock < 10 && item.stock > 0 && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full border border-rose-200">
                  Low Stock
                </div>
              )}
              {item.stock <= 0 && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full border border-slate-300">
                  Out of Stock
                </div>
              )}
              
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{item.category}</span>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">{item.name}</h3>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400">Price / {item.unit}</p>
                  <p className="font-bold text-slate-900 text-xl">Rs. {item.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Available</p>
                  <p className={`text-xs font-bold ${item.stock < 10 ? 'text-rose-500' : 'text-slate-600'}`}>
                    {item.stock} {item.unit}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 p-3 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform rounded-tl-2xl">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart/Checkout Section */}
      <div className="w-96 bg-white border-l shadow-2xl flex flex-col overflow-hidden no-print">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="font-bold text-lg">Current Order</h2>
          </div>
          <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md">
            {cart.length} items
          </span>
        </div>

        {/* Cart List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm">Click items on the left to add them to the bill</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl group relative">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500">Rs. {item.price} x {item.quantity}</p>
                  <p className="text-sm font-bold mt-1 text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div className="flex flex-col justify-between items-end gap-2">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-600"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-bold min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-600"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-6 border-t bg-slate-50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">Rs. {totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm group">
              <div className="flex items-center gap-1 text-slate-500">
                <TicketPercent className="w-4 h-4 text-emerald-500" />
                <span>Discount (%)</span>
              </div>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-0.5 border border-slate-200 rounded bg-white text-right text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="font-medium">Rs. {totals.tax.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="font-bold text-slate-800">Total Amount</span>
              <span className="text-2xl font-bold text-amber-600">Rs. {Math.round(totals.total).toLocaleString()}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleProcessCheckout}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-lg transition-all ${
              cart.length > 0 
              ? 'bg-amber-500 hover:bg-amber-600 active:scale-95 shadow-amber-500/25' 
              : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            Checkout & Print
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center no-print">
              <h3 className="text-xl font-bold">Billing Complete</h3>
              <button onClick={() => setShowReceipt(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 justify-center">
                {/* Print view renders two receipts */}
                <BillReceipt sale={showReceipt} copyType="CUSTOMER" />
                <div className="w-[1px] bg-slate-200 hidden md:block" />
                <BillReceipt sale={showReceipt} copyType="STAFF/ADMIN" />
              </div>

              <div className="mt-8 flex justify-center gap-4 no-print">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Print Both Copies
                </button>
                <button 
                  onClick={() => setShowReceipt(null)}
                  className="px-6 py-3 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
