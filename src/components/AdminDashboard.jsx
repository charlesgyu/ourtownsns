import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldAlert, MessageSquareWarning, Baby, UserX, BarChart3, Megaphone,
  LogOut, RefreshCw, CheckCircle2, XCircle, ArrowLeft, Lock, ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// 우리동네 관리자 콘솔. 실제 서버(Supabase)의 관리자 전용 함수(admin_*)를 부른다 —
// 서버가 profiles.is_admin을 확인하므로, 관리자가 아닌 계정은 로그인해도 아무것도 볼 수 없다.

const fmt = (iso) => (iso ? new Date(iso).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) : '-');

// 사용자가 넣은 주소(사진 주소, 홍보 링크)는 http(s)만 열어 준다 — 'javascript:' 같은 주소로
// 관리자 화면에서 스크립트가 실행되는 것(관리자 로그인 세션 탈취)을 막는다.
const safeUrl = (u) => {
  try {
    const url = new URL(u);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
};

const STATUS_LABEL = {
  visible: '공개',
  hidden: '임시 숨김',
  pending_removal: '삭제 예정(3일 보류)',
  removed: '삭제됨',
};

const ACTION_LABEL = {
  remove_post_and_warn: '삭제 + 경고',
  remove_post_and_suspend: '삭제 + 정지',
  remove_post_and_ban: '삭제 + 영구정지',
  dismiss: '기각',
  no_action: '조치 없음',
};

const TABS = [
  { id: 'posts', label: '게시글 신고', icon: ShieldAlert, badge: (o) => (o?.pending_post_reports ?? 0) + (o?.pending_appeals ?? 0) },
  { id: 'dms', label: 'DM 신고', icon: MessageSquareWarning, badge: (o) => o?.pending_dm_reports },
  { id: 'severe', label: '미성년자 의심', icon: Baby, badge: (o) => o?.unreviewed_severe },
  { id: 'sanctions', label: '제재 사용자', icon: UserX },
  { id: 'stats', label: '가입자 통계', icon: BarChart3 },
  { id: 'promotions', label: '홍보 심사', icon: Megaphone },
];

async function rpc(name, params) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw new Error(error.message);
  return data;
}

function Card({ children, className = '' }) {
  return <div className={`bg-white border border-[#dcece2] rounded-2xl p-5 ${className}`}>{children}</div>;
}

function Empty({ text }) {
  return (
    <Card className="text-center py-14">
      <CheckCircle2 className="w-10 h-10 text-[#3ecf8e] mx-auto mb-3" />
      <p className="text-sm font-bold text-gray-700">{text}</p>
    </Card>
  );
}

function Btn({ onClick, children, tone = 'primary', disabled }) {
  const tones = {
    primary: 'bg-[#3e7acf] text-white hover:opacity-90',
    danger: 'bg-red-600 text-white hover:opacity-90',
    ghost: 'bg-[#f2f8f4] text-[#18322c] hover:bg-[#e3f0e8]',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function Images({ urls }) {
  if (!urls?.length) return null;
  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {urls.map(safeUrl).filter(Boolean).map((u) => (
        <a key={u} href={u} target="_blank" rel="noreferrer noopener">
          <img src={u} alt="" referrerPolicy="no-referrer" className="w-28 h-28 object-cover rounded-lg border border-gray-200" />
        </a>
      ))}
    </div>
  );
}

// ── 로그인(비밀번호 → 이메일 인증번호) ─────────────────────
// 서버의 is_admin()은 "인증번호를 통과한 그 로그인 세션"에서만 참이다. 그래서 비밀번호만으로는 어떤 관리자
// 기능도 쓸 수 없다. needsCode: 이미 비밀번호로 로그인돼 있고 인증번호만 남은 상태(새로고침 등).
function Login({ onDone, onBackToHome, needsCode }) {
  const [stage, setStage] = useState(needsCode ? 'code' : 'password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const sendCode = useCallback(async () => {
    setError('');
    const { data, error: fnError } = await supabase.functions.invoke('admin-2fa', { body: {} });
    if (fnError) {
      let message = '인증번호를 보내지 못했어요. 잠시 후 다시 시도해 주세요.';
      try { message = (await fnError.context.json()).message || message; } catch { /* 기본 문구 사용 */ }
      setError(message);
      return false;
    }
    setSentTo(data?.email ?? '');
    return true;
  }, []);

  useEffect(() => { if (needsCode) sendCode(); }, [needsCode, sendCode]);

  const submitPassword = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.');
      setBusy(false);
      return;
    }
    const hasRole = await rpc('has_admin_role').catch(() => false);
    if (!hasRole) {
      await supabase.auth.signOut();
      setError('관리자 권한이 없는 계정이에요.');
      setBusy(false);
      return;
    }
    if (await sendCode()) setStage('code');
    setBusy(false);
  };

  const submitCode = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const ok = await rpc('admin_verify_2fa', { p_code: code });
      if (ok) {
        onDone();
        return;
      }
      setError('인증번호가 맞지 않아요.');
    } catch (err) {
      setError(err.message.includes('code_expired') ? '인증번호가 만료됐어요. 다시 받아 주세요.'
        : err.message.includes('too_many_attempts') ? '5회 틀려서 인증번호가 폐기됐어요. 다시 받아 주세요.'
          : '확인하지 못했어요. 다시 시도해 주세요.');
    }
    setBusy(false);
  };

  const cancel = async () => {
    await supabase.auth.signOut();
    setStage('password');
    setCode('');
    setError('');
  };

  const input = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm';
  return (
    <div className="min-h-screen bg-[#fafcfa] flex items-center justify-center px-5">
      <form onSubmit={stage === 'password' ? submitPassword : submitCode} className="w-full max-w-sm bg-white border border-[#dcece2] rounded-3xl p-8 space-y-4">
        <div className="text-center mb-2">
          <Lock className="w-8 h-8 text-[#3e7acf] mx-auto mb-2" />
          <h1 className="text-xl font-black text-[#18322c]">우리동네 관리자 콘솔</h1>
          <p className="text-xs text-gray-500 mt-1">
            {stage === 'password' ? '관리자 권한이 있는 우리동네 계정으로 로그인하세요.'
              : `${sentTo || '관리자 이메일'}로 보낸 6자리 인증번호를 입력하세요. (10분 유효)`}
          </p>
        </div>
        {stage === 'password' ? (
          <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required className={input} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required className={input} />
          </>
        ) : (
          <input
            inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="인증번호 6자리" required
            className={`${input} text-center tracking-[0.5em] text-lg font-bold`}
          />
        )}
        {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
        <button disabled={busy} className="w-full bg-[#3e7acf] text-white font-bold rounded-xl py-3 disabled:opacity-50">
          {busy ? '확인 중…' : stage === 'password' ? '다음' : '확인'}
        </button>
        {stage === 'code' && (
          <div className="flex justify-between text-xs text-gray-500">
            <button type="button" onClick={sendCode}>인증번호 다시 받기</button>
            <button type="button" onClick={cancel}>다른 계정으로 로그인</button>
          </div>
        )}
        <button type="button" onClick={onBackToHome} className="w-full text-xs text-gray-500">홈으로</button>
      </form>
    </div>
  );
}

// ── 게시글 신고·이의제기 ─────────────────────────────────
function PostReports({ notify, refreshOverview }) {
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setRows(await rpc('admin_reported_posts', { p_limit: 100 }));
  }, []);
  useEffect(() => { load().catch((e) => notify(e.message)); }, [load, notify]);

  const open = async (postId) => {
    setSelected(postId);
    setDetail(null);
    try {
      setDetail(await rpc('admin_report_detail', { p_post_id: postId }));
    } catch (e) {
      notify(e.message);
    }
  };

  const act = async (approve) => {
    const msg = approve
      ? '위반으로 확정할까요? 글이 삭제되고 작성자에게 경고(반복 시 정지)가 적용돼요. 이의제기가 있으면 이의제기를 기각합니다.'
      : '문제 없음으로 처리할까요? 글이 다시 공개되고, 이전에 준 경고가 있으면 취소돼요. 이의제기가 있으면 이의제기를 받아들입니다.';
    if (!window.confirm(msg)) return;
    setBusy(true);
    try {
      await rpc(approve ? 'admin_approve_report' : 'admin_reject_report', { p_post_id: selected });
      notify(approve ? '위반으로 처리했어요.' : '문제 없음으로 처리했어요.');
      setSelected(null);
      await load();
      refreshOverview();
    } catch (e) {
      notify(e.message);
    }
    setBusy(false);
  };

  if (rows === null) return <p className="text-sm text-gray-500">불러오는 중…</p>;
  if (rows.length === 0) return <Empty text="검토할 게시글 신고가 없어요" />;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
      <div className="space-y-2">
        {rows.map((r) => (
          <button
            key={r.post_id}
            onClick={() => open(r.post_id)}
            className={`w-full text-left bg-white border rounded-2xl p-4 transition ${selected === r.post_id ? 'border-[#3e7acf] ring-2 ring-[#3e7acf]/20' : 'border-[#dcece2]'}`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#18322c]">{r.author_nickname}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f8f4] text-[#3e7acf] font-bold">
                {STATUS_LABEL[r.moderation_status] ?? r.moderation_status}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{r.content || '(사진만 있는 글)'}</p>
            <p className="text-[11px] text-gray-500 mt-2">
              신고 {r.report_count}건(대기 {r.pending_count}) · 사진 탐지 {r.image_flag_count}건 · 최근 {fmt(r.last_report_at)}
            </p>
          </button>
        ))}
      </div>

      <div>
        {!selected && <Card className="text-sm text-gray-500 text-center py-14">왼쪽에서 검토할 글을 고르세요.</Card>}
        {selected && !detail && <Card className="text-sm text-gray-500">불러오는 중…</Card>}
        {detail && (
          <Card className="space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-[#18322c] text-sm">{detail.post.author_nickname}</span>
                <span>{detail.post.author_handle}</span>
                <span>· {detail.post.region}</span>
                <span>· 작성 {fmt(detail.post.created_at)}</span>
              </div>
              <p className="text-xs mt-1 text-gray-500">
                작성자 경고 {detail.post.author_warning_count}회
                {detail.post.author_suspended_until && ` · 정지 ${fmt(detail.post.author_suspended_until)}까지`}
                {detail.post.author_banned_at && ' · 영구정지'}
              </p>
              <p className="whitespace-pre-wrap text-sm text-gray-800 mt-3">{detail.post.content}</p>
              <Images urls={detail.post.image_urls} />
              <p className="text-xs mt-3">
                상태: <b>{STATUS_LABEL[detail.post.moderation_status] ?? detail.post.moderation_status}</b>
                {detail.post.moderation_reason && ` (${detail.post.moderation_reason})`}
                {detail.post.removal_at && ` · 자동 삭제 예정 ${fmt(detail.post.removal_at)}`}
              </p>
            </div>

            {detail.appeals.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-black text-amber-800 mb-2">작성자 이의제기</p>
                {detail.appeals.map((a, i) => (
                  <div key={i} className="text-sm text-gray-800">
                    <p className="whitespace-pre-wrap">{a.message}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{a.status} · {fmt(a.created_at)}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs font-black text-gray-700 mb-2">신고 내역 ({detail.reports.length})</p>
              <div className="space-y-2">
                {detail.reports.map((r) => (
                  <div key={r.id} className="text-xs bg-[#fafcfa] rounded-lg p-3">
                    <b>{r.category}</b> · {r.reporter_nickname ?? '알 수 없음'} · {r.status} · {fmt(r.created_at)}
                    {Array.isArray(r.answers?.path) && r.answers.path.length > 0 && (
                      <ul className="mt-1 text-gray-600 list-disc pl-4">
                        {r.answers.path.map((s, i) => <li key={i}>{s.q}: {s.a}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {detail.decisions.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-700 mb-2">판정 기록 (AI·관리자)</p>
                <div className="space-y-2">
                  {detail.decisions.map((d, i) => (
                    <div key={i} className="text-xs bg-[#f2f6fc] rounded-lg p-3">
                      <b>{d.verdict}</b> · {d.category ?? '-'} · 확신도 {Number(d.confidence).toFixed(2)} · {ACTION_LABEL[d.action] ?? d.action}
                      {d.overturned && ' · (취소됨)'} · {d.model} · {fmt(d.created_at)}
                      {d.reasoning && <p className="text-gray-600 mt-1">{d.reasoning}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.image_flags.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-700 mb-2">사진 자동 탐지</p>
                {detail.image_flags.map((f, i) => (
                  <p key={i} className="text-xs text-gray-600">{f.category} · {f.likelihood} · {f.action_taken}</p>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-[#dcece2]">
              <Btn tone="danger" disabled={busy} onClick={() => act(true)}><XCircle className="inline w-4 h-4 mr-1" />위반 확정(삭제)</Btn>
              <Btn tone="ghost" disabled={busy} onClick={() => act(false)}><CheckCircle2 className="inline w-4 h-4 mr-1" />문제 없음(복구)</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── DM 신고 ──────────────────────────────────────────────
function DmReports({ notify, refreshOverview }) {
  const [rows, setRows] = useState(null);
  const load = useCallback(async () => setRows(await rpc('admin_reported_dms', { p_limit: 100 })), []);
  useEffect(() => { load().catch((e) => notify(e.message)); }, [load, notify]);

  const resolve = async (r, violation) => {
    const msg = violation
      ? `${r.reported_nickname}님의 신고된 메시지를 삭제하고 경고(반복 시 정지)를 적용할까요?`
      : '위반이 아닌 것으로 기각할까요?';
    if (!window.confirm(msg)) return;
    try {
      await rpc('admin_resolve_dm_report', { p_report_id: r.id, p_violation: violation });
      notify(violation ? '위반으로 처리했어요.' : '기각했어요.');
      await load();
      refreshOverview();
    } catch (e) {
      notify(e.message);
    }
  };

  if (rows === null) return <p className="text-sm text-gray-500">불러오는 중…</p>;
  if (rows.length === 0) return <Empty text="검토할 DM 신고가 없어요" />;

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">AI가 아직 처리하지 않은 신고입니다. 증거는 신고 순간 저장한, 신고된 사람이 보낸 메시지예요.</p>
      {rows.map((r) => (
        <Card key={r.id} className="space-y-3">
          <div className="text-xs text-gray-600">
            <b className="text-[#18322c] text-sm">{r.reported_nickname}</b> 님을 {r.reporter_nickname}님이 신고 · <b>{r.category}</b> · {fmt(r.created_at)}
          </div>
          {Array.isArray(r.answers?.path) && r.answers.path.length > 0 && (
            <ul className="text-xs text-gray-600 list-disc pl-4">
              {r.answers.path.map((s, i) => <li key={i}>{s.q}: {s.a}</li>)}
            </ul>
          )}
          <div className="bg-[#fafcfa] rounded-xl p-3 space-y-1 max-h-72 overflow-auto">
            {(r.evidence ?? []).map((m) => (
              <p key={m.id} className="text-sm text-gray-800">
                <span className="text-[11px] text-gray-400 mr-2">{fmt(m.created_at)}</span>{m.text}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <Btn tone="danger" onClick={() => resolve(r, true)}>위반(메시지 삭제·경고)</Btn>
            <Btn tone="ghost" onClick={() => resolve(r, false)}>기각</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── 미성년자 관련 의심 건 ─────────────────────────────────
function SevereFlags({ notify, refreshOverview }) {
  const [rows, setRows] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const load = useCallback(async () => setRows(await rpc('admin_severe_flags', { p_include_reviewed: showAll })), [showAll]);
  useEffect(() => { load().catch((e) => notify(e.message)); }, [load, notify]);

  const markReviewed = async (id) => {
    if (!window.confirm('관계 기관 신고 등 필요한 조치를 마쳤나요? 확인 완료로 표시합니다.')) return;
    try {
      await rpc('admin_mark_severe_flag_reviewed', { p_flag_id: id });
      await load();
      refreshOverview();
    } catch (e) {
      notify(e.message);
    }
  };

  return (
    <div className="space-y-3">
      <Card className="bg-red-50 border-red-200 text-xs text-red-900 leading-relaxed">
        AI가 <b>미성년자가 관련된 성적 콘텐츠</b>로 의심한 건입니다. 확인되면 법령에 따라 관계 기관에 신고해야 합니다(아동 안전 표준에 명시).
        <div className="flex flex-wrap gap-3 mt-2 font-bold">
          <a className="underline" href="https://ecrm.police.go.kr" target="_blank" rel="noreferrer">경찰청 사이버범죄 신고 <ExternalLink className="inline w-3 h-3" /></a>
          <a className="underline" href="https://www.kocsc.or.kr" target="_blank" rel="noreferrer">방송통신심의위원회 <ExternalLink className="inline w-3 h-3" /></a>
        </div>
      </Card>
      <label className="text-xs text-gray-600 flex items-center gap-2">
        <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> 확인 완료된 건도 보기
      </label>
      {rows === null && <p className="text-sm text-gray-500">불러오는 중…</p>}
      {rows?.length === 0 && <Empty text="확인할 건이 없어요" />}
      {rows?.map((f) => (
        <Card key={f.id} className="space-y-2">
          <div className="text-xs text-gray-600">
            <b className="text-[#18322c] text-sm">{f.author_nickname ?? '(탈퇴/삭제된 계정)'}</b> · {f.author_email ?? '-'} · {f.category ?? '-'} · 확신도 {Number(f.confidence ?? 0).toFixed(2)} · {fmt(f.created_at)}
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{f.post_content ?? '(글이 이미 삭제됨)'}</p>
          <Images urls={f.image_urls} />
          {f.reasoning && <p className="text-xs text-gray-600">AI 근거: {f.reasoning}</p>}
          <div className="flex items-center gap-2">
            {f.reviewed ? <span className="text-xs font-bold text-[#3ecf8e]">확인 완료</span>
              : <Btn onClick={() => markReviewed(f.id)}>확인 완료로 표시</Btn>}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── 제재 사용자 ──────────────────────────────────────────
function Sanctions({ notify }) {
  const [rows, setRows] = useState(null);
  const load = useCallback(async () => setRows(await rpc('admin_sanctioned_users', { p_limit: 200 })), []);
  useEffect(() => { load().catch((e) => notify(e.message)); }, [load, notify]);

  const lift = async (u) => {
    if (!window.confirm(`${u.nickname}님의 이용 정지·신고 제한을 해제할까요?`)) return;
    try {
      await rpc('admin_lift_suspension', { p_user_id: u.user_id });
      notify('해제했어요.');
      await load();
    } catch (e) {
      notify(e.message);
    }
  };

  if (rows === null) return <p className="text-sm text-gray-500">불러오는 중…</p>;
  if (rows.length === 0) return <Empty text="제재받은 사용자가 없어요" />;
  const now = Date.now();

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-[#fafcfa] text-xs text-gray-500">
          <tr>
            <th className="text-left p-3">사용자</th><th className="text-left p-3">경고</th><th className="text-left p-3">상태</th>
            <th className="text-left p-3">최근 위반</th><th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const suspended = u.suspended_until && new Date(u.suspended_until).getTime() > now;
            const reportBlocked = u.reports_blocked_until && new Date(u.reports_blocked_until).getTime() > now;
            return (
              <tr key={u.user_id} className="border-t border-[#dcece2]">
                <td className="p-3"><b>{u.nickname}</b> <span className="text-xs text-gray-400">{u.handle}</span></td>
                <td className="p-3">{u.warning_count}회</td>
                <td className="p-3 text-xs">
                  {u.permanently_banned_at ? <span className="text-red-600 font-bold">영구정지</span>
                    : suspended ? <span className="text-amber-600 font-bold">정지 ~{fmt(u.suspended_until)}</span>
                      : '정상'}
                  {reportBlocked && <span className="ml-1 text-gray-500">(신고 제한)</span>}
                </td>
                <td className="p-3 text-xs text-gray-600">
                  {u.last_decision_at ? `${ACTION_LABEL[u.last_decision_action] ?? u.last_decision_action} · ${u.last_decision_category ?? ''} · ${fmt(u.last_decision_at)}` : '-'}
                </td>
                <td className="p-3 text-right">
                  {!u.permanently_banned_at && (suspended || reportBlocked) && <Btn tone="ghost" onClick={() => lift(u)}>제한 해제</Btn>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ── 가입자 통계 ──────────────────────────────────────────
function Stats({ overview, notify }) {
  const [basic, setBasic] = useState(null);
  const [scope, setScope] = useState('main');
  const [level, setLevel] = useState('city');
  const [regions, setRegions] = useState(null);

  useEffect(() => { rpc('admin_stats').then((r) => setBasic(r?.[0])).catch((e) => notify(e.message)); }, [notify]);
  useEffect(() => {
    if (scope === 'sub' && level === 'district') { setLevel('city'); return; }
    setRegions(null);
    rpc('admin_members_by_region', { p_scope: scope, p_level: level }).then(setRegions).catch((e) => notify(e.message));
  }, [scope, level, notify]);

  const total = regions?.reduce((s, r) => s + Number(r.member_count), 0) ?? 0;
  const tile = (label, value) => (
    <Card><p className="text-xs text-gray-500">{label}</p><p className="text-2xl font-black text-[#18322c] mt-1">{value ?? '-'}</p></Card>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tile('현재 가입자', basic?.current_members)}
        {tile('최근 7일 가입', overview?.new_members_7d)}
        {tile('24시간 활성', basic?.active_24h)}
        {tile('누적 탈퇴', basic?.withdrawals)}
        {tile('공개 게시글', overview?.posts)}
        {tile('정지 중', overview?.suspended_users)}
        {tile('영구정지', overview?.banned_users)}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <h3 className="font-black text-[#18322c] mr-auto">지역별 이용자</h3>
          {[['main', '메인(내 동네)'], ['sub', '서브(관심 지역)']].map(([v, l]) => (
            <button key={v} onClick={() => setScope(v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${scope === v ? 'bg-[#3e7acf] text-white' : 'bg-[#f2f8f4] text-gray-600'}`}>{l}</button>
          ))}
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5">
            <option value="province">시·도</option>
            <option value="city">시·군·구</option>
            {scope === 'main' && <option value="district">동</option>}
          </select>
        </div>
        {regions === null && <p className="text-sm text-gray-500">불러오는 중…</p>}
        {regions?.length === 0 && <p className="text-sm text-gray-500">아직 이 기준으로 설정한 이용자가 없어요.</p>}
        <div className="space-y-2">
          {regions?.map((r) => (
            <div key={r.region} className="flex items-center gap-3 text-sm">
              <span className="w-56 truncate">{r.region}</span>
              <div className="flex-1 bg-[#f2f8f4] rounded-full h-2.5">
                <div className="bg-[#3e7acf] h-2.5 rounded-full" style={{ width: `${total ? (Number(r.member_count) / total) * 100 : 0}%` }} />
              </div>
              <span className="w-14 text-right font-bold">{r.member_count}명</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 홍보 심사 ────────────────────────────────────────────
function Promotions({ notify }) {
  const [rows, setRows] = useState(null);
  const load = useCallback(async () => setRows(await rpc('admin_promoted_posts', { p_limit: 100 })), []);
  useEffect(() => { load().catch((e) => notify(e.message)); }, [load, notify]);

  const approve = async (p) => {
    if (!window.confirm('이 홍보를 승인할까요? 바로 다른 이웃에게 노출돼요.')) return;
    try { await rpc('admin_approve_promotion', { p_post_id: p.post_id }); notify('승인했어요.'); await load(); } catch (e) { notify(e.message); }
  };
  const reject = async (p) => {
    const message = window.prompt('작성자에게 보낼 거절 사유를 입력하세요.');
    if (!message?.trim()) return;
    try { await rpc('admin_reject_promotion', { p_post_id: p.post_id, p_message: message.trim() }); notify('거절했어요.'); await load(); } catch (e) { notify(e.message); }
  };

  if (rows === null) return <p className="text-sm text-gray-500">불러오는 중…</p>;
  const pending = rows.filter((p) => p.approval_status === 'pending');
  if (pending.length === 0) return <Empty text="심사할 홍보가 없어요 (홍보 기능은 현재 앱에서 숨김 상태)" />;

  return (
    <div className="space-y-3">
      {pending.map((p) => (
        <Card key={p.post_id} className="space-y-2">
          <p className="text-xs text-gray-600"><b className="text-[#18322c] text-sm">{p.author_nickname}</b> · 하루 {p.daily_budget_krw?.toLocaleString()}원 · {p.reach} · {p.min_age ?? '-'}~{p.max_age ?? '-'}세 · {p.gender ?? '전체'}</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{p.content}</p>
          {p.link_url && (safeUrl(p.link_url)
            ? <a className="text-xs text-[#3e7acf] underline" href={safeUrl(p.link_url)} target="_blank" rel="noreferrer noopener">{p.link_url}</a>
            : <span className="text-xs text-red-600">허용되지 않는 링크: {p.link_url}</span>)}
          <div className="flex gap-2"><Btn onClick={() => approve(p)}>승인</Btn><Btn tone="ghost" onClick={() => reject(p)}>거절</Btn></div>
        </Card>
      ))}
    </div>
  );
}

// ── 콘솔 ────────────────────────────────────────────────
export default function AdminDashboard({ onBackToHome }) {
  const [session, setSession] = useState(undefined); // undefined = 확인 중
  const [isAdmin, setIsAdmin] = useState(false); // 2단계 인증까지 마친 관리자 세션인지
  const [hasRole, setHasRole] = useState(false); // 관리자 계정인지(인증번호 전)
  const [tab, setTab] = useState('posts');
  const [overview, setOverview] = useState(null);
  const [toast, setToast] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const notify = useCallback((m) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const refreshOverview = useCallback(() => {
    rpc('admin_overview').then(setOverview).catch(() => {});
  }, []);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const s = data.session;
    if (s) {
      const [role, admin] = await Promise.all([
        rpc('has_admin_role').catch(() => false),
        rpc('is_admin').catch(() => false),
      ]);
      setHasRole(role);
      setIsAdmin(admin);
      if (admin) refreshOverview();
    }
    setSession(s ?? null);
  }, [refreshOverview]);

  useEffect(() => { checkSession(); }, [checkSession]);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setHasRole(false);
  };

  if (session === undefined) return <div className="min-h-screen bg-[#fafcfa]" />;
  if (!session || !isAdmin) {
    return <Login onDone={checkSession} onBackToHome={onBackToHome} needsCode={Boolean(session && hasRole)} />;
  }

  const Active = { posts: PostReports, dms: DmReports, severe: SevereFlags, sanctions: Sanctions, stats: Stats, promotions: Promotions }[tab];

  return (
    <div className="min-h-screen bg-[#fafcfa] text-[#18322c]">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#dcece2]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          <button onClick={onBackToHome} className="text-gray-500 hover:text-[#18322c]"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-black mr-auto">우리동네 관리자 콘솔</h1>
          <span className="hidden sm:inline text-xs text-gray-500">{session.user.email}</span>
          <button onClick={() => { refreshOverview(); setReloadKey((k) => k + 1); }} className="p-2 rounded-lg hover:bg-[#f2f8f4]" title="새로고침"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-[#f2f8f4]" title="로그아웃"><LogOut className="w-4 h-4" /></button>
        </div>
        <nav className="max-w-6xl mx-auto px-5 flex gap-1 overflow-x-auto pb-2">
          {TABS.map((t) => {
            const count = t.badge?.(overview);
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-bold ${tab === t.id ? 'bg-[#3e7acf] text-white' : 'text-gray-600 hover:bg-[#f2f8f4]'}`}
              >
                <t.icon className="w-4 h-4" />{t.label}
                {count > 0 && <span className={`text-[11px] px-1.5 rounded-full ${tab === t.id ? 'bg-white text-[#3e7acf]' : 'bg-red-500 text-white'}`}>{count}</span>}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        <Active key={`${tab}-${reloadKey}`} notify={notify} refreshOverview={refreshOverview} overview={overview} />
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#18322c] text-white text-sm px-5 py-3 rounded-xl shadow-lg">{toast}</div>
      )}
    </div>
  );
}
