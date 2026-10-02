import React from 'react';
import PhoneMockup from './PhoneMockup';

const screens = [
  {
    id: 'feed',
    title: '실시간 동네 피드',
    tag: '홈 피드',
    imageSrc: '/assets/screenshot-feed.png',
    alt: '우리동네 실시간 피드 화면',
    caption: '가까운 이웃들의 실시간 소식이 시간 순서대로 바로 올라옵니다.',
  },
  {
    id: 'follow',
    title: '이웃 팔로우',
    tag: '팔로우 피드',
    imageSrc: '/assets/screenshot-follow.png',
    alt: '우리동네 팔로우 화면',
    caption: '관심 있는 이웃과 동네 단골 가게의 최신 소식을 모아보세요.',
  },
  {
    id: 'search',
    title: '소식 & 이웃 검색',
    tag: '검색',
    imageSrc: '/assets/screenshot-search.png',
    alt: '우리동네 검색 화면',
    caption: '원하는 키워드나 이웃을 검색해 동네 소식을 빠르게 찾아보세요.',
  },
  {
    id: 'dm',
    title: '1:1 실시간 DM',
    tag: '메시지',
    imageSrc: '/assets/screenshot-dm.png',
    alt: '우리동네 1:1 DM 화면',
    caption: '궁금한 소식이나 소소한 일상을 이웃과 1:1로 자유롭게 나눠보세요.',
  },
  {
    id: 'notification',
    title: '실시간 알림',
    tag: '알림',
    imageSrc: '/assets/screenshot-notification.png',
    alt: '우리동네 알림 화면',
    caption: '댓글, 공감, 태그 등 이웃들의 반응을 놓치지 않고 실시간으로 확인하세요.',
  },
  {
    id: 'edit',
    title: '사진 편집',
    tag: '필터 & 텍스트',
    imageSrc: '/assets/screenshot-post.png',
    alt: '우리동네 사진 편집 화면',
    caption: '다양한 필터와 텍스트 도구로 우리 동네의 순간을 감각적으로 꾸며보세요.',
  },
];

export default function AppPreview() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-24 bg-white flex flex-col items-center text-center">
      {/* Title & App Icon Container */}
      <div className="flex flex-col items-center gap-4 max-w-[760px] mb-12">
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

        {/* Real App Screenshot Badge (without '목업') */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f8f4] border border-[#dcece2] text-xs sm:text-[13px] font-bold text-[#18322c] mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e] animate-pulse" />
          ✨ 실제 앱 스크린샷
        </div>
      </div>

      {/* 6 Screens Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {screens.map((screen) => (
          <div 
            key={screen.id}
            className="bg-[#f2f8f4] border border-[#dcece2] rounded-[24px] p-6 sm:p-7 flex flex-col items-center justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group"
          >
            {/* Card Header */}
            <div className="w-full flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                <span className="text-[14px] font-extrabold text-[#18322c]">
                  {screen.title}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#60736c] bg-white px-2.5 py-1 rounded-full border border-[#dcece2]">
                {screen.tag}
              </span>
            </div>

            {/* Phone Mockup */}
            <div className="py-2 transition-transform duration-500 group-hover:-translate-y-2">
              <PhoneMockup 
                imageSrc={screen.imageSrc} 
                alt={screen.alt}
                rotate={0}
              />
            </div>

            {/* Card Caption */}
            <p className="text-xs sm:text-[13px] font-medium text-[#60736c] mt-6 text-center leading-[1.6] break-keep">
              {screen.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
