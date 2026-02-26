
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
  CreditCard,
  Store,
  Tag
} from 'lucide-react';
import { Item, CartItem, Sale, UserRole } from '../types';
import { TAX_RATE } from '../constants';
import BillReceipt from './BillReceipt';

interface POSProps {
  items: Item[];
  onCheckout: (cartItems: CartItem[], totals: any) => Sale;
  role: UserRole;
  categories: string[];
}

const POS: React.FC<POSProps> = ({ items, onCheckout, role, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0); // Overall bill discount percentage
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);

  const filterList = ['All', ...categories];

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
        <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search bakery items..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {filterList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === cat 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25 border-amber-500' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? <Store className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Items */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-6 pr-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              disabled={item.stock <= 0}
              className={`group flex flex-col bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-amber-400 transition-all text-left relative overflow-hidden ${item.stock <= 0 ? 'opacity-60 grayscale cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              {/* Image Header */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Store className="w-12 h-12" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black rounded-full shadow-sm border border-white/50 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>

                {item.stock < 10 && item.stock > 0 && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg border border-rose-400 animate-pulse uppercase tracking-widest">
                    Low Stock
                  </div>
                )}
                
                {item.stock <= 0 && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-6 py-2 bg-white text-slate-900 text-xs font-black rounded-full shadow-2xl uppercase tracking-[0.2em] border-2 border-white">SOLD OUT</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-black text-slate-800 text-lg group-hover:text-amber-600 transition-colors leading-tight mb-4 line-clamp-2">
                  {item.name}
                </h3>
                
                <div className="mt-auto flex items-end justify-between border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Price</p>
                    <p className="font-black text-slate-900 text-2xl flex items-baseline gap-1">
                      <span className="text-sm font-bold text-amber-500">Rs.</span>
                      {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Unit</p>
                    <p className="text-xs font-black text-slate-600 uppercase">
                      / {item.unit}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 p-4 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform rounded-tl-3xl shadow-2xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </button>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-slate-100 rounded-full mb-4">
                <Search className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No items found</h3>
              <p className="text-sm text-slate-400 mt-2">Try adjusting your search or category filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart/Checkout Section */}
      <div className="w-[420px] bg-white border-l shadow-2xl flex flex-col overflow-hidden no-print rounded-tl-[3rem] border-slate-100">
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-800">New Order</h2>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Active Session</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl shadow-lg">
            {cart.reduce((acc, i) => acc + i.quantity, 0)} UNITS
          </span>
        </div>

        {/* Cart List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-10 h-10 text-slate-300" />
              </div>
              <p className="font-black text-slate-400 uppercase tracking-widest">Basket Empty</p>
              <p className="text-sm text-slate-400 mt-2">Select delicious items from the left to start billing</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl group relative hover:border-amber-200 transition-all shadow-sm">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">Rs. {item.price.toLocaleString()} x {item.quantity}</p>
                  <p className="text-sm font-black mt-2 text-amber-600">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 active:scale-90 transition-all">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black min-w-[30px] text-center text-slate-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 active:scale-90 transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-8 border-t bg-slate-50/50 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span className="uppercase tracking-widest">Subtotal</span>
              <span className="text-slate-800">Rs. {totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold group">
              <div className="flex items-center gap-2 text-slate-500">
                <TicketPercent className="w-5 h-5 text-emerald-500" />
                <span className="uppercase tracking-widest">Promo Disc.</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="w-16 px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-right text-sm font-black focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span className="uppercase tracking-widest">Tax (5%)</span>
              <span className="text-slate-800">Rs. {totals.tax.toLocaleString()}</span>
            </div>
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Grand Total</span>
                <span className="text-3xl font-black text-slate-900 leading-none">
                  <span className="text-sm font-bold text-amber-500 mr-1">Rs.</span>
                  {Math.round(totals.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleProcessCheckout}
            className={`w-full py-6 rounded-[2rem] flex items-center justify-center gap-3 font-black text-lg text-white shadow-2xl transition-all active:scale-[0.97] ${
              cart.length > 0 
              ? 'bg-slate-900 hover:bg-black shadow-slate-900/20' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-100'
            }`}
          >
            <CreditCard className="w-6 h-6" />
            Process Billing
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b flex justify-between items-center no-print bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Checkout Complete</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Transaction Recorded</p>
                </div>
              </div>
              <button onClick={() => setShowReceipt(null)} className="p-4 hover:bg-slate-200 rounded-full transition-all">
                <X className="w-8 h-8 text-slate-400" />
              </button>
            </div>
            
            <div className="p-12">
              <div className="flex flex-col md:flex-row gap-12 justify-center">
                <BillReceipt sale={showReceipt} copyType="CUSTOMER" />
                <div className="w-[1px] bg-slate-100 hidden md:block" />
                <BillReceipt sale={showReceipt} copyType="STAFF/ADMIN" />
              </div>

              <div className="mt-12 flex justify-center gap-4 no-print">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  <Printer className="w-6 h-6" />
                  Print Both Tickets
                </button>
                <button 
                  onClick={() => setShowReceipt(null)}
                  className="px-10 py-5 border-2 border-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-50 transition-all"
                >
                  Close Terminal
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
