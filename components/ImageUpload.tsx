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
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]" 
              : "border-slate-300 dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-700"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-dark-surface rounded-full shadow-sm">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Drag and drop or click to browse
              </p>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
              icon={<ImageIcon className="w-4 h-4" />}
            >
              Select File
            </Button>
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
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-dark-border shadow-md animate-fade-in bg-slate-100 dark:bg-black">
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-64 object-contain"
          />
          <div className="absolute top-2 right-2">
            <button 
              onClick={onClear}
              className="p-1 bg-black/50 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
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
