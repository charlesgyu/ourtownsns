import React from 'react';

const featuresData = [
  {
    num: "01",
    title: "동네 우선 게시글",
    description: "나와 같은 동네 사람들의 글이 먼저 올라오는 동네 SNS입니다. 최신순과 인기글 정렬을 기본으로, 같은 동네 이웃의 실시간 소식을 가장 빠르게 접할 수 있습니다."
  },
  {
    num: "02",
    title: "통합검색",
    description: "게시글은 물론 사람까지 한 번에 검색합니다. 우리 동네와 가까운 소식이 먼저 올라와 원하는 로컬 정보를 쉽게 찾을 수 있죠!"
  },
  {
    num: "03",
    title: "팔로우 · DM · 수납함",
    description: "이웃을 팔로우하고 1:1 메시지를 보낼 수 있습니다. 간직하고 싶은 마음에 드는 게시글은 나만의 수납함에 저장할 수 있습니다."
  },
  {
    num: "04",
    title: "신고 및 차단 기능",
    description: "유해한 게시글은 신고하여 즉각 처리할 수 있습니다. 불량한 이웃은 깔끔하게 차단하여 언제나 쾌적하고 안전한 동네 소식만 들어보세요."
  },
  {
    num: "05",
    title: "실시간 알림",
    description: "내 글과 활동에 대한 이웃들의 관심과 반응을 실시간으로 놓치지 않고 바로 알려드립니다."
  },
  {
    num: "06",
    title: "홍보",
    badge: "(준비중)",
    description: "나의 서비스나 가게 소식, 전하고 싶은 좋은 이야기를 동네 이웃들에게 조건에 맞추어 직접 홍보해보세요."
  }
];

export default function Features() {
  return (
    <section 
      id="features" 
      className="w-full max-w-[1200px] mx-auto px-5 sm:px-9 md:px-12 py-16 md:py-24 bg-[#f2f8f4] flex flex-col items-center"
    >
      {/* Header Container */}
      <div className="flex flex-col items-center text-center gap-2 mb-10 md:mb-12">
        <p className="text-[15px] md:text-[16px] font-extrabold text-[#3e7acf] tracking-tight">
          우리동네의 핵심 기능
        </p>
        <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-bold text-[#18322c] tracking-[-0.8px] leading-[1.3]">
          이웃의 오늘을 더 가깝게
        </h2>
      </div>

      {/* 6 Cards Grid */}
      <div className="w-full max-w-[1000px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {featuresData.map((item) => (
          <div 
            key={item.num}
            className="bg-white border border-[#dcece2] rounded-[20px] p-6 flex flex-col items-start gap-3.5 shadow-xs hover:border-[#bfd8c8] hover:shadow-sm transition-all"
          >
            {/* Number: 01, 02... */}
            <span className="text-[14px] font-extrabold text-[#3e7acf] leading-none">
              {item.num}
            </span>

            {/* Title */}
            <h3 className="text-[#3e7acf] font-extrabold text-[21px] leading-[1.35] tracking-tight flex items-baseline">
              <span>{item.title}</span>
              {item.badge && (
                <span className="text-[12px] font-extrabold text-[#3e7acf] ml-1.5">
                  {item.badge}
                </span>
              )}
            </h3>

            {/* Description */}
            <p className="text-[15px] font-medium text-[#60736c] leading-[1.6] break-keep">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
