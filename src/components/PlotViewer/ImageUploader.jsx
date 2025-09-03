import React, { useRef, useState } from 'react';
import { Upload, Image, FileImage } from 'lucide-react';

const ImageUploader = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (file.type.startsWith('image/')) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          onImageUpload({
            url: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          });
          setIsProcessing(false);
        }, 1500); // Simulate processing time
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-float">
          <Image className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Upload Your Plot Image
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Upload an image of your land plot with marked segments.<br />
          We'll transform it into an interactive 3D visualization.
        </p>
      </div>

      <div
        className={`relative group transition-all duration-300 ${
          isDragOver 
            ? 'scale-105 glass border-primary-400 border-2' 
            : 'glass border-white/20 hover:border-white/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center cursor-pointer" onClick={triggerFileInput}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {isProcessing ? (
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg text-white">Processing your plot image...</p>
              <p className="text-sm text-gray-400 mt-2">Analyzing segments and boundaries</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:from-primary-500/20 group-hover:to-secondary-500/20 transition-all duration-300">
                <Upload className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <p className="text-lg text-white mb-2">Drop your plot image here</p>
              <p className="text-gray-400 mb-4">or click to browse files</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <FileImage className="w-4 h-4" />
                  <span>PNG, JPG, GIF</span>
                </span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </>
          )}
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-primary-500"></div>
            <span>Residential</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-secondary-500"></div>
            <span>Commercial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span>Agricultural</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>Industrial</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;