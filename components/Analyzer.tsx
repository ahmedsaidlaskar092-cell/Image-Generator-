import React, { useState } from 'react';
import { LoadingState } from '../types';
import { analyzeImage, fileToBase64 } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import Button from './Button';
import { ScanEye, Search, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Analyzer: React.FC = () => {
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
    if (!image) return;

    setLoading({ isLoading: true, message: 'Analyzing visual data...' });
    setError(null);

    try {
      const base64 = await fileToBase64(image);
      const result = await analyzeImage(base64, prompt);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-slide-up">
       <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Visual Analysis</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Deep understanding with <span className="font-semibold text-primary-500">Gemini 3 Pro</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border">
             <ImageUpload 
                currentImage={previewUrl} 
                onImageSelect={handleImageSelect} 
                onClear={handleClear}
                label="Upload image to analyze"
              />
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Specific Question (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., What ingredients are in this dish?"
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-3.5">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            <Button 
              fullWidth 
              onClick={handleAnalyze} 
              disabled={!image}
              isLoading={loading.isLoading}
              icon={<ScanEye className="w-5 h-5" />}
              className="h-12"
            >
              {loading.isLoading ? loading.message : 'Analyze Image'}
            </Button>
          </div>
        </div>

        {/* Output Column */}
        <div className="bg-slate-50 dark:bg-dark-surface/50 rounded-2xl border border-slate-200 dark:border-dark-border p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200 dark:border-dark-border">
            <Bot className="w-6 h-6 text-primary-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">AI Insights</h3>
          </div>

          {loading.isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-slate-500 animate-pulse">Processing image data...</p>
            </div>
          ) : analysis ? (
            <div className="prose prose-slate dark:prose-invert max-w-none overflow-y-auto custom-scrollbar flex-1">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          ) : error ? (
             <div className="flex-1 flex flex-col items-center justify-center text-red-500 text-center">
               <p>{error}</p>
             </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-2 opacity-60">
              <ScanEye className="w-12 h-12 mx-auto mb-2" />
              <p>Upload an image to see details here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
