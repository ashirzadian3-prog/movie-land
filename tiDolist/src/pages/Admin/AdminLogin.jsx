import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './AdminPages.css'
import '../../layouts/Admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) {
      setError('ورود انجام نشد. ایمیل و رمز عبور را بررسی کن.')
      setLoading(false)
      return
    }
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('این حساب دسترسی مدیر ندارد. ابتدا نقش آن را در Supabase به admin تغییر بده.')
      setLoading(false)
      return
    }
    navigate(location.state?.from?.pathname || '/admin', { replace: true })
  }

  return <div className="admin-login-page" dir="rtl">
    <div className="admin-login-decoration decor-one"/><div className="admin-login-decoration decor-two"/>
    <a href="/" className="admin-login-back">← بازگشت به سایت</a>
    <section className="admin-login-card">
      <div className="admin-login-logo">M</div>
      <div className="admin-login-brand">MOVIE<span>LAND</span></div>
      <div className="admin-login-eyebrow">ADMINISTRATION PORTAL</div>
      <h1>ورود به پنل مدیریت</h1>
      <p className="admin-login-description">برای ادامه، با حساب کاربری مدیر وارد شو.</p>
      {error && <p className="admin-feedback error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-login-form">
        <label className="admin-field"><span>ایمیل مدیر</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="username" required /></label>
        <label className="admin-field"><span>رمز عبور</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور حساب Supabase" autoComplete="current-password" required /></label>
        <button className="admin-button primary admin-login-submit" disabled={loading}>{loading ? 'در حال بررسی...' : 'ورود امن به پنل'} <span>←</span></button>
      </form>
      <div className="admin-login-secure">▣ اتصال امن با Supabase Auth</div>
    </section>
    <p className="admin-login-footer">Movie Land · فضای مدیریت محتوا</p>
  </div>
}
