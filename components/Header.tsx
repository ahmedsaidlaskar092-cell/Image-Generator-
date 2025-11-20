import React from 'react';
import { AppMode } from '../types';
import { Sparkles, ImagePlus, ScanEye, Moon, Sun, Palette } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, isDarkMode, toggleTheme }) => {
  const navItems = [
    { mode: AppMode.GENERATE, label: 'Generate', icon: <Sparkles className="w-4 h-4" /> },
    { mode: AppMode.EDIT, label: 'Edit', icon: <Palette className="w-4 h-4" /> },
    { mode: AppMode.ANALYZE, label: 'Analyze', icon: <ScanEye className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-dark-bg/90 border-b border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 p-2 rounded-lg">
              <ImagePlus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
              Lumina
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-dark-surface p-1 rounded-xl">
            {navItems.map((item) => (
              <button
                key={item.mode}
                onClick={() => onModeChange(item.mode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentMode === item.mode
                    ? 'bg-white dark:bg-primary-600 text-primary-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Bottom bar style could be better, but simple tab list below header for now) */}
      <div className="md:hidden border-t border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg">
        <div className="flex justify-around p-2">
          {navItems.map((item) => (
             <button
             key={item.mode}
             onClick={() => onModeChange(item.mode)}
             className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
               currentMode === item.mode
                 ? 'text-primary-600 dark:text-primary-400'
                 : 'text-slate-500 dark:text-slate-400'
             }`}
           >
             <div className={`${currentMode === item.mode ? 'bg-primary-100 dark:bg-primary-900/30' : ''} p-1 rounded-full`}>
               {item.icon}
             </div>
             <span>{item.label}</span>
           </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
