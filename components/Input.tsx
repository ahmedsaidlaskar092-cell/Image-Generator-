import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-white dark:bg-dark-surface text-base text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 shadow-sm ${
            error 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-slate-200 dark:border-dark-border group-hover:border-primary-300 dark:group-hover:border-primary-700'
          } ${Icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 animate-slide-down ml-1">{error}</p>
      )}
    </div>
  );
};

export default Input;