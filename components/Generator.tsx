import React, { useState } from 'react';
import { AspectRatio, LoadingState, Toast } from '../types';
import { generateImage } from '../services/geminiService';
import Button from './Button';
import { Download, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, message: '' });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading({ isLoading: true, message: 'Dreaming up your image...' });
    setError(null);
    
    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setResultImage(base64Image);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (3:4)' },
    { value: AspectRatio.LANDSCAPE_4_3, label: 'Landscape (4:3)' },
    { value: AspectRatio.MOBILE_PORTRAIT, label: 'Mobile (9:16)' },
    { value: AspectRatio.WIDESCREEN, label: 'Wide (16:9)' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-slide-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Generate Images</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Powered by <span className="font-semibold text-primary-500">Imagen 4</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border">
          
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars, cyberpunk style, neon lights..."
              className="w-full h-32 p-3 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
            />
          </div>

          {/* Aspect Ratio Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ratios.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setAspectRatio(r.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    aspectRatio === r.value
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 font-medium ring-1 ring-primary-500'
                      : 'bg-white dark:bg-dark-bg border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            fullWidth 
            onClick={handleGenerate} 
            isLoading={loading.isLoading}
            disabled={!prompt.trim()}
            icon={<Sparkles className="w-5 h-5" />}
            className="h-12 text-lg shadow-xl shadow-primary-500/20"
          >
            {loading.isLoading ? loading.message : 'Generate Image'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-7 min-h-[400px] bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-dark-border flex items-center justify-center relative overflow-hidden group">
          {loading.isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm z-10">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-primary-600 font-medium animate-pulse">{loading.message}</p>
            </div>
          )}
          
          {resultImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img 
                src={resultImage} 
                alt={prompt} 
                className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={resultImage} 
                  download={`lumina-generated-${Date.now()}.jpg`}
                  className="inline-flex items-center justify-center w-12 h-12 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 transition-transform hover:scale-110"
                >
                  <Download className="w-6 h-6" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-slate-200 dark:bg-dark-surface rounded-full mx-auto flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Your creation will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
