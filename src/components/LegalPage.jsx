import React, { useEffect } from 'react';
import { termsData, privacyData, childSafetyData } from '../data/legalText';

export default function LegalPage({ currentType, onClose, onSwitchType }) {
  const isPrivacy = currentType === 'privacy';
  const isChildSafety = currentType === 'child-safety';
  const data = isPrivacy ? privacyData : isChildSafety ? childSafetyData : termsData;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentType]);

  return (
    <div className="min-h-screen bg-[#fafcfa] text-[#18322c] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#bfd8c8]/30">
        <div className="max-w-[840px] mx-auto px-5 h-16 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 text-[15px] font-bold text-[#18322c] hover:text-[#3ecf8e] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
            우리동네 홈으로
          </button>

          {/* Quick tab switch */}
          <div className="flex items-center gap-2 bg-[#f2f8f4] p-1 rounded-xl">
            <button
              onClick={() => onSwitchType('privacy')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                isPrivacy 
                  ? 'bg-white text-[#3e7acf] shadow-xs' 
                  : 'text-[#60736c] hover:text-[#18322c]'
              }`}
            >
              개인정보처리방침
            </button>
            <button
              onClick={() => onSwitchType('terms')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                currentType === 'terms' 
                  ? 'bg-white text-[#3e7acf] shadow-xs' 
                  : 'text-[#60736c] hover:text-[#18322c]'
              }`}
            >
              이용약관
            </button>
            <button
              onClick={() => onSwitchType('child-safety')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                isChildSafety 
                  ? 'bg-white text-[#3e7acf] shadow-xs' 
                  : 'text-[#60736c] hover:text-[#18322c]'
              }`}
            >
              아동 안전
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[840px] w-full mx-auto px-5 py-10 md:py-16 flex-1">
        <div className="bg-white border border-[#dcece2] rounded-[24px] p-6 sm:p-10 md:p-12 shadow-xs">
          {/* Title & Effective Date */}
          <div className="border-b border-[#dcece2] pb-6 mb-8">
            <div className="inline-block bg-[#e8f8ef] text-[#3e7acf] px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              우리동네 공식 정책
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18322c] tracking-tight mb-3">
              {data.heading}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#60736c]">
              시행일자: {data.effectiveDate}
            </p>
            {data.subtitle && (
              <p className="text-sm sm:text-[15px] text-[#60736c] leading-relaxed mt-4 bg-[#fafcfa] p-4 rounded-xl border border-[#dcece2]/50">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Sections List */}
          <div className="space-y-8">
            {data.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#18322c]">
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.content.map((p, pIdx) => (
                    <p 
                      key={pIdx} 
                      className="text-xs sm:text-sm text-[#4b5563] leading-[1.75] break-keep font-normal"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Back Button */}
          <div className="mt-12 pt-8 border-t border-[#dcece2] flex justify-center">
            <button
              onClick={onClose}
              className="bg-[#3e7acf] text-white font-bold text-sm sm:text-base px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              확인 및 메인으로 이동
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#18322c] py-8 text-center text-xs text-[#D8E8DF]">
        <div className="max-w-[840px] mx-auto px-5">
          <p>© 우리동네 - 콘텐츠비. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
