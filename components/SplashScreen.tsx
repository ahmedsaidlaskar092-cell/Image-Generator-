import React from 'react';
import { Sparkles } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-bg overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-primary-600/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-accent-600/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }}></div>
      
      <div className="relative z-10 flex flex-col items-center animate-scale-in">
        <div className="relative mb-6">
           <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
           <div className="relative bg-gradient-to-br from-primary-500 to-accent-600 p-6 rounded-2xl shadow-2xl">
             <Sparkles className="w-12 h-12 text-white animate-spin-slow" />
           </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-white tracking-tight mb-3">
          Lumina
        </h1>
        <p className="text-primary-200/80 font-medium tracking-wide text-sm uppercase letter-spacing-2">
          AI Creative Studio
        </p>

        <div className="mt-12 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;