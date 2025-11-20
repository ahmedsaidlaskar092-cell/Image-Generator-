import React from 'react';
import { Coins, X, Sparkles } from 'lucide-react';
import Button from './Button';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-dark-surface rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-scale-in border border-slate-200 dark:border-dark-border overflow-hidden">
        
        {/* Confetti / Rays Background Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative z-10">
            <div className="flex justify-end">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6 flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 blur-xl opacity-50 animate-pulse"></div>
                    <div className="bg-gradient-to-br from-amber-300 to-yellow-600 p-5 rounded-full shadow-lg relative transform hover:scale-110 transition-transform duration-300">
                        <Coins className="w-16 h-16 text-white drop-shadow-md" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-dark-surface rounded-full p-1 shadow-sm border border-slate-100 dark:border-white/10 animate-bounce">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Daily Reward!</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
                You've received <span className="font-bold text-amber-600 dark:text-amber-400">+5 Coins</span> for logging in today. Keep creating!
            </p>

            <Button 
                fullWidth 
                onClick={onClose}
                className="h-12 text-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 border-none shadow-lg shadow-amber-500/30 text-white"
            >
                Awesome!
            </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;