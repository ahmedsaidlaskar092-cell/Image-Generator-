import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  currentImage: string | null;
  onClear: () => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage, onClear, label = "Upload an image" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onImageSelect(file, previewUrl);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {!currentImage ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer touch-manipulation ${
            dragActive 
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]" 
              : "border-slate-300 dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-700 bg-slate-50/50 dark:bg-dark-bg/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-white dark:bg-dark-surface rounded-full shadow-sm border border-slate-100 dark:border-white/5">
              <Upload className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tap to browse or drag file
              </p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-dark-border shadow-sm animate-fade-in bg-slate-100 dark:bg-black/50">
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-48 sm:h-64 object-contain"
          />
          <div className="absolute top-2 right-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="p-1.5 bg-black/50 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;