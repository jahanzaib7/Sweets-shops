
import React from 'react';
import { Sale } from '../types';
import { Store, Scissors } from 'lucide-react';

interface BillReceiptProps {
  sale: Sale;
  copyType: 'CUSTOMER' | 'STAFF/ADMIN';
}

const BillReceipt: React.FC<BillReceiptProps> = ({ sale, copyType }) => {
  return (
    <div className="w-[320px] bg-white border border-slate-100 shadow-sm p-6 print:shadow-none print:border-none print:p-0 flex flex-col">
      <div className="text-center space-y-1 mb-6">
        <div className="flex justify-center mb-2">
          <div className="p-2 bg-slate-900 rounded-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="font-bold text-lg uppercase tracking-wider">Shaan Sweets</h2>
        <p className="text-xs text-slate-500">Main Market, Gulberg, Lahore</p>
        <p className="text-xs text-slate-500">Phone: +92 300 1234567</p>
        <div className="py-2 border-y border-dashed border-slate-300 my-4 uppercase text-[10px] font-bold tracking-widest text-slate-400">
          {copyType} COPY
        </div>
      </div>

      <div className="space-y-1 text-xs mb-6">
        <div className="flex justify-between">
          <span className="text-slate-500">Bill No:</span>
          <span className="font-bold">{sale.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Date:</span>
          <span className="font-bold">{new Date(sale.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Staff:</span>
          <span className="font-bold">{sale.staffName}</span>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 font-bold">ITEM</th>
              <th className="text-center py-2 font-bold">QTY</th>
              <th className="text-right py-2 font-bold">PRICE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sale.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 text-slate-800 font-medium">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">Rs. {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-slate-300 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Subtotal:</span>
          <span className="font-bold">Rs. {sale.totalBeforeTax.toLocaleString()}</span>
        </div>
        {sale.discountTotal > 0 && (
          <div className="flex justify-between text-xs text-emerald-600">
            <span>Discount:</span>
            <span>-Rs. {sale.discountTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Sales Tax (5%):</span>
          <span className="font-bold">Rs. {sale.tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-lg pt-2">
          <span className="font-black">TOTAL:</span>
          <span className="font-black text-slate-900">Rs. {Math.round(sale.grandTotal).toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-slate-400">
        <p>Thank you for your business!</p>
        <p>Software Powered by Shaan Sweets POS</p>
      </div>

      {copyType === 'CUSTOMER' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-300 print:hidden">
          <Scissors className="w-4 h-4" />
          <div className="flex-1 border-t border-dashed" />
        </div>
      )}
    </div>
  );
};

export default BillReceipt;
