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

    // Helper to format specs
    const specsArray = exif ? [
      exif.focalLength && `${parseInt(exif.focalLength)}mm`,
      exif.fNumber && `${exif.fNumber}`,
      exif.exposureTime && `${exif.exposureTime}s`,
      exif.iso && `ISO${exif.iso}`
    ].filter(Boolean) : [];
    
    const specs = specsArray.join(' · ');

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
        opacity: 0.9
    };

    const isAtmosphere = settings.backgroundColor === 'atmosphere';
    
    // Explicit flags for readability
    const isCard = settings.layoutStyle === 'card';
    const isClassic = settings.layoutStyle === 'classic';
    const isClean = settings.layoutStyle === 'clean';

    return (
      <div className="w-full flex justify-center items-center overflow-hidden bg-[#E5E5EA]/50 rounded-2xl p-4 md:p-10 shadow-inner border border-white/50">
        <div 
          ref={ref}
          style={{ 
            backgroundColor: isAtmosphere ? 'transparent' : settings.backgroundColor, 
            color: settings.textColor,
            padding: `${settings.padding}px`
          }}
          className="relative flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-full max-w-full md:max-w-[1000px] overflow-hidden"
        >
          {/* Atmosphere Background Layer */}
          {isAtmosphere && (
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <img 
                src={imageUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-[160px] scale-125 saturate-[1.4] opacity-80 transform-gpu" 
              />
              <div 
                className="absolute inset-0 bg-white/30" 
              />
            </div>
          )}

          {/* Main Image */}
          <div className="relative z-10 w-full overflow-hidden bg-neutral-100/50 shadow-sm">
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              className="w-full h-auto block object-cover"
            />
          </div>

          {/* ==================== FOOTER SECTIONS ==================== */}
          
          {/* 1. CARD LAYOUT (Polaroid/Gallery: Vertical, Centered) */}
          {isCard && (
            <div className="relative z-10 w-full mt-8 md:mt-12 flex flex-col items-center text-center gap-6">
              
              {/* Logo (Centered) */}
              {(logoDataUrl || logoUrl) && settings.showLogo && (
                 <div className="h-8 md:h-10 flex items-center justify-center">
                   <img 
                     src={logoDataUrl || logoUrl || ''} 
                     alt={brand}
                     className="h-full w-auto object-contain max-w-[150px]"
                     style={logoStyle}
                   />
                 </div>
              )}
              {(!logoUrl && !logoDataUrl) && settings.showLogo && (
                 <div className="text-lg font-bold tracking-[0.3em] opacity-40 uppercase font-sans">LUMINA</div>
              )}

              {/* Info (Centered) */}
              {settings.showExif && (
                <div className="flex flex-col items-center gap-2">
                   {settings.customTitle && (
                      <h2 className="text-xl md:text-2xl font-serif mb-1 opacity-90">{settings.customTitle}</h2>
                   )}
                   <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80 font-sans">
                      {cameraName}
                   </p>
                   <div className="flex items-center gap-3 text-[9px] md:text-[10px] opacity-50 font-medium tracking-widest font-sans">
                      <span>{specs}</span>
                      {exif?.dateTimeOriginal && (
                        <>
                           <span>|</span>
                           <span>{exif.dateTimeOriginal}</span>
                        </>
                      )}
                   </div>
                </div>
              )}
            </div>
          )}

          {/* 2. CLASSIC LAYOUT (Standard: Split, Info Left, Logo Right) */}
          {isClassic && (
            <div className="relative z-10 w-full mt-6 md:mt-8 flex flex-row justify-between items-end gap-8 px-2">
               
               {/* Left: Rich Info Stack */}
               <div className="flex flex-col gap-1 text-left">
                  {settings.customTitle && (
                    <h2 className="text-2xl md:text-3xl font-serif leading-none mb-2 opacity-95">{settings.customTitle}</h2>
                  )}
                  {settings.showExif && (
                    <>
                      <div className="flex items-baseline gap-3">
                        <p className="text-sm md:text-base font-bold text-current opacity-90 tracking-tight font-sans uppercase">
                          {cameraName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs text-current/60 font-medium tracking-wide mt-1">
                        <span className="font-sans font-semibold">{specs}</span>
                        {exif?.dateTimeOriginal && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="opacity-80 font-serif italic">{exif.dateTimeOriginal}</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
               </div>

               {/* Right: Logo */}
               {settings.showLogo && (
                 <div className="shrink-0 pl-6 border-l border-current/10 py-1">
                   {(logoDataUrl || logoUrl) ? (
                     <img 
                       src={logoDataUrl || logoUrl || ''} 
                       alt={brand}
                       className="h-6 md:h-8 w-auto object-contain max-w-[120px]"
                       style={logoStyle}
                     />
                   ) : (
                     <div className="text-sm font-bold tracking-[0.2em] opacity-40 uppercase">LUMINA</div>
                   )}
                 </div>
               )}
            </div>
          )}

          {/* 3. CLEAN LAYOUT (Minimal: Single Line Row, Separator) */}
          {isClean && (
            <div className="relative z-10 w-full mt-5 pt-5 border-t border-current/10 flex flex-row justify-between items-center gap-6 px-1">
               
               {/* Left: Minimal Info */}
               <div className="flex items-center gap-3 text-xs md:text-sm font-medium tracking-wide opacity-70">
                  {settings.customTitle && (
                     <span className="font-semibold opacity-100 mr-2 font-serif">{settings.customTitle}</span>
                  )}
                  {settings.showExif && (
                    <>
                      <span className="uppercase font-bold tracking-wider text-[10px]">{cameraName}</span>
                      <span className="opacity-30 text-[10px]">|</span>
                      <span className="text-[10px] uppercase tracking-wider">{specs}</span>
                    </>
                  )}
               </div>

               {/* Right: Small Logo */}
               {settings.showLogo && (
                 <div className="shrink-0">
                   {(logoDataUrl || logoUrl) ? (
                     <img 
                       src={logoDataUrl || logoUrl || ''} 
                       alt={brand}
                       className="h-4 md:h-5 w-auto object-contain opacity-80"
                       style={logoStyle}
                     />
                   ) : (
                     <div className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">LUMINA</div>
                   )}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    );
  }
);

WatermarkPreview.displayName = 'WatermarkPreview';