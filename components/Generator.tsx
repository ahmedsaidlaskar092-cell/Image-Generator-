import React, { useState } from 'react';
import { AspectRatio, LoadingState } from '../types';
import { generateImage } from '../services/geminiService';
import { storeService } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Download, Sparkles, AlertCircle, Image, Maximize } from 'lucide-react';

const Generator: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, message: '' });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    if (!storeService.deductCoins(user.id, 1)) {
      setError("Insufficient coins! Please upgrade your plan.");
      return;
    }
    refreshUser(); 
    
    setLoading({ isLoading: true, message: 'Dreaming up your image...' });
    setError(null);
    
    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setResultImage(base64Image);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
      storeService.addCoins(user.id, 1);
      refreshUser();
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  const ratios = [
    { value: AspectRatio.SQUARE, label: '1:1', icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
    { value: AspectRatio.PORTRAIT, label: '3:4', icon: <div className="w-3 h-4 border-2 border-current rounded-sm" /> },
    { value: AspectRatio.LANDSCAPE_4_3, label: '4:3', icon: <div className="w-4 h-3 border-2 border-current rounded-sm" /> },
    { value: AspectRatio.MOBILE_PORTRAIT, label: '9:16', icon: <div className="w-2.5 h-4 border-2 border-current rounded-sm" /> },
    { value: AspectRatio.WIDESCREEN, label: '16:9', icon: <div className="w-4 h-2.5 border-2 border-current rounded-sm" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up pb-safe-area">
      <div className="text-center space-y-1 sm:space-y-2 mb-4">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">Generate Image</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
          <span className="hidden sm:inline">Powered by</span> 
          <span className="font-semibold text-primary-600 dark:text-primary-400">Imagen 4</span>
          <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
            1 Coin
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border">
          
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
              <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
              Describe your vision
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk street cat wearing neon sunglasses..."
              className="w-full h-32 sm:h-40 p-4 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none transition-all placeholder-slate-400"
            />
          </div>

          {/* Aspect Ratio Selection */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
              <Maximize className="w-4 h-4 mr-2 text-primary-500" />
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ratios.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setAspectRatio(r.value)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all active:scale-95 ${
                    aspectRatio === r.value
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-500'
                      : 'bg-white dark:bg-dark-bg border-slate-200 dark:border-dark-border text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="mb-1.5">{r.icon}</div>
                  <span className="text-[10px] font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            fullWidth 
            onClick={handleGenerate} 
            isLoading={loading.isLoading}
            disabled={!prompt.trim() || (user?.coins || 0) < 1}
            icon={<Sparkles className="w-5 h-5" />}
            className="h-12 sm:h-14 text-lg shadow-xl shadow-primary-500/20 mt-2"
          >
            {loading.isLoading ? loading.message : 'Generate Image'}
          </Button>

          {(user?.coins || 0) < 1 && (
             <p className="text-xs font-medium text-red-500 text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">Insufficient coins to generate.</p>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-7 min-h-[350px] sm:min-h-[500px] bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-dark-border flex items-center justify-center relative overflow-hidden group">
          {loading.isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm z-10">
              <div className="w-20 h-20 relative">
                 <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-primary-600 dark:text-primary-400 font-display font-bold mt-4 animate-pulse text-lg">{loading.message}</p>
            </div>
          )}
          
          {resultImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img 
                src={resultImage} 
                alt={prompt} 
                className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 right-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <a 
                  href={resultImage} 
                  download={`lumina-generated-${Date.now()}.jpg`}
                  className="inline-flex items-center justify-center w-14 h-14 bg-white text-primary-600 rounded-full shadow-xl hover:bg-slate-50 transition-transform active:scale-90"
                >
                  <Download className="w-6 h-6" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 max-w-xs">
              <div className="w-24 h-24 bg-white dark:bg-dark-surface rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-white/5 transform rotate-3">
                <Image className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Ready to create</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter a prompt above and watch the magic happen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;