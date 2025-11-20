import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import heic2any from 'heic2any';
import { parseExif } from './services/exifService';
import { ImageUploader } from './components/ImageUploader';
import { WatermarkPreview } from './components/WatermarkPreview';
import { Controls } from './components/Controls';
import { ExifData, WatermarkSettings } from './types';
import { Download, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<WatermarkSettings>({
    showExif: true,
    showLogo: true,
    showFilename: false,
    customTitle: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    padding: 40,
    shadow: true,
    aspectRatio: 'original'
  });

  // Load fonts manually
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const response = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@500;700&display=swap');
        if (response.ok) {
          const css = await response.text();
          const style = document.createElement('style');
          style.textContent = css;
          document.head.appendChild(style);
        }
      } catch (e) {
        console.error("Failed to load fonts", e);
      }
    };
    loadFonts();
  }, []);

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    setIsProcessing(true);
    setImageUrl(null);
    
    try {
      try {
        const data = await parseExif(file);
        setExifData(data);
      } catch (e) {
        console.error("Failed to parse EXIF", e);
        setExifData(null);
      }

      let displayUrl = '';
      const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith('.heic');
      
      if (isHeic) {
         try {
            // @ts-ignore
            const conversionResult = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.8
            });
            const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
            displayUrl = URL.createObjectURL(blob);
         } catch (e) {
           console.error("HEIC conversion failed", e);
           alert("Could not process HEIC image. Please try converting it to JPEG first.");
           setIsProcessing(false);
           return;
         }
      } else {
        displayUrl = URL.createObjectURL(file);
      }
      
      setImageUrl(displayUrl);

    } catch (error) {
      console.error("Error processing image", error);
      alert("An error occurred while processing the image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = useCallback(async () => {
    if (previewRef.current === null) return;

    try {
      const dataUrl = await toPng(previewRef.current, { 
        cacheBust: false, 
        pixelRatio: 2, 
        quality: 1.0,
        skipAutoScale: true,
      });
      const link = document.createElement('a');
      link.download = `lumina-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to generate image: ${errorMessage}`);
    }
  }, [previewRef]);

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageFile(null);
    setExifData(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans text-[#1d1d1f]">
      {/* Apple-style Translucent Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-black/5 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
             <div className="w-4 h-4 rounded-full bg-black"></div>
             <h1 className="font-semibold text-lg tracking-tight">Lumina</h1>
          </div>
          {imageUrl && (
            <button 
              onClick={handleDownload}
              className="bg-[#0071e3] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#0077ED] transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-7xl">
        
        {!imageUrl && !isProcessing ? (
           <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
             <div className="text-center max-w-2xl mb-12 px-4 space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 shadow-sm mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span className="text-xs font-medium text-neutral-500 tracking-wide uppercase">Lumina Studio</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-[#1d1d1f] leading-[1.1]">
                 Showcase the <span className="text-[#86868b]">craft.</span>
               </h2>
               <p className="text-lg md:text-xl text-[#86868b] max-w-lg mx-auto leading-relaxed">
                 Elevate your images with gallery-quality frames and precise metadata. The perfect finishing touch for your photography.
               </p>
             </div>
             <ImageUploader onImageUpload={handleImageUpload} />
           </div>
        ) : isProcessing ? (
           <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
             <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#1d1d1f] border-t-transparent mb-6"></div>
             <p className="text-[#86868b] font-medium tracking-wide animate-pulse">Developing...</p>
           </div>
        ) : (
          <>
            {/* Left: Preview Area */}
            <div className="flex-1 flex flex-col items-center justify-start min-h-0 overflow-visible">
               <div className="w-full flex justify-between items-center mb-4 md:hidden">
                  <h2 className="font-semibold text-sm text-[#86868b] flex items-center gap-2">
                    Preview
                  </h2>
                  <button onClick={handleReset} className="text-xs text-[#0071e3] font-medium flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-black/5">
                    <RefreshCw className="w-3 h-3" /> New Shot
                  </button>
               </div>
               
               <WatermarkPreview 
                 ref={previewRef}
                 imageUrl={imageUrl!} 
                 exif={exifData} 
                 settings={settings}
               />
               
               <p className="mt-8 text-[#86868b] text-xs font-medium tracking-wide text-center opacity-60">
                  High-Fidelity Export · {settings.aspectRatio === 'original' ? 'Original Ratio' : settings.aspectRatio}
               </p>
            </div>

            {/* Right: Sidebar Controls */}
            <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col gap-4">
               <div className="hidden md:flex justify-end mb-2">
                  <button onClick={handleReset} className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] flex items-center gap-1.5 transition-colors group">
                    <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" /> Upload New Photo
                  </button>
               </div>
               <Controls 
                 settings={settings} 
                 setSettings={setSettings} 
               />
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default App;