import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import '../Admin/AdminPages.css'

const initialStats = [
  { key: 'articles', label: 'کل مقاله‌ها', value: '—', icon: '▤', color: 'violet', note: 'محتوای تحریریه' },
  { key: 'published', label: 'منتشرشده', value: '—', icon: '✓', color: 'green', note: 'قابل مشاهده در سایت' },
  { key: 'users', label: 'کاربران', value: '—', icon: '♙', color: 'blue', note: 'پروفایل‌های ثبت‌شده' },
  { key: 'comments', label: 'دیدگاه‌ها', value: '—', icon: '☷', color: 'orange', note: 'نیازمند بررسی' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(initialStats)
  const [recent, setRecent] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      const [articlesRes, publishedRes, usersRes, commentsRes, recentRes] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('articles').select('id,title,author,date,status').order('date', { ascending: false }).limit(5),
      ])
      setStats(initialStats.map(stat => ({ ...stat, value: ({ articles: articlesRes.count, published: publishedRes.count, users: usersRes.count, comments: commentsRes.count }[stat.key] ?? (stat.key === 'articles' && articlesRes.error ? '—' : stat.key === 'published' && publishedRes.error ? '—' : stat.key === 'users' && usersRes.error ? '—' : stat.key === 'comments' && commentsRes.error ? '—' : 0)) })))
      setRecent(recentRes.data || [])
      if (articlesRes.error || publishedRes.error || usersRes.error || commentsRes.error) setMessage('برای نمایش تمام آمار، فایل admin-setup.sql را در SQL Editor سوپابیس اجرا کن.')
    }
    loadDashboard()
  }, [])

  return <div className="admin-dashboard-page">
    <div className="admin-page-heading"><div><div className="admin-eyebrow">OVERVIEW</div><h1>سلام، خوش اومدی 👋</h1><p>نمای کلی وضعیت و فعالیت‌های Movie Land در یک نگاه.</p></div><Link className="admin-button primary" to="/admin/articles/new">＋ مقاله جدید</Link></div>
    {message && <div className="admin-feedback error">{message}</div>}
    <section className="admin-stat-grid">{stats.map(stat => <div className="admin-stat-card" key={stat.key}><div className={`admin-stat-icon ${stat.color}`}>{stat.icon}</div><div className="admin-stat-label">{stat.label}</div><div className="admin-stat-value">{stat.value}</div><div className="admin-stat-note">{stat.note}</div></div>)}</section>
    <div className="admin-dashboard-grid">
      <section className="admin-card admin-recent-card"><div className="admin-section-heading"><div><h2 className="admin-card-title">آخرین مقاله‌ها</h2><p>آخرین محتواهای اضافه‌شده به سایت</p></div><Link to="/admin/articles">مشاهده همه ←</Link></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>عنوان مقاله</th><th>نویسنده</th><th>وضعیت</th><th>تاریخ</th></tr></thead><tbody>{recent.length ? recent.map(article => <tr key={article.id}><td className="admin-table-title">{article.title}</td><td>{article.author || '—'}</td><td><span className={`admin-status ${article.status === 'published' ? 'published' : 'draft'}`}>{article.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}</span></td><td>{article.date || '—'}</td></tr>) : <tr><td colSpan="4" className="admin-table-empty">هنوز مقاله‌ای برای نمایش وجود ندارد.</td></tr>}</tbody></table></div>
      </section>
      <section className="admin-card admin-quick-card"><h2 className="admin-card-title">دسترسی سریع</h2><p className="admin-muted">کارهای پرکاربرد پنل</p><div className="admin-quick-links"><Link to="/admin/articles/new"><span className="quick-icon violet">＋</span><span><strong>نوشتن مقاله جدید</strong><small>ایجاد و انتشار محتوای تازه</small></span><b>←</b></Link><Link to="/admin/movies"><span className="quick-icon blue">▣</span><span><strong>انتخاب فیلم ویژه</strong><small>مدیریت آثار صفحه اصلی</small></span><b>←</b></Link><Link to="/admin/comments"><span className="quick-icon orange">☷</span><span><strong>بررسی دیدگاه‌ها</strong><small>مدیریت بازخورد کاربران</small></span><b>←</b></Link><Link to="/admin/users"><span className="quick-icon green">♙</span><span><strong>مشاهده کاربران</strong><small>بررسی حساب‌ها و نقش‌ها</small></span><b>←</b></Link></div></section>
    </div>
    <section className="admin-welcome-banner"><div><span className="admin-banner-tag">MOVIE LAND CONTROL CENTER</span><h2>همه‌چیز برای یک تجربه سینمایی بهتر</h2><p>محتوا را مدیریت کن، آثار منتخب را بچین و تجربه کاربران را بهبود بده.</p></div><div className="admin-banner-reel">▶</div></section>
  </div>
}
