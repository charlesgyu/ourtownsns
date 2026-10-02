import React from 'react';

export default function Differentiator() {
  return (
    <section 
      id="promise" 
      className="w-full max-w-[1200px] mx-auto px-5 sm:px-9 md:px-12 py-16 md:py-24 flex flex-col items-center text-center gap-6"
    >
      {/* Category / Subtitle */}
      <p className="text-[15px] md:text-[16px] font-extrabold text-[#3e7acf] tracking-tight">
        이웃끼리 왁자지껄
      </p>

      {/* Main Title */}
      <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-bold text-[#18322c] tracking-[-0.8px] leading-[1.3] max-w-[760px] break-keep">
        ‘전세계 인기글’이 아닌, 진짜 우리 동네 이야기
      </h2>

      {/* 2 Highlight Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 w-full mt-2">
        <div className="bg-[#e8f8ef] rounded-[16px] px-[22px] py-[18px] flex items-center justify-center shadow-xs">
          <p className="text-[14px] sm:text-[15px] font-bold text-[#3e7acf] leading-[1.45] text-center">
            팔로우가 없어도, 같은 지역이면 게시글이 올라와요.
          </p>
        </div>

        <div className="bg-[#e8f8ef] rounded-[16px] px-[22px] py-[18px] flex items-center justify-center shadow-xs">
          <p className="text-[14px] sm:text-[15px] font-bold text-[#3e7acf] leading-[1.45] text-center">
            낯선 타인이 아닌 가까운 이웃의 일상
          </p>
        </div>
      </div>
    </section>
  );
}
