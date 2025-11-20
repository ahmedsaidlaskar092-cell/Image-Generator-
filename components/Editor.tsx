import React, { useState } from 'react';
import { LoadingState } from '../types';
import { editImage, fileToBase64 } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import Button from './Button';
import { Wand2, ArrowRight, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

const Editor: React.FC = () => {
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
    if (!originalImage || !prompt.trim()) return;

    setLoading({ isLoading: true, message: 'Applying magic edits...' });
    setError(null);

    try {
      const base64 = await fileToBase64(originalImage);
      const result = await editImage(base64, prompt);
      setEditedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Please try again.");
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-slide-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Magic Editor</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Transform images with <span className="font-semibold text-primary-500">Gemini 2.5 Flash Image</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Original Image</h3>
            <ImageUpload 
              currentImage={previewUrl} 
              onImageSelect={handleImageSelect} 
              onClear={handleClear}
              label="Upload photo to edit"
            />
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What would you like to change?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Add a retro filter, remove the background..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-2">
                  <Wand2 className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button 
              fullWidth 
              onClick={handleEdit} 
              disabled={!originalImage || !prompt.trim()}
              isLoading={loading.isLoading}
              variant="primary"
              className="h-12"
            >
              {loading.isLoading ? loading.message : 'Apply Changes'}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="relative bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-dark-border min-h-[400px] flex flex-col items-center justify-center p-4">
           {/* Mobile vs Desktop View handling for arrow */}
           <div className="absolute lg:-left-4 lg:top-1/2 lg:-translate-y-1/2 -top-4 left-1/2 -translate-x-1/2 z-10 bg-white dark:bg-dark-surface p-2 rounded-full shadow-lg border border-slate-100 dark:border-dark-border hidden lg:block">
              <ArrowRight className="w-6 h-6 text-slate-400" />
           </div>

           {loading.isLoading && (
             <div className="absolute inset-0 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl">
                <Wand2 className="w-12 h-12 text-primary-500 animate-pulse-slow mb-4" />
                <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
                  Gemini is editing your image...
                </p>
             </div>
           )}

           {editedImage ? (
             <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="relative group w-full flex-1 flex items-center justify-center">
                  <img 
                    src={editedImage} 
                    alt="Edited result" 
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                  />
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={editedImage} 
                      download={`lumina-edited-${Date.now()}.png`}
                      className="inline-flex items-center justify-center w-12 h-12 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 transition-transform hover:scale-110"
                    >
                      <Download className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  Edit Complete
                </div>
             </div>
           ) : (
             <div className="text-center p-8 opacity-50">
               <div className="w-20 h-20 bg-slate-200 dark:bg-dark-surface rounded-full mx-auto flex items-center justify-center mb-4">
                 <Wand2 className="w-10 h-10 text-slate-400" />
               </div>
               <p className="text-slate-500 dark:text-slate-400">
                 Edited image will appear here
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
