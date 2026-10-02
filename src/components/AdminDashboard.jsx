import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Megaphone, 
  BarChart3, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  MapPin, 
  Calendar, 
  Eye, 
  RefreshCw,
  Search,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// 초기 Mock 데이터 (서버 미연결 시 시뮬레이션용)
const initialReportedPosts = [
  {
    id: "rep-101",
    postId: "p-801",
    authorId: "u-301",
    authorNickname: "성수동불주먹",
    content: "불법 도박 사이트 가입 시 5만 포인트 즉시 지급! 지금 프로필 링크 확인하세요.",
    imageUrls: [],
    reportsCount: 4,
    primaryReason: "불법/사기 홍보",
    region: "서울특별시 성동구 성수동",
    createdAt: "2026-10-01 18:20",
    status: "pending"
  },
  {
    id: "rep-102",
    postId: "p-802",
    authorId: "u-302",
    authorNickname: "익명의이웃",
    content: "00아파트 102동 주민 진짜 매너 없네요. 지나가다 마주치면 가만 안 둡니다.",
    imageUrls: [],
    reportsCount: 3,
    primaryReason: "욕설/비방/협박",
    region: "서울특별시 성동구 옥수동",
    createdAt: "2026-10-01 17:05",
    status: "pending"
  }
];

const initialPromotedPosts = [
  {
    id: "promo-201",
    postId: "p-901",
    authorId: "u-401",
    authorNickname: "카페성수 베이커리",
    content: "🥐 성수동 주민 여러분! 10월 한 달간 매일 아침 갓 구운 크루아상 1+1 이벤트를 진행합니다. 동네 이웃분들의 많은 방문 부탁드려요!",
    imageUrls: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80"],
    targetRegions: ["성동구 성수1가1동", "성동구 성수1가2동"],
    targetAge: "20대 ~ 40대",
    targetGender: "전체",
    budgetWon: 50000,
    createdAt: "2026-10-01 16:30",
    status: "pending"
  },
  {
    id: "promo-202",
    postId: "p-902",
    authorId: "u-402",
    authorNickname: "미사동 필라테스",
    content: "가을맞이 1:1 기구 필라테스 체형 교정 체험권 50% 할인 이벤트!",
    imageUrls: [],
    targetRegions: ["하남시 미사강변동"],
    targetAge: "20대 ~ 50대",
    targetGender: "여성",
    budgetWon: 100000,
    createdAt: "2026-10-01 14:15",
    status: "pending"
  }
];

const initialStats = {
  totalMembers: 14280,
  todayNewMembers: 142,
  totalPosts: 48920,
  weeklyActiveUsers: 8930,
  cityCounts: [
    { province: "서울특별시", city: "성동구", count: 5210 },
    { province: "서울특별시", city: "광진구", count: 3410 },
    { province: "경기도", city: "하남시", count: 2850 },
    { province: "서울특별시", city: "송파구", count: 1820 },
    { province: "경기도", city: "남양주시", count: 990 }
  ]
};

export default function AdminDashboard({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'promotions' | 'stats'
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@townsns.com');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [reports, setReports] = useState(initialReportedPosts);
  const [promotions, setPromotions] = useState(initialPromotedPosts);
  const [stats, setStats] = useState(initialStats);
  
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, item: null, reason: '' });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 신고 승인 (글 삭제 + 경고 조치)
  const handleApproveReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast("신고가 승인되었습니다. 해당 게시글이 삭제되고 작성자에게 경고가 발송되었습니다.");
  };

  // 신고 기각 (무혐의 유지)
  const handleRejectReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast("신고가 기각되었습니다. 게시글이 피드에 정상 유지됩니다.");
  };

  // 홍보 승인
  const handleApprovePromotion = (id) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    showToast("홍보 신청이 승인되었습니다. 설정된 타겟 지역 피드에 노출이 시작됩니다.");
  };

  // 홍보 반려 모달 열기
  const openRejectionModal = (item) => {
    setRejectionModal({ isOpen: true, item, reason: '지역 커뮤니티 가이드라인에 부합하지 않는 광고성 문구가 포함되어 있습니다.' });
  };

  // 홍보 반려 확정
  const handleConfirmRejection = () => {
    if (!rejectionModal.item) return;
    setPromotions(prev => prev.filter(p => p.id !== rejectionModal.item.id));
    setRejectionModal({ isOpen: false, item: null, reason: '' });
    showToast("홍보 신청이 반려되었으며 신청자에게 사유 안내가 전달되었습니다.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e1a17] flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[#cde9d8]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#3e7acf] text-white flex items-center justify-center font-black">
              우
            </div>
            <div>
              <h1 className="text-xl font-black text-[#18322c]">우리동네 관리자 콘솔</h1>
              <p className="text-xs text-gray-500">운영팀 전용 웹 관리 시스템</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">관리자 이메일</label>
                <input 
                  type="email" 
                  value={adminEmail} 
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#3e7acf]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">비밀번호</label>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="관리자 인증 비밀번호"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#3e7acf]" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#18322c] hover:bg-[#23453d] text-white font-bold py-3 rounded-lg text-sm transition-colors mt-2 shadow-sm"
              >
                관리자 콘솔 접속
              </button>
            </div>
          </form>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
            <button onClick={onBackToHome} className="text-xs text-gray-500 hover:text-gray-800">
              ← 우리동네 웹사이트로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#18322c] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#18322c] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-[1280px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3ecf8e] text-[#18322c] flex items-center justify-center font-black text-sm">
              우
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight">우리동네 관리자 콘솔</span>
              <span className="ml-2 text-[11px] bg-[#23453d] text-[#3ecf8e] px-2 py-0.5 rounded font-mono font-bold">
                웹 전용 독립 환경
              </span>
            </div>
          </div>

          {/* Quick Nav & User */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-100 hidden sm:inline">
              접속 계정: <strong>{adminEmail}</strong>
            </span>
            <button 
              onClick={onBackToHome}
              className="text-xs bg-[#23453d] hover:bg-[#2e574e] text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              사용자 홈으로
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-red-300 hover:text-red-200 flex items-center gap-1"
            >
              <LogOut size={14} /> 로그아웃
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1280px] mx-auto px-5 flex gap-8 border-t border-[#23453d]">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reports' ? 'border-[#3ecf8e] text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldAlert size={16} /> 신고 검토
            {reports.length > 0 && (
              <span className="bg-rose-500 text-white text-[11px] px-2 py-0.2 rounded-full font-bold">
                {reports.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('promotions')}
            className={`py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'promotions' ? 'border-[#3ecf8e] text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Megaphone size={16} /> 로컬 홍보 심사
            {promotions.length > 0 && (
              <span className="bg-amber-400 text-[#18322c] text-[11px] px-2 py-0.2 rounded-full font-bold">
                {promotions.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'stats' ? 'border-[#3ecf8e] text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 size={16} /> 서비스 지표 & 지역 통계
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1280px] w-full mx-auto px-5 py-8 flex-1">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 bg-emerald-800 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-600 animate-fadeIn">
            <CheckCircle2 size={18} className="text-[#3ecf8e]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 탭 1: 신고 검토 */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#18322c]">접수된 게시글 신고 검토</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  이웃들이 신고한 유해 게시물을 심사하고 즉시 삭제 및 경고 조치를 집행합니다.
                </p>
              </div>
              <div className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 font-medium">
                대기 중인 신고: <strong>{reports.length}</strong>건
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
                <h3 className="text-base font-bold text-gray-800">모든 신고 처리가 완료되었습니다</h3>
                <p className="text-xs text-gray-500 mt-1">현재 대기 중인 유해 게시글 신고가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-gray-300 transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle size={12} /> {item.primaryReason}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          신고 {item.reportsCount}회 접수
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.createdAt}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-normal">
                          {item.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={13} /> 작성자: <strong>{item.authorNickname}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> 지역: {item.region}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                      <button 
                        onClick={() => handleApproveReport(item.id)}
                        className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={15} /> 위반 승인 (글 삭제+경고)
                      </button>
                      <button 
                        onClick={() => handleRejectReport(item.id)}
                        className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} /> 무혐의 기각
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 탭 2: 로컬 홍보 심사 */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#18322c]">로컬 비즈니스 홍보 심사</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  동네 소상공인 및 이웃들이 신청한 홍보 게시물의 진위와 가이드라인 준수 여부를 검수합니다.
                </p>
              </div>
              <div className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 font-medium">
                심사 대기: <strong>{promotions.length}</strong>건
              </div>
            </div>

            {promotions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
                <h3 className="text-base font-bold text-gray-800">모든 홍보 심사가 완료되었습니다</h3>
                <p className="text-xs text-gray-500 mt-1">대기 중인 신규 홍보 신청이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {promotions.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col lg:flex-row gap-6 justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          홍보 신청
                        </span>
                        <span className="text-xs text-gray-500">
                          신청일: {item.createdAt}
                        </span>
                      </div>

                      <div className="bg-[#fafcfa] p-4 rounded-xl border border-[#dcece2]">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {item.content}
                        </p>
                        {item.imageUrls.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {item.imageUrls.map((url, idx) => (
                              <img key={idx} src={url} alt="홍보 이미지" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 타겟팅 조건 요약 */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <span className="text-gray-400 block mb-0.5">신청자</span>
                          <strong className="text-gray-700">{item.authorNickname}</strong>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <span className="text-gray-400 block mb-0.5">노출 타겟 지역</span>
                          <strong className="text-gray-700">{item.targetRegions.join(', ')}</strong>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <span className="text-gray-400 block mb-0.5">타겟 대상</span>
                          <strong className="text-gray-700">{item.targetAge} / {item.targetGender}</strong>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <span className="text-gray-400 block mb-0.5">설정 예산</span>
                          <strong className="text-emerald-700">{item.budgetWon.toLocaleString()}원</strong>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                      <button 
                        onClick={() => handleApprovePromotion(item.id)}
                        className="flex-1 lg:flex-none bg-[#3ecf8e] hover:bg-[#34b87e] text-[#18322c] font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} /> 홍보 승인
                      </button>
                      <button 
                        onClick={() => openRejectionModal(item)}
                        className="flex-1 lg:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={15} /> 사유 입력 후 반려
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 탭 3: 통계 및 지역 분포 */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#18322c]">서비스 주요 통계 및 지역 분포</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                전체 회원 활동량과 행정구역별 유저 분포 현황입니다.
              </p>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-semibold text-gray-500">누적 가입 회원</span>
                <p className="text-2xl font-black text-[#18322c] mt-1">{stats.totalMembers.toLocaleString()}명</p>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">전주 대비 +12.4%</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-semibold text-gray-500">오늘 신규 가입자</span>
                <p className="text-2xl font-black text-[#3e7acf] mt-1">{stats.todayNewMembers.toLocaleString()}명</p>
                <span className="text-[11px] text-gray-400 mt-1 block">실시간 집계</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-semibold text-gray-500">누적 동네 게시글</span>
                <p className="text-2xl font-black text-[#18322c] mt-1">{stats.totalPosts.toLocaleString()}건</p>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">일 평균 1,200건 발행</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-semibold text-gray-500">주간 활성 유저(WAU)</span>
                <p className="text-2xl font-black text-[#18322c] mt-1">{stats.weeklyActiveUsers.toLocaleString()}명</p>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">활동 유지율 62.5%</span>
              </div>
            </div>

            {/* 지역별 회원 분포 Table */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">행정구역(시/군/구)별 회원 분포 순위</h3>
              <div className="space-y-4">
                {stats.cityCounts.map((city, idx) => {
                  const max = stats.cityCounts[0].count;
                  const pct = Math.round((city.count / max) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-800">
                          {idx + 1}. {city.province} {city.city}
                        </span>
                        <span className="text-emerald-700 font-bold font-mono">
                          {city.count.toLocaleString()}명
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-[#3ecf8e] h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 반려 사유 입력 모달 */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-200">
            <h3 className="text-base font-bold text-gray-900">홍보 신청 반려 사유 입력</h3>
            <p className="text-xs text-gray-500">
              신청자에게 전달될 반려 사유를 작성해 주세요. (가이드라인 안내 및 수정 요청)
            </p>
            <textarea 
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-rose-500"
              placeholder="반려 사유를 입력하세요..."
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setRejectionModal({ isOpen: false, item: null, reason: '' })}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleConfirmRejection}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
              >
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
