import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DressCode() {
  const colors = [
    { name: 'Navy Blue', hex: '#0B192C' },
    { name: 'Burnt Orange', hex: '#D95D16' },
    { name: 'Terracotta', hex: '#E28743' },
    { name: 'Champagne', hex: '#F5E6D3' },
    { name: 'Slate Blue', hex: '#475569' },
  ];

  return (
    <div className="bg-[#FAF9F6]/90 backdrop-blur-sm border border-white/45 rounded-3xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto text-stone-800">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl text-[#0b192c] tracking-wide font-light">
          Dress Code
        </h3>
        <p className="font-cursive text-2xl text-[#d95d16] mt-1">
          Elegant Navy &amp; Burnt Orange
        </p>
        <p className="text-xs text-stone-600 mt-3 max-w-md mx-auto font-sans leading-relaxed">
          We kindly invite our guests to dress in elegant formal attire harmonizing with our wedding color theme.
        </p>
      </div>

      {/* simplified, beautiful color palette layout */}
      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto mb-6">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md border border-stone-300/40 transition-transform duration-300 hover:scale-110"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-[9px] md:text-xs font-sans tracking-wide text-stone-600 text-center font-medium leading-none">
              {color.name}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#ecc19c]/40 pt-4 text-center">
        <p className="text-xs text-stone-700 max-w-md mx-auto font-sans leading-relaxed">
          <strong className="text-[#0b192c]">Attire Suggestion:</strong> Flowing navy or terracotta dresses, neat suits in navy blue or grey accented with burnt orange ties, pocket squares, or beautiful theme accessories are highly recommended.
        </p>
      </div>

      <div className="flex items-center gap-2 justify-center mt-4 text-[10px] text-[#d95d16] font-sans italic font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-[#d95d16]" /> Theme colors are highly encouraged!
      </div>
    </div>
  );
}
