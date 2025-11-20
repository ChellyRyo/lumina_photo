import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full max-w-xl mx-auto group">
      <label 
        htmlFor="file-upload" 
        className="relative flex flex-col items-center justify-center w-full h-72 rounded-3xl cursor-pointer bg-white border border-dashed border-[#d2d2d7] hover:border-[#0071e3] hover:bg-blue-50/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F5F7]/50 pointer-events-none" />
        
        <div className="relative flex flex-col items-center justify-center pt-5 pb-6 z-10">
          <div className="p-5 rounded-full bg-[#F5F5F7] group-hover:scale-110 transition-transform duration-300 mb-6 shadow-inner">
            <ImageIcon className="w-8 h-8 text-[#86868b] group-hover:text-[#0071e3] transition-colors" />
          </div>
          <p className="mb-3 text-lg text-[#1d1d1f] font-semibold tracking-tight">
            Drop your photo here
          </p>
          <p className="text-sm text-[#86868b]">
            JPG, PNG, WEBP, HEIC
          </p>
          
          <div className="mt-6 px-5 py-2 bg-[#1d1d1f] text-white text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            Browse Files
          </div>
        </div>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};