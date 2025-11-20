import React, { useState } from 'react';
import { AppMode, PageView } from '../types';
import { Sparkles, ImagePlus, ScanEye, Moon, Sun, Palette, LogOut, User as UserIcon, Coins, ShieldCheck, CreditCard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentPage: PageView;
  onPageChange: (page: PageView) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentMode, 
  onModeChange, 
  isDarkMode, 
  toggleTheme,
  currentPage,
  onPageChange
}) => {
  const { user, logout, isAdmin } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { mode: AppMode.GENERATE, label: 'Generate', icon: <Sparkles className="w-5 h-5" /> },
    { mode: AppMode.EDIT, label: 'Edit', icon: <Palette className="w-5 h-5" /> },
    { mode: AppMode.ANALYZE, label: 'Analyze', icon: <ScanEye className="w-5 h-5" /> },
  ];

  const handleNavClick = (mode: AppMode) => {
    onPageChange(PageView.TOOLS);
    onModeChange(mode);
  };

  const handleProfileMenuClick = (action: 'profile' | 'subscription' | 'admin' | 'logout') => {
    setIsProfileMenuOpen(false);
    if (action === 'logout') {
      logout();
    } else if (action === 'profile') {
      onPageChange(PageView.PROFILE);
    } else if (action === 'subscription') {
      onPageChange(PageView.SUBSCRIPTION);
    } else if (action === 'admin') {
      onPageChange(PageView.ADMIN);
    }
  };

  return (
    <>
      {/* Desktop & Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-dark-bg/80 border-b border-slate-200/50 dark:border-white/5 transition-all duration-300 shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group" 
              onClick={() => handleNavClick(AppMode.GENERATE)}
            >
              <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-105">
                <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary-600 dark:from-white dark:to-primary-400 tracking-tight">
                Lumina
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wider hidden sm:inline-block">
                  Admin
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center p-1 bg-slate-100/50 dark:bg-white/5 rounded-full border border-slate-200/50 dark:border-white/5 backdrop-blur-sm mx-4">
              {navItems.map((item) => (
                <button
                  key={item.mode}
                  onClick={() => handleNavClick(item.mode)}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === PageView.TOOLS && currentMode === item.mode
                      ? 'bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-md shadow-slate-200/50 dark:shadow-primary-900/50 scale-105'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Coins Display (Compact on mobile) */}
              <div 
                className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full border border-amber-200 dark:border-amber-700/50 cursor-pointer active:scale-95 transition-transform"
                onClick={() => onPageChange(PageView.SUBSCRIPTION)}
              >
                <div className="p-0.5 sm:p-1 bg-amber-400 rounded-full">
                   <Coins className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
                  {user?.coins || 0}
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-white/10 hidden sm:flex"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 p-[2px] shadow-lg shadow-primary-500/20">
                    <img 
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                      alt="User" 
                      className="w-full h-full rounded-full bg-white dark:bg-dark-surface object-cover"
                    />
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border py-2 z-50 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      
                      {/* Mobile Only Menu Items */}
                      <div className="sm:hidden border-b border-slate-100 dark:border-white/5">
                        <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center space-x-3">
                           {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                           <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                      </div>

                      <div className="py-1">
                        <button onClick={() => handleProfileMenuClick('profile')} className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center space-x-3 group">
                          <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                          <span>My Profile</span>
                        </button>
                        
                        <button onClick={() => handleProfileMenuClick('subscription')} className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center space-x-3 group">
                          <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                          <span>Subscription</span>
                        </button>

                        {isAdmin && (
                          <button onClick={() => handleProfileMenuClick('admin')} className="w-full text-left px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center space-x-3 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 dark:border-white/5 mt-1">
                        <button onClick={() => handleProfileMenuClick('logout')} className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 pb-safe-area">
        <div className="grid grid-cols-3 h-16">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => handleNavClick(item.mode)}
              className="flex flex-col items-center justify-center space-y-1 relative group"
            >
              {currentPage === PageView.TOOLS && currentMode === item.mode && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-b-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
              )}
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                currentPage === PageView.TOOLS && currentMode === item.mode 
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 transform -translate-y-1' 
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
              }`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${
                 currentPage === PageView.TOOLS && currentMode === item.mode 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;