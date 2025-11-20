import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Coins, Mail, Shield, CreditCard } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-safe-area animate-slide-up">
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-dark-border">
        {/* Header Background */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-600 to-accent-600 relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-8 sm:px-8">
          {/* Avatar - Responsive positioning */}
          <div className="absolute -top-12 sm:-top-16 left-6 sm:left-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-dark-surface shadow-lg bg-white overflow-hidden">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile Layout Adjustments */}
          <div className="flex flex-col sm:flex-row justify-end pt-14 sm:pt-4 mb-4 sm:mb-8">
             <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs sm:text-sm font-medium border border-primary-100 dark:border-primary-900/50 self-start sm:self-auto mt-2 sm:mt-0">
               Member since {new Date().getFullYear()}
             </span>
          </div>

          <div className="mt-4 sm:mt-8">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">{user.name}</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span className="break-all">{user.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {/* Coin Balance Card */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex sm:block items-center justify-between sm:justify-start">
              <div className="flex items-center gap-3 mb-0 sm:mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white sm:hidden">Coins</h3>
              </div>
              <div className="text-right sm:text-left">
                 <h3 className="font-semibold text-slate-900 dark:text-white hidden sm:block mb-2">Wallet Balance</h3>
                 <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{user.coins}</p>
                 <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1 hidden sm:block">Available to spend</p>
              </div>
            </div>

            {/* Plan Card */}
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex sm:block items-center justify-between sm:justify-start">
              <div className="flex items-center gap-3 mb-0 sm:mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white sm:hidden">Plan</h3>
              </div>
              <div className="text-right sm:text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white hidden sm:block mb-2">Current Plan</h3>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 capitalize">{user.plan}</p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 hidden sm:block">Active Subscription</p>
              </div>
            </div>

            {/* Role Card */}
            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 flex sm:block items-center justify-between sm:justify-start">
              <div className="flex items-center gap-3 mb-0 sm:mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white sm:hidden">Role</h3>
              </div>
              <div className="text-right sm:text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white hidden sm:block mb-2">Account Role</h3>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 capitalize">{user.role}</p>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1 hidden sm:block">Access Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;