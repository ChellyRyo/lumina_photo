import React from 'react';
import { WatermarkSettings } from '../types';
import { Type, Layout, Aperture, Palette } from 'lucide-react';

interface ControlsProps {
  settings: WatermarkSettings;
  setSettings: React.Dispatch<React.SetStateAction<WatermarkSettings>>;
  dominantColor: string;
}

// Helper to determine text color (black/white) based on background brightness
const getContrastColor = (rgbString: string): string => {
  // Extract RGB values
  const rgb = rgbString.match(/\d+/g);
  if (!rgb || rgb.length < 3) return '#000000'; // Default to black
  
  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);
  
  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If brightness is high (light color), return black text. Else white.
  return brightness > 128 ? '#000000' : '#ffffff';
};

export const Controls: React.FC<ControlsProps> = ({ 
  settings, 
  setSettings, 
  dominantColor,
}) => {
  
  const update = (key: keyof WatermarkSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBackgroundChange = (mode: string) => {
    if (mode === 'atmosphere') {
        const newTextColor = getContrastColor(dominantColor);
        setSettings(prev => ({
            ...prev,
            backgroundColor: 'atmosphere',
            textColor: newTextColor
        }));
    } else {
        // Studio White
        setSettings(prev => ({
            ...prev,
            backgroundColor: '#ffffff',
            textColor: '#000000'
        }));
    }
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-2">
       <Icon className="w-4 h-4 text-[#86868b]" />
       <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">{title}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-1 p-1 bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl shadow-black/5 h-full overflow-y-auto">
      
      <div className="p-5 bg-white rounded-[20px] shadow-sm border border-black/5 space-y-6">
        
        {/* Appearance */}
        <div>
           <SectionHeader icon={Palette} title="Appearance" />
           <div className="grid grid-cols-2 gap-3">
             {/* Studio White */}
             <div 
                className={`
                    p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 border
                    ${settings.backgroundColor === '#ffffff' 
                        ? 'bg-[#F5F5F7] border-[#0071e3] ring-1 ring-[#0071e3]' 
                        : 'bg-white border-gray-100 hover:bg-[#F5F5F7]'}
                `} 
                onClick={() => handleBackgroundChange('#ffffff')}
             >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-50 rounded-full border border-gray-100"></div>
                </div>
                <div className="text-center">
                    <span className="block text-xs font-semibold text-[#1d1d1f]">Studio</span>
                    <span className="text-[10px] text-gray-500">Clean White</span>
                </div>
             </div>

             {/* Atmosphere (Blurred Background) */}
             <div 
                className={`
                    p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 border
                    ${settings.backgroundColor === 'atmosphere' 
                        ? 'bg-[#F5F5F7] border-[#0071e3] ring-1 ring-[#0071e3]' 
                        : 'bg-white border-gray-100 hover:bg-[#F5F5F7]'}
                `} 
                onClick={() => handleBackgroundChange('atmosphere')}
             >
                <div 
                    className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center border border-black/5 overflow-hidden relative" 
                >
                    {/* Preview the atmosphere effect in the icon */}
                    <div 
                        className="absolute inset-0 scale-150 blur-sm saturate-150 opacity-80"
                        style={{ backgroundColor: dominantColor }}
                    ></div>
                    <div className="relative w-2 h-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm"></div>
                </div>
                <div className="text-center">
                    <span className="block text-xs font-semibold text-[#1d1d1f]">Atmosphere</span>
                    <span className="text-[10px] text-gray-500">Auto Gradient</span>
                </div>
             </div>
           </div>
        </div>

        {/* Layout */}
        <div>
          <SectionHeader icon={Layout} title="Layout" />
          
          {/* Layout Style Selector */}
          <div className="flex p-1 bg-[#F5F5F7] rounded-lg mb-4">
            <button
              onClick={() => update('layoutStyle', 'card')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                settings.layoutStyle === 'card' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Card
            </button>
            <button
              onClick={() => update('layoutStyle', 'classic')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                settings.layoutStyle === 'classic' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => update('layoutStyle', 'clean')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                settings.layoutStyle === 'clean' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Clean
            </button>
          </div>

          <div className="bg-[#F5F5F7] rounded-xl p-3">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-medium text-[#1d1d1f]">Padding</span>
               <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">{settings.padding}px</span>
             </div>
             <input 
                type="range" 
                min="0" 
                max="120" 
                value={settings.padding}
                onChange={(e) => update('padding', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#d2d2d7] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
             />
          </div>
        </div>

        {/* Data Toggles */}
        <div>
          <SectionHeader icon={Aperture} title="Metadata" />
          <div className="space-y-1">
             {[
                { key: 'showExif', label: 'Camera Info' },
                { key: 'showLogo', label: 'Brand Logo' }
             ].map((item) => (
               <label key={item.key} className="flex items-center justify-between p-3 hover:bg-[#F5F5F7] rounded-xl cursor-pointer transition-colors">
                  <span className="text-sm font-medium text-[#1d1d1f]">{item.label}</span>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${settings[item.key as keyof WatermarkSettings] ? 'bg-[#34C759]' : 'bg-[#E9E9EA]'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${settings[item.key as keyof WatermarkSettings] ? 'translate-x-5' : ''}`}></div>
                    <input 
                      type="checkbox" 
                      checked={settings[item.key as keyof WatermarkSettings] as boolean}
                      onChange={(e) => update(item.key as keyof WatermarkSettings, e.target.checked)}
                      className="hidden"
                    />
                  </div>
               </label>
             ))}
          </div>
        </div>

        {/* Text */}
        <div>
          <SectionHeader icon={Type} title="Typography" />
          <div className="relative">
             <input 
               type="text" 
               placeholder="Add a custom title..." 
               value={settings.customTitle}
               onChange={(e) => update('customTitle', e.target.value)}
               className="w-full px-4 py-3 bg-[#F5F5F7] border-none rounded-xl text-sm text-[#1d1d1f] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
             />
             <div className="absolute right-3 top-3 text-[#0071e3]">
               <Type className="w-4 h-4 opacity-50" />
             </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between px-1">
             <span className="text-xs font-medium text-[#86868b]">Text Color</span>
             <div className="flex gap-2 p-1 bg-[#F5F5F7] rounded-lg">
                <button 
                  onClick={() => update('textColor', '#000000')}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${settings.textColor === '#000000' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                  <span className="w-3 h-3 bg-black rounded-full"></span>
                </button>
                <button 
                  onClick={() => update('textColor', '#ffffff')}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${settings.textColor === '#ffffff' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                   <span className="w-3 h-3 bg-white border border-gray-300 rounded-full"></span>
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};