import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAdminAuth } from '../hooks/useAdminAuth'
import './Admin.css'

const menu = [
  { to: '/admin', label: 'داشبورد', icon: '▦', end: true },
  { to: '/admin/articles', label: 'مدیریت مقاله‌ها', icon: '▤' },
  { to: '/admin/movies', label: 'فیلم و سریال', icon: '▣' },
  { to: '/admin/users', label: 'کاربران', icon: '♙' },
  { to: '/admin/comments', label: 'دیدگاه‌ها', icon: '☷' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { profile, session } = useAdminAuth()
  async function logout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return <div className="admin-app" dir="rtl">
    <aside className="admin-sidebar">
      <div className="admin-brand"><div className="admin-brand-mark">M</div><div><strong>MOVIE<span>LAND</span></strong><small>پنل مدیریت</small></div></div>
      <div className="admin-menu-label">فضای مدیریت</div>
      <nav className="admin-nav">{menu.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><span className="admin-nav-icon">{item.icon}</span>{item.label}{item.end && <span className="admin-nav-dot" />}</NavLink>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-help-mark">?</div><div><strong>نیاز به راهنما داری؟</strong><small>راهنمای پنل مدیریت</small></div><a href="https://supabase.com/docs" target="_blank" rel="noreferrer" aria-label="راهنمای Supabase">↗</a></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><span className="admin-breadcrumb">Movie Land</span><span className="admin-breadcrumb-sep">/</span><strong>فضای مدیریت</strong></div><div className="admin-top-actions"><a className="admin-view-site" href="/" target="_blank" rel="noreferrer">مشاهده سایت ↗</a><div className="admin-user-chip"><div className="admin-avatar">{(profile?.full_name || session?.user?.email || 'م').slice(0, 1).toUpperCase()}</div><div><strong>{profile?.full_name || 'مدیر سایت'}</strong><small>{session?.user?.email}</small></div></div><button className="admin-logout" onClick={logout} title="خروج">↪</button></div></header>
      <div className="admin-content"><Outlet /></div>
    </main>
  </div>
}
