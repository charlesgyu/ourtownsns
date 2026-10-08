import { createClient } from '@supabase/supabase-js';

// 앱과 같은 Supabase 프로젝트. anon 키는 앱에도 들어 있는 공개 키이고, 관리자 기능은 서버에서
// profiles.is_admin을 확인하므로(is_admin()) 관리자가 아니면 아무것도 볼 수 없다.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://yawbijyoihebborgauix.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2JpanlvaWhlYmJvcmdhdWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTg0NzEsImV4cCI6MjEwNjA5NDQ3MX0.GFriM2SBVMoXM5cZOALeW_S_w44IXn-0i1zzfbCKdOg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, storageKey: 'ourtown-admin-auth' },
});
