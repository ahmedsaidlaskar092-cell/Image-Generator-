import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { Transaction, User } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Check, X, Search, User as UserIcon, Coins, CreditCard, ShieldAlert } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'payments' | 'users'>('payments');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = () => {
    setTransactions(storeService.getTransactions().sort((a, b) => b.date - a.date));
    setUsers(storeService.getUsers());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Auto refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (txId: string) => {
    if (confirm('Confirm payment approval? Coins will be added to user.')) {
      storeService.updateTransactionStatus(txId, 'approved');
      refreshData();
    }
  };

  const handleReject = (txId: string) => {
    if (confirm('Reject this transaction?')) {
      storeService.updateTransactionStatus(txId, 'rejected');
      refreshData();
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
        <p className="text-slate-500">You do not have permission to view this area.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage users and payments</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'payments' 
                ? 'bg-white dark:bg-primary-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Payments ({transactions.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-white dark:bg-primary-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Users ({users.length})
          </button>
        </div>
      </div>

      {activeTab === 'payments' ? (
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">UTR / Ref ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{tx.userName}</div>
                      <div className="text-xs text-slate-500">ID: {tx.userId.slice(0, 6)}...</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{tx.planName}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{tx.amount}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{tx.utr}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        tx.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(tx.id)}
                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(tx.id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
           <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
           </div>
           
           <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Plan</th>
                      <th className="px-6 py-4 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.includes(searchTerm)).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                           }`}>
                             {user.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 capitalize text-slate-600 dark:text-slate-300">{user.plan}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Coins className="w-4 h-4" />
                            {user.coins}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;