import React, { forwardRef, useEffect, useState } from 'react';
import { ExifData, WatermarkSettings, CameraBrand } from '../types';
import { BRAND_LOGOS, DETECT_BRAND } from '../constants';

interface WatermarkPreviewProps {
  imageUrl: string;
  exif: ExifData | null;
  settings: WatermarkSettings;
}

export const WatermarkPreview = forwardRef<HTMLDivElement, WatermarkPreviewProps>(
  ({ imageUrl, exif, settings }, ref) => {
    const brand = exif ? DETECT_BRAND(exif.make, exif.model) : CameraBrand.Unknown;
    const logoUrl = settings.showLogo ? BRAND_LOGOS[brand] : null;
    
    const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

    useEffect(() => {
      if (!logoUrl) {
        setLogoDataUrl(null);
        return;
      }

      let active = true;
      const convertLogo = async () => {
        try {
          if (logoUrl.startsWith('data:')) {
             if (active) setLogoDataUrl(logoUrl);
             return;
          }

          const response = await fetch(logoUrl, { mode: 'cors' });
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            if (active && typeof reader.result === 'string') {
              setLogoDataUrl(reader.result);
            }
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          console.warn('Failed to convert logo to base64', err);
          if (active) setLogoDataUrl(logoUrl);
        }
      };

      convertLogo();
      return () => { active = false; };
    }, [logoUrl]);

    const specs = exif ? [
      exif.focalLength && `${parseInt(exif.focalLength)}mm`,
      exif.fNumber && `${exif.fNumber}`,
      exif.exposureTime && `${exif.exposureTime}s`,
      exif.iso && `ISO${exif.iso}`
    ].filter(Boolean).join(' · ') : '';

    let cameraName = '';
    if (exif) {
      const make = exif.make || '';
      const model = exif.model || '';
      const cleanMake = make.replace(/CORPORATION|CO\.|LTD\.?|INC\.?/gi, '').trim();
      
      if (model.toLowerCase().startsWith(cleanMake.toLowerCase())) {
        cameraName = model;
      } else {
        if (model.toLowerCase().includes(cleanMake.toLowerCase())) {
           cameraName = model;
        } else {
           cameraName = `${cleanMake} ${model}`;
        }
      }
    }

    const logoStyle: React.CSSProperties = {
        filter: settings.textColor === '#ffffff' 
            ? 'grayscale(100%) brightness(0) invert(100%)' 
            : 'grayscale(100%) brightness(0)',
        opacity: 0.85
    };

    return (
      <div className="w-full flex justify-center items-center overflow-hidden bg-[#E5E5EA]/50 rounded-2xl p-6 md:p-10 shadow-inner border border-white/50">
        <div 
          ref={ref}
          style={{ 
            backgroundColor: settings.backgroundColor, 
            color: settings.textColor,
            padding: `${settings.padding}px`,
            boxShadow: settings.shadow ? '0 30px 60px -12px rgba(0, 0, 0, 0.25)' : 'none'
          }}
          className="relative flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] max-w-full md:max-w-[900px]"
        >
          {/* Main Image */}
          <div className="relative w-full overflow-hidden bg-neutral-100/50">
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              className="w-full h-auto block object-cover"
            />
          </div>

          {/* Footer / Info Section */}
          <div className="w-full mt-10 px-1 flex flex-row justify-between items-end gap-6">
            
            {/* Left: Info */}
            <div className="flex flex-col justify-center gap-3 min-w-0 flex-1">
              {settings.customTitle && (
                <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-2 opacity-90 tracking-tight">
                  {settings.customTitle}
                </h2>
              )}
              
              {settings.showExif && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-80 whitespace-nowrap truncate font-sans">
                    {cameraName}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[10px] md:text-xs opacity-50 font-medium tracking-wide">
                    <p className="font-sans uppercase tracking-widest">
                      {specs}
                    </p>
                    {exif?.dateTimeOriginal && (
                      <>
                        <span className="opacity-30">|</span>
                        <p className="font-serif italic tracking-wider opacity-90">
                          {exif.dateTimeOriginal}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Brand Logo */}
            {(logoDataUrl || logoUrl) && (
               <div className="h-8 md:h-10 flex items-center justify-end shrink-0 pl-8 border-l border-current/10">
                 <img 
                   src={logoDataUrl || logoUrl || ''} 
                   alt={brand}
                   crossOrigin="anonymous"
                   className="h-full w-auto object-contain max-w-[80px] md:max-w-[120px]"
                   style={logoStyle}
                 />
               </div>
            )}
            
            {(!logoUrl && !logoDataUrl) && settings.showLogo && brand === CameraBrand.Unknown && (
               <div className="h-8 md:h-10 flex items-center justify-end shrink-0 pl-8 border-l border-current/10 opacity-40 font-sans font-semibold tracking-[0.25em] text-[10px]">
                   LUMINA
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

WatermarkPreview.displayName = 'WatermarkPreview';