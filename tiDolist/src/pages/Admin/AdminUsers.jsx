import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import './AdminPages.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { supabase.from('profiles').select('id,full_name,role,created_at').order('created_at', { ascending: false }).then(({ data, error: loadError }) => { if (loadError) setError('برای نمایش کاربران، جدول profiles و سیاست RLS را با فایل راه‌اندازی تنظیم کن.'); else setUsers(data || []) }).finally(() => setLoading(false)) }, [])
  const filtered = users.filter(user => `${user.full_name || ''} ${user.id}`.toLowerCase().includes(search.toLowerCase()))
  return <div><div className="admin-page-heading"><div><div className="admin-eyebrow">COMMUNITY</div><h1>مدیریت کاربران</h1><p>پروفایل‌های ثبت‌شده و نقش‌های کاربری را مشاهده کن.</p></div><span className="admin-count-pill">{users.length} حساب</span></div>{error && <div className="admin-feedback error">{error}</div>}<section className="admin-card"><div className="admin-toolbar"><input className="admin-search" placeholder="جست‌وجو بر اساس نام یا شناسه..." value={search} onChange={e => setSearch(e.target.value)}/></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>کاربر</th><th>شناسه</th><th>نقش</th><th>تاریخ عضویت</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="admin-table-empty">در حال دریافت کاربران...</td></tr> : filtered.length ? filtered.map(user => <tr key={user.id}><td><div className="admin-user-table-cell"><span>{(user.full_name || 'ک').slice(0,1)}</span><strong>{user.full_name || 'نام ثبت نشده'}</strong></div></td><td className="admin-id-cell">{user.id}</td><td><span className={`admin-status ${user.role === 'admin' ? 'pending' : 'published'}`}>{user.role === 'admin' ? 'مدیر' : 'کاربر'}</span></td><td>{user.created_at ? new Date(user.created_at).toLocaleDateString('fa-IR') : '—'}</td></tr>) : <tr><td colSpan="4" className="admin-table-empty">کاربری پیدا نشد.</td></tr>}</tbody></table></div><p className="admin-note">برای تغییر نقش مدیران، از پنل امن Supabase استفاده کن؛ تغییر نقش از این جدول عمداً فعال نشده است.</p></section></div>
}
