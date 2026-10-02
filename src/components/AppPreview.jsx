import React, { useState } from 'react';
import PhoneMockup from './PhoneMockup';

export default function AppPreview() {
  // Right card screen tab: 'post' | 'edit'
  const [rightScreen, setRightScreen] = useState('post');
  // View mode: 'real' (user screenshots) | 'original' (framer mockups)
  const [viewMode, setViewMode] = useState('real');

  return (
    <section className="w-full max-w-[1200px] mx-auto px-5 sm:px-9 md:px-12 py-16 md:py-24 bg-white flex flex-col items-center text-center">
      {/* Title & App Icon Container */}
      <div className="flex flex-col items-center gap-4 max-w-[760px] mb-8">
        {/* App Icon */}
        <div className="w-[64px] h-[64px] md:w-[125px] md:h-[187px] rounded-[20px] md:rounded-[43px] overflow-hidden relative shadow-sm border border-[#e8f8ef] flex-none">
          <img 
            src="/assets/app-icon.png" 
            alt="우리동네 앱 아이콘" 
            className="w-full h-full object-cover object-top block" 
            loading="lazy"
          />
        </div>

        {/* Heading */}
        <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-bold text-[#18322c] tracking-[-0.8px] leading-[1.3] mt-2">
          우리동네, 매일 열어보는 가까운 소식
        </h2>

        {/* Description */}
        <p className="text-[15px] sm:text-[16px] md:text-[17px] font-medium text-[#60736c] leading-[1.6] max-w-[620px] break-keep">
          복잡한 추천 대신, 지금 내가 사는 곳에서 시작되는 이야기를 직관적인 화면으로 만나보세요.
        </p>

        {/* View Mode Toggle Switcher */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-[#f2f8f4] border border-[#dcece2] rounded-full mt-2">
          <button
            onClick={() => setViewMode('real')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all ${
              viewMode === 'real'
                ? 'bg-white text-[#3e7acf] shadow-xs'
                : 'text-[#60736c] hover:text-[#18322c]'
            }`}
          >
            ✨ 실제 앱 스크린샷 목업
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all ${
              viewMode === 'original'
                ? 'bg-white text-[#3e7acf] shadow-xs'
                : 'text-[#60736c] hover:text-[#18322c]'
            }`}
          >
            원본 프레이머 목업
          </button>
        </div>
      </div>

      {/* Mockups Container */}
      {viewMode === 'real' ? (
        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card 1: Main Feed Front View */}
          <div className="bg-[#f2f8f4] border border-[#dcece2] rounded-[24px] p-6 sm:p-8 flex flex-col items-center justify-between overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            {/* Card Header */}
            <div className="w-full flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                <span className="text-[13px] font-extrabold text-[#18322c]">
                  실시간 동네 피드
                </span>
              </div>
              <span className="text-xs font-semibold text-[#60736c] bg-white px-2.5 py-1 rounded-full border border-[#dcece2]">
                정면 뷰
              </span>
            </div>

            {/* Phone Mockup */}
            <div className="py-2 transition-transform duration-500 group-hover:-translate-y-2">
              <PhoneMockup 
                imageSrc="/assets/screenshot-feed.png" 
                alt="우리동네 실시간 피드 화면"
                rotate={0}
              />
            </div>

            {/* Card Caption */}
            <p className="text-xs sm:text-sm font-medium text-[#60736c] mt-6 text-center">
              가까운 이웃들의 실시간 소식이 시간 순서대로 바로 올라옵니다.
            </p>
          </div>

          {/* Card 2: Post & Edit Interactive View */}
          <div className="bg-[#f2f8f4] border border-[#dcece2] rounded-[24px] p-6 sm:p-8 flex flex-col items-center justify-between overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            {/* Card Header with Tab Switcher */}
            <div className="w-full flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#dcece2]">
                <button
                  onClick={() => setRightScreen('post')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    rightScreen === 'post'
                      ? 'bg-[#3e7acf] text-white shadow-xs'
                      : 'text-[#60736c] hover:text-[#18322c]'
                  }`}
                >
                  소식 작성
                </button>
                <button
                  onClick={() => setRightScreen('edit')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    rightScreen === 'edit'
                      ? 'bg-[#3e7acf] text-white shadow-xs'
                      : 'text-[#60736c] hover:text-[#18322c]'
                  }`}
                >
                  사진 편집
                </button>
              </div>

              <span className="text-xs font-semibold text-[#60736c] bg-white px-2.5 py-1 rounded-full border border-[#dcece2]">
                3D 각도 뷰
              </span>
            </div>

            {/* Phone Mockup with subtle 3D tilt */}
            <div className="py-2 transition-transform duration-500 group-hover:rotate-0">
              <PhoneMockup 
                imageSrc={
                  rightScreen === 'post' 
                    ? '/assets/screenshot-post.png' 
                    : '/assets/screenshot-edit.png'
                } 
                alt={rightScreen === 'post' ? '소식 작성 화면' : '사진 편집 화면'}
                rotate={-2}
              />
            </div>

            {/* Card Caption */}
            <p className="text-xs sm:text-sm font-medium text-[#60736c] mt-6 text-center">
              {rightScreen === 'post' 
                ? '우리 동네 일상과 사진을 감성적인 배경과 함께 손쉽게 공유하세요.'
                : '다양한 필터와 텍스트 도구로 사진을 더욱 생생하게 꾸며보세요.'}
            </p>
          </div>

        </div>
      ) : (
        /* Original Framer Mockups View */
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row items-center justify-center gap-5 md:h-[480px]">
          {/* Front Mockup */}
          <div className="w-full md:flex-1 h-[320px] sm:h-[400px] md:h-full rounded-[24px] overflow-hidden relative shadow-xs bg-[#f2f8f4]">
            <img 
              src="/assets/mockup-front.png" 
              alt="우리동네 앱 정면 목업" 
              className="w-full h-full object-cover object-center block"
              loading="lazy"
            />
          </div>

          {/* Side Mockup */}
          <div className="w-full md:flex-1 h-[320px] sm:h-[400px] md:h-full rounded-[24px] overflow-hidden relative shadow-xs bg-[#f2f8f4]">
            <img 
              src="/assets/mockup-side.png" 
              alt="우리동네 앱 측면 목업" 
              className="w-full h-full object-cover object-center block"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  );
}
