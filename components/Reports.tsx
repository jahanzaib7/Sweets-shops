
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Calendar,
  FileText,
  Clock
} from 'lucide-react';
import { Sale, Category, Item } from '../types';

interface ReportsProps {
  sales: Sale[];
  items: Item[];
}

const Reports: React.FC<ReportsProps> = ({ sales, items }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.grandTotal, 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Category Breakdown
    const categorySales: Record<string, number> = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
      });
    });

    const categoryData = Object.entries(categorySales).map(([name, value]) => ({ name, value }));

    // Hourly Breakdown (last 24 hours simulation)
    const hourlySales: Record<number, number> = {};
    sales.forEach(sale => {
      const hour = new Date(sale.timestamp).getHours();
      hourlySales[hour] = (hourlySales[hour] || 0) + sale.grandTotal;
    });

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      amount: Math.round(hourlySales[i] || 0)
    }));

    return { totalRevenue, totalOrders, avgOrderValue, categoryData, hourlyData };
  }, [sales]);

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Revenue" 
          value={`Rs. ${Math.round(stats.totalRevenue).toLocaleString()}`} 
          icon={<DollarSign className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard 
          label="Total Orders" 
          value={stats.totalOrders.toString()} 
          icon={<FileText className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard 
          label="Average Bill" 
          value={`Rs. ${Math.round(stats.avgOrderValue).toLocaleString()}`} 
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard 
          label="Top Category" 
          value={stats.categoryData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'} 
          icon={<Package className="w-6 h-6" />}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            Category Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Total Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Hour */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Today's Hourly Sales
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <button className="text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors">Export CSV</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date/Time</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Items</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.slice(0, 10).map(sale => (
              <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{sale.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(sale.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-medium">{sale.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-emerald-600">Rs. {Math.round(sale.grandTotal).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{sale.staffName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ 
  label, value, icon, color 
}) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
};

export default Reports;
