import React from 'react';

export default function PhoneMockup({ 
  imageSrc, 
  alt = "우리동네 앱 화면", 
  rotate = 0,
  scale = 1,
  className = "" 
}) {
  return (
    <div 
      className={`relative inline-block select-none transition-all duration-500 ${className}`}
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Side Button - Power (Right) */}
      <div className="absolute -right-[9px] md:-right-[11px] top-[95px] w-[3px] h-[46px] bg-[#2a2c30] rounded-r-[2px] shadow-xs" />

      {/* Side Buttons - Volume (Left) */}
      <div className="absolute -left-[9px] md:-left-[11px] top-[75px] w-[3px] h-[34px] bg-[#2a2c30] rounded-l-[2px] shadow-xs" />
      <div className="absolute -left-[9px] md:-left-[11px] top-[120px] w-[3px] h-[34px] bg-[#2a2c30] rounded-l-[2px] shadow-xs" />

      {/* Outer Phone Frame */}
      <div className="relative rounded-[38px] md:rounded-[44px] p-[5px] md:p-[7px] bg-gradient-to-b from-[#3a3d42] via-[#1c1d1f] to-[#121315] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_-5px_rgba(24,50,44,0.15)] ring-1 ring-white/10">
        
        {/* Inner Bezel Ring */}
        <div className="relative rounded-[33px] md:rounded-[38px] overflow-hidden bg-black border-[1.5px] border-[#0a0a0c]">
          
          {/* Subtle Glare Reflection Overlay */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-50" />

          {/* Actual Screen Content - exact aspect ratio to prevent clipping */}
          <div className="w-[230px] sm:w-[250px] md:w-[265px] aspect-[471/1024] overflow-hidden bg-white relative">
            <img 
              src={imageSrc} 
              alt={alt} 
              className="w-full h-full object-contain block select-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Ground / Bottom Drop Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black/20 blur-xl rounded-full -z-10" />
    </div>
  );
}
