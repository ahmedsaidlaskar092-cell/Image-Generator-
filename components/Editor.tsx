import React, { useState } from 'react';
import { LoadingState } from '../types';
import { editImage, fileToBase64 } from '../services/geminiService';
import { storeService } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './ImageUpload';
import Button from './Button';
import { Wand2, ArrowRight, Download, AlertCircle, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

const Editor: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, message: '' });
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setOriginalImage(file);
    setPreviewUrl(preview);
    setEditedImage(null);
    setError(null);
  };

  const handleClear = () => {
    setOriginalImage(null);
    setPreviewUrl(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim() || !user) return;

    if (!storeService.deductCoins(user.id, 1)) {
      setError("Insufficient coins! Please upgrade your plan.");
      return;
    }
    refreshUser();

    setLoading({ isLoading: true, message: 'Applying magic edits...' });
    setError(null);

    try {
      const base64 = await fileToBase64(originalImage);
      const result = await editImage(base64, originalImage.type, prompt);
      setEditedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Please try again.");
      storeService.addCoins(user.id, 1);
      refreshUser();
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up pb-safe-area">
      <div className="text-center space-y-1 mb-4">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">Magic Editor</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Edit with natural language using <span className="font-semibold text-primary-500">Gemini 2.5</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-xs font-bold">1</div>
                 Upload Image
               </h3>
               {previewUrl && (
                 <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                   <RefreshCw className="w-3 h-3" /> Reset
                 </button>
               )}
            </div>
            <ImageUpload 
              currentImage={previewUrl} 
              onImageSelect={handleImageSelect} 
              onClear={handleClear}
              label="Tap to upload image"
            />
          </div>

          {/* Prompt Card */}
          <div className={`bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border transition-all duration-500 ${!originalImage ? 'opacity-50 pointer-events-none blur-[1px]' : ''}`}>
             <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-xs font-bold">2</div>
               Describe Changes
             </h3>
             
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Make it a sunset, add fireworks..."
                  className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                  disabled={!originalImage}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Wand2 className="w-5 h-5 text-primary-500" />
                </div>
              </div>

              {error && (
                <div className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button 
                fullWidth 
                onClick={handleEdit} 
                disabled={!originalImage || !prompt.trim() || (user?.coins || 0) < 1}
                isLoading={loading.isLoading}
                variant="primary"
                className="h-14 text-lg shadow-lg shadow-primary-500/20"
              >
                {loading.isLoading ? loading.message : 'Apply Magic (1 Coin)'}
              </Button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="relative bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-dark-border min-h-[350px] sm:min-h-[500px] flex flex-col items-center justify-center p-2 overflow-hidden group">
           {/* Desktop decorative arrow */}
           <div className="absolute lg:-left-5 lg:top-1/2 lg:-translate-y-1/2 hidden lg:block z-10">
              <div className="bg-white dark:bg-dark-surface p-2 rounded-full shadow-md border border-slate-100 dark:border-dark-border">
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
           </div>

           {loading.isLoading && (
             <div className="absolute inset-0 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl p-6 text-center">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-4 rounded-2xl mb-4 animate-pulse shadow-xl shadow-primary-500/20">
                   <Wand2 className="w-8 h-8 text-white animate-spin-slow" />
                </div>
                <p className="text-slate-800 dark:text-white font-display font-bold text-lg">Processing...</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gemini is repainting pixels</p>
             </div>
           )}

           {editedImage ? (
             <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
                <img 
                  src={editedImage} 
                  alt="Edited result" 
                  className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                />
                <div className="absolute bottom-4 right-4">
                  <a 
                    href={editedImage} 
                    download={`lumina-edited-${Date.now()}.png`}
                    className="inline-flex items-center justify-center w-14 h-14 bg-white text-primary-600 rounded-full shadow-xl hover:bg-slate-50 transition-transform active:scale-90"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                </div>
                <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </div>
             </div>
           ) : (
             <div className="text-center p-8 opacity-60">
               <div className="w-20 h-20 bg-slate-200 dark:bg-dark-surface rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-slate-100 dark:border-white/5">
                 <Sparkles className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-slate-500 dark:text-slate-400 font-medium">
                 Edited result will appear here
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Editor;