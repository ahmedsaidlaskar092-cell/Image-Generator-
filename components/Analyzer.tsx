import React, { useState } from 'react';
import { LoadingState } from '../types';
import { analyzeImage, fileToBase64 } from '../services/geminiService';
import { storeService } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './ImageUpload';
import Button from './Button';
import { ScanEye, Search, Bot, Sparkles, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Analyzer: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, message: '' });
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setImage(file);
    setPreviewUrl(preview);
    setAnalysis(null);
    setError(null);
  };

  const handleClear = () => {
    setImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setPrompt('');
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image || !user) return;

    if (!storeService.deductCoins(user.id, 1)) {
      setError("Insufficient coins! Please upgrade your plan.");
      return;
    }
    refreshUser();

    setLoading({ isLoading: true, message: 'Analyzing visual data...' });
    setError(null);

    try {
      const base64 = await fileToBase64(image);
      const result = await analyzeImage(base64, image.type, prompt);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
      storeService.addCoins(user.id, 1); 
      refreshUser();
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up pb-safe-area">
       <div className="text-center space-y-1 mb-4">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">Visual Analysis</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Powered by <span className="font-semibold text-primary-500">Gemini 3 Pro</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Column */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                  <ScanEye className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Upload Image</h3>
             </div>
             <ImageUpload 
                currentImage={previewUrl} 
                onImageSelect={handleImageSelect} 
                onClear={handleClear}
                label="Tap to upload"
              />
          </div>

          <div className={`bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border space-y-4 transition-all ${!image ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">
                Ask a question (Optional)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., What ingredients are in this dish?"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>

            <Button 
              fullWidth 
              onClick={handleAnalyze} 
              disabled={!image || (user?.coins || 0) < 1}
              isLoading={loading.isLoading}
              icon={<Sparkles className="w-5 h-5" />}
              className="h-14 text-lg shadow-lg shadow-primary-500/20"
            >
              {loading.isLoading ? loading.message : 'Analyze (1 Coin)'}
            </Button>
          </div>
        </div>

        {/* Output Column */}
        <div className="bg-slate-50 dark:bg-dark-surface/50 rounded-3xl border border-slate-200 dark:border-dark-border p-5 sm:p-6 min-h-[400px] flex flex-col shadow-inner">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-dark-border">
            <div className="p-2 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
               <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
               <h3 className="font-bold text-slate-800 dark:text-white">AI Insights</h3>
               <p className="text-xs text-slate-500">Detailed breakdown of your image</p>
            </div>
          </div>

          {loading.isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
               <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
               <p className="text-sm font-medium text-slate-500 animate-pulse">Reading visual data...</p>
            </div>
          ) : analysis ? (
            <div className="prose prose-slate dark:prose-invert max-w-none overflow-y-auto custom-scrollbar flex-1 text-sm leading-relaxed p-2">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          ) : error ? (
             <div className="flex-1 flex flex-col items-center justify-center text-red-500 text-center p-6">
               <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-3">
                 <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
               </div>
               <p className="font-medium">{error}</p>
             </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-3 opacity-60 p-6">
              <ScanEye className="w-16 h-16 stroke-1" />
              <p className="text-sm max-w-[200px]">Upload an image and tap Analyze to reveal hidden details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;