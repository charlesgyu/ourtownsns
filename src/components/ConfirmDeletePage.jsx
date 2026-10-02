import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ConfirmDeletePage({ token, onBackToHome }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    setStatus('processing');
    try {
      // Supabase RPC 호출 시뮬레이션 및 연동
      // 실제 환경에서는 supabase client rpc 'confirm_account_deletion' 호출
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || '인증 토큰이 만료되었거나 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-slate-900 text-white px-6 py-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-400 mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">회원 탈퇴 최종 승인</h1>
          <p className="text-xs text-slate-400 mt-1">우리동네 2단계 보안 인증</p>
        </div>

        {/* 본문 */}
        <div className="p-6">
          {status === 'idle' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed space-y-1">
                  <p className="font-semibold text-amber-900">정말로 회원 탈퇴를 승인하시겠습니까?</p>
                  <p>이메일 승인을 완료하시면 계정이 즉시 영구 삭제되며 이전 데이터는 어떤 방법으로도 복구할 수 없습니다.</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="font-semibold text-slate-700 mb-1">삭제 대상 데이터 안내</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>내 프로필 및 닉네임, 동네 설정</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>작성한 모든 게시글 및 사진, 댓글</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>1:1 개인 DM 대화방 및 메시지 내역</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>팔로우, 팔로워 및 활동 알림 기록</span>
                </div>
              </div>

              {token && (
                <div className="text-[11px] text-slate-400 text-center font-mono bg-slate-100 py-1.5 px-3 rounded-lg truncate">
                  인증 토큰: {token}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleConfirm}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition duration-150 shadow-sm text-sm"
                >
                  회원 탈퇴 최종 승인하기
                </button>
                <button
                  onClick={onBackToHome}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition duration-150 text-sm"
                >
                  탈퇴 취소하고 홈으로
                </button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-700">탈퇴 처리를 진행하고 있습니다...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">회원 탈퇴가 완료되었습니다</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                모든 개인정보와 게시글, 활동 데이터가 안전하게 파기되었습니다.<br />
                그동안 우리동네 서비스를 이용해 주셔서 진심으로 감사드립니다.
              </p>
              <div className="pt-4">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  홈으로 이동
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-600 mb-2">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-slate-900">탈퇴 승인 실패</h2>
              <p className="text-xs text-red-600">{errorMessage}</p>
              <div className="pt-4">
                <button
                  onClick={onBackToHome}
                  className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
