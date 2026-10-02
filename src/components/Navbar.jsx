import React from 'react';

export default function Navbar({ onOpenLegal }) {
  return (
    <header className="sticky top-0 z-40 bg-[#fafcfa]/90 backdrop-blur-md border-b border-[#bfd8c8]/20 transition-all">
      <div className="max-w-[1000px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl md:text-2xl font-bold tracking-tight text-[#18322c] hover:text-[#3ecf8e] transition-colors flex items-center gap-2"
        >
          우리동네
        </a>

        {/* Desktop Policy Links */}
        <nav className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => onOpenLegal('privacy')}
            className="text-sm font-medium text-[#60736c] hover:text-[#3ecf8e] transition-colors"
          >
            개인정보처리방침
          </button>
          <button
            onClick={() => onOpenLegal('terms')}
            className="text-sm font-medium text-[#60736c] hover:text-[#3ecf8e] transition-colors"
          >
            이용약관
          </button>
        </nav>
      </div>
    </header>
  );
}
