import React from 'react';

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="w-full bg-[#18322c]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-12 flex flex-col items-start gap-3 text-left">
        {/* Brand Name */}
        <h2 className="text-[20px] font-extrabold text-white tracking-tight">
          우리동네
        </h2>

        {/* Business Info */}
        <p className="text-[13px] sm:text-[14px] text-[#D8E8DF] leading-[1.8] font-normal break-keep">
          콘텐츠비 | 대표자 : 김철규 | 소재지 : 경기 하남시 미사강변한강로 155, SKV1 CENTER 1019호 | 사업자 등록번호 : 208-49-01320 | 통신판매신고번호 : 제2026-경기하남-1353호 | 문의 : ourtown.support@gmail.com
        </p>

        {/* Policy Links */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={() => onOpenLegal('privacy')}
            className="text-[14px] font-medium text-[#D8E8DF] hover:text-[#3ecf8e] transition-colors"
          >
            개인정보처리방침
          </button>
          <button
            onClick={() => onOpenLegal('terms')}
            className="text-[14px] font-medium text-[#D8E8DF] hover:text-[#3ecf8e] transition-colors"
          >
            이용약관
          </button>
          <button
            onClick={() => onOpenLegal('child-safety')}
            className="text-[14px] font-medium text-[#D8E8DF] hover:text-[#3ecf8e] transition-colors"
          >
            아동 안전 표준
          </button>
        </div>
      </div>
    </footer>
  );
}
