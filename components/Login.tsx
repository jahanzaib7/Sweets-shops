
import React, { useState } from 'react';
import { Store, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { StaffMember } from '../types';

interface LoginProps {
  onLogin: (user: StaffMember) => void;
  staff: StaffMember[];
}

const Login: React.FC<LoginProps> = ({ onLogin, staff }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = staff.find(s => s.username === username);
    
    // Simple password check (password is username + 123 for demo, or 'admin' for admin)
    const isValid = (username === 'admin' && password === 'admin') || (user && password === 'password');

    if (isValid) {
      onLogin(user || staff[0]);
    } else {
      setError('Invalid username or password. (Try admin/admin or ahmad/password)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                <Store className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Shaan Sweets</h1>
            <p className="text-slate-400 font-medium">Bakery POS Terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-5">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Sign In to Terminal
              <ShieldCheck className="w-5 h-5" />
            </button>

            <div className="text-center pt-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Secure Enterprise Access Only<br/>
                Authorized Personnel Only
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
