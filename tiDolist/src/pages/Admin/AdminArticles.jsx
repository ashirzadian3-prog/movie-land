import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './AdminPages.css'

const emptyArticle = { title: '', image: '', date: new Date().toLocaleDateString('fa-IR'), readingtime: '5 دقیقه', author: '', textarea: '', category: 'نقد', status: 'draft' }

export function AdminArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyArticle)
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    supabase.from('articles').select('*').eq('id', id).single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError('مقاله دریافت نشد. دسترسی و اتصال دیتابیس را بررسی کن.')
        else setForm({ ...emptyArticle, ...data })
      })
      .finally(() => setLoading(false))
  }, [id])

  function change(e) { setForm(current => ({ ...current, [e.target.name]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { ...form, id: id || Date.now().toString(), updated_at: new Date().toISOString() }
    const request = id
      ? supabase.from('articles').update(payload).eq('id', id)
      : supabase.from('articles').insert(payload)
    const { error: saveError } = await request
    setSaving(false)
    if (saveError) {
      setError(saveError.message?.includes('column') ? 'ساختار جدول با پنل هماهنگ نیست؛ فایل admin-setup.sql را اجرا کن.' : 'ذخیره انجام نشد. سیاست‌های RLS و اتصال Supabase را بررسی کن.')
      return
    }
    navigate('/admin/articles', { state: { notice: id ? 'مقاله با موفقیت ویرایش شد.' : 'مقاله جدید ذخیره شد.' } })
  }

  if (loading) return <div className="admin-screen-state"><span className="admin-spinner"/>در حال دریافت مقاله...</div>

  return <div><div className="admin-page-heading"><div><div className="admin-eyebrow">CONTENT STUDIO</div><h1>{id ? 'ویرایش مقاله' : 'ایجاد مقاله جدید'}</h1><p>جزئیات مقاله را تکمیل کن و آن را به‌صورت پیش‌نویس یا منتشرشده ذخیره کن.</p></div><Link to="/admin/articles" className="admin-button">→ بازگشت به مقاله‌ها</Link></div>
    {error && <div className="admin-feedback error">{error}</div>}
    <form className="admin-card admin-article-form" onSubmit={submit}>
      <div className="admin-form-section-title"><span>01</span><div><strong>اطلاعات اصلی</strong><small>عنوان، دسته‌بندی و مشخصات مقاله</small></div></div>
      <div className="admin-form-grid"><label className="admin-field span-2"><span>عنوان مقاله *</span><input name="title" value={form.title || ''} onChange={change} placeholder="مثلاً: بررسی جهان سینمایی کریستوفر نولان" required maxLength={180}/></label>
      <label className="admin-field"><span>نام نویسنده</span><input name="author" value={form.author || ''} onChange={change} placeholder="نام نویسنده"/></label>
      <label className="admin-field"><span>دسته‌بندی</span><select name="category" value={form.category || 'نقد'} onChange={change}>{['نقد','بررسی','تحلیل','مقاله'].map(c => <option key={c}>{c}</option>)}</select></label>
      <label className="admin-field"><span>تاریخ انتشار</span><input name="date" value={form.date || ''} onChange={change} placeholder="۱۴۰۵/۰۸/۰۲"/></label>
      <label className="admin-field"><span>زمان مطالعه</span><input name="readingtime" value={form.readingtime || ''} onChange={change} placeholder="۵ دقیقه"/></label>
      <label className="admin-field span-2"><span>آدرس تصویر شاخص</span><input name="image" type="url" value={form.image || ''} onChange={change} placeholder="https://example.com/poster.jpg"/></label>
      {form.image && <div className="admin-image-preview span-2"><img src={form.image} alt="پیش‌نمایش تصویر مقاله" onError={e => { e.currentTarget.style.display = 'none' }}/><span>پیش‌نمایش تصویر شاخص</span></div>}
      </div>
      <div className="admin-form-section-title"><span>02</span><div><strong>متن مقاله</strong><small>متن کامل محتوایی که در سایت نمایش داده می‌شود</small></div></div>
      <label className="admin-field"><span>متن و توضیحات *</span><textarea name="textarea" value={form.textarea || ''} onChange={change} placeholder="متن مقاله را اینجا بنویس..." required rows={12}/></label>
      <div className="admin-form-bottom"><label className="admin-field admin-status-select"><span>وضعیت انتشار</span><select name="status" value={form.status || 'draft'} onChange={change}><option value="draft">پیش‌نویس</option><option value="published">انتشار در سایت</option></select></label><div className="admin-form-actions"><button type="button" className="admin-button" onClick={() => navigate('/admin/articles')}>انصراف</button><button type="submit" className="admin-button primary" disabled={saving}>{saving ? 'در حال ذخیره...' : 'ذخیره مقاله'}</button></div></div>
    </form>
  </div>
}

export default function AdminArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function loadArticles() {
    setLoading(true)
    const { data, error: loadError } = await supabase.from('articles').select('*').order('date', { ascending: false })
    if (loadError) setError('دریافت مقاله‌ها ناموفق بود. اتصال Supabase و ساختار جدول را بررسی کن.')
    else { setArticles(data || []); setError('') }
    setLoading(false)
  }
  useEffect(() => { loadArticles() }, [])

  const filtered = useMemo(() => articles.filter(a => `${a.title || ''} ${a.author || ''}`.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || (a.status || 'published') === status)), [articles, search, status])

  async function deleteArticle(article) {
    if (!window.confirm(`مقاله «${article.title}» حذف شود؟ این کار قابل بازگشت نیست.`)) return
    const { error: deleteError } = await supabase.from('articles').delete().eq('id', article.id)
    if (deleteError) setError('حذف انجام نشد. مجوز مدیر و سیاست‌های RLS را بررسی کن.')
    else { setNotice('مقاله حذف شد.'); loadArticles() }
  }
  async function toggleStatus(article) {
    const nextStatus = (article.status || 'published') === 'published' ? 'draft' : 'published'
    const { error: updateError } = await supabase.from('articles').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', article.id)
    if (updateError) setError('تغییر وضعیت انجام نشد. فایل SQL راه‌اندازی پنل را اجرا کن.')
    else { setNotice(nextStatus === 'published' ? 'مقاله منتشر شد.' : 'مقاله به پیش‌نویس تبدیل شد.'); loadArticles() }
  }

  return <div><div className="admin-page-heading"><div><div className="admin-eyebrow">CONTENT STUDIO</div><h1>مدیریت مقاله‌ها</h1><p>مقاله‌های Movie Land را ایجاد، ویرایش، منتشر یا به‌صورت پیش‌نویس نگه دار.</p></div><button className="admin-button primary" onClick={() => navigate('/admin/articles/new')}>＋ افزودن مقاله</button></div>
    {notice && <div className="admin-feedback success">{notice}<button onClick={() => setNotice('')}> × </button></div>}{error && <div className="admin-feedback error">{error}</div>}
    <section className="admin-card"><div className="admin-articles-toolbar"><div className="admin-articles-count"><strong>{articles.length}</strong><span>مقاله در کتابخانه</span></div><div className="admin-toolbar"><input className="admin-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="جست‌وجوی عنوان یا نویسنده..."/><select className="admin-search admin-filter" value={status} onChange={e => setStatus(e.target.value)}><option value="all">همه وضعیت‌ها</option><option value="published">منتشرشده</option><option value="draft">پیش‌نویس</option></select><button className="admin-button" onClick={loadArticles}>↻ تازه‌سازی</button></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>مقاله</th><th>دسته‌بندی</th><th>نویسنده</th><th>تاریخ</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="admin-table-empty">در حال دریافت مقاله‌ها...</td></tr> : filtered.length ? filtered.map(article => <tr key={article.id}><td><div className="admin-article-cell">{article.image ? <img src={article.image} alt="" onError={e => e.currentTarget.style.display='none'}/> : <div className="admin-article-placeholder">▶</div>}<div><strong>{article.title}</strong><small>شناسه: {article.id}</small></div></div></td><td>{article.category || '—'}</td><td>{article.author || '—'}</td><td>{article.date || '—'}</td><td><span className={`admin-status ${(article.status || 'published') === 'published' ? 'published' : 'draft'}`}>{(article.status || 'published') === 'published' ? 'منتشرشده' : 'پیش‌نویس'}</span></td><td><div className="admin-row-actions"><button title="ویرایش" onClick={() => navigate(`/admin/articles/${article.id}/edit`)}>✎</button><button title={(article.status || 'published') === 'published' ? 'تبدیل به پیش‌نویس' : 'انتشار'} onClick={() => toggleStatus(article)}>◷</button><button title="حذف" className="delete" onClick={() => deleteArticle(article)}>⌫</button></div></td></tr>) : <tr><td colSpan="6" className="admin-table-empty">مقاله‌ای با این مشخصات پیدا نشد.</td></tr>}</tbody></table></div>
    </section>
  </div>
}
