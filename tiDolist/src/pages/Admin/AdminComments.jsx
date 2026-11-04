import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import './AdminPages.css'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  async function load() {
    setLoading(true)
    const { data, error: loadError } = await supabase.from('comments').select('*').order('created_at', { ascending: false })
    if (loadError) setError('جدول دیدگاه‌ها هنوز در پروژه ایجاد نشده است. فایل admin-setup.sql را اجرا کن.')
    else { setComments(data || []); setError('') }
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  async function updateStatus(comment, status) {
    const { error: updateError } = await supabase.from('comments').update({ status }).eq('id', comment.id)
    if (updateError) setError('تغییر وضعیت دیدگاه انجام نشد؛ مجوز RLS را بررسی کن.')
    else { setNotice(status === 'approved' ? 'دیدگاه تأیید شد.' : 'دیدگاه رد شد.'); load() }
  }
  async function remove(comment) {
    if (!window.confirm('این دیدگاه حذف شود؟')) return
    const { error: removeError } = await supabase.from('comments').delete().eq('id', comment.id)
    if (removeError) setError('حذف دیدگاه انجام نشد.')
    else { setNotice('دیدگاه حذف شد.'); load() }
  }
  return <div><div className="admin-page-heading"><div><div className="admin-eyebrow">COMMUNITY MODERATION</div><h1>مدیریت دیدگاه‌ها</h1><p>دیدگاه‌های ارسالی را بررسی و محتوای نامناسب را مدیریت کن.</p></div><span className="admin-count-pill">{comments.length} دیدگاه</span></div>{error && <div className="admin-feedback error">{error}</div>}{notice && <div className="admin-feedback success">{notice}</div>}<section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>متن دیدگاه</th><th>شناسه کاربر</th><th>وضعیت</th><th>تاریخ</th><th>عملیات</th></tr></thead><tbody>{loading ? <tr><td colSpan="5" className="admin-table-empty">در حال دریافت دیدگاه‌ها...</td></tr> : comments.length ? comments.map(comment => <tr key={comment.id}><td className="admin-comment-text">{comment.content || comment.text || '—'}</td><td className="admin-id-cell">{comment.user_id || '—'}</td><td><span className={`admin-status ${comment.status === 'approved' ? 'published' : comment.status === 'rejected' ? 'draft' : 'pending'}`}>{comment.status === 'approved' ? 'تأییدشده' : comment.status === 'rejected' ? 'ردشده' : 'در انتظار بررسی'}</span></td><td>{comment.created_at ? new Date(comment.created_at).toLocaleDateString('fa-IR') : '—'}</td><td><div className="admin-row-actions"><button title="تأیید" onClick={() => updateStatus(comment, 'approved')}>✓</button><button title="رد" onClick={() => updateStatus(comment, 'rejected')}>×</button><button title="حذف" className="delete" onClick={() => remove(comment)}>⌫</button></div></td></tr>) : <tr><td colSpan="5" className="admin-table-empty">دیدگاهی برای نمایش وجود ندارد.</td></tr>}</tbody></table></div></section></div>
}
