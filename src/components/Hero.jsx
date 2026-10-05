import React from 'react';

export default function Hero() {
  return (
    <section 
      id="intro" 
      className="w-full max-w-[1200px] mx-auto px-5 sm:px-9 md:px-12 pt-16 md:pt-24 pb-16 md:pb-24 flex flex-col items-center text-center hero-gradient"
    >
      {/* Badge: 동네 기반 SNS · 우리동네 */}
      <div className="inline-flex items-center justify-center bg-white border border-[#cde9d8] rounded-full px-4 py-2 mb-7 shadow-xs">
        <span className="text-[14px] font-bold text-[#3e7acf] leading-none">
          동네 기반 SNS · 우리동네
        </span>
      </div>

      {/* Main Heading: 우리 동네 사람들과, 우리 동네 이야기 */}
      <h1 className="text-[32px] sm:text-[40px] md:text-[44px] font-black text-[#18322c] tracking-[-1.2px] leading-[1.28] max-w-[760px] mb-6">
        우리 동네 사람들과, 우리 동네 이야기
      </h1>

      {/* Main Description */}
      <p className="text-[16px] md:text-[18px] font-medium text-[#60736c] leading-[1.65] max-w-[620px] mb-10 break-keep">
        팔로워 수도 추천 알고리즘도 아니에요. 오직 ‘어디 사는지’를 기준으로 나와 가까운 이웃들의 생생한 소식만 모아 보여주는 동네 피드예요.
      </p>

      {/* Store Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        {/* App Store */}
        <div className="w-full sm:w-auto min-w-[190px] bg-[#3e7acf] text-white rounded-[12px] px-5 py-[13px] font-bold text-[15px] flex items-center justify-center cursor-default select-none shadow-sm hover:opacity-95 transition-opacity">
          App Store 출시 예정
        </div>

        {/* Google Play */}
        <div className="w-full sm:w-auto min-w-[190px] bg-[#edecdd] border border-[#bfd8c8] text-[#3e7acf] rounded-[12px] px-5 py-[13px] font-bold text-[15px] flex items-center justify-center cursor-default select-none hover:bg-[#e6e5d5] transition-colors">
          Google Play 출시 예정
        </div>
      </div>
    </section>
  );
}
