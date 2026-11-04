import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import './AdminPages.css'

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185'

export default function AdminMovies() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('movie')
  const [results, setResults] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadFeatured() {
    const { data, error: loadError } = await supabase.from('featured_media').select('*').order('position', { ascending: true })
    if (loadError) setError('برای ذخیره آثار منتخب، جدول featured_media را با فایل admin-setup.sql ایجاد کن.')
    else setFeatured(data || [])
  }
  useEffect(() => { loadFeatured() }, [])

  async function searchMedia(e) {
    e.preventDefault()
    if (!query.trim()) return
    if (!TMDB_KEY) { setError('کلید TMDB تنظیم نشده است. VITE_TMDB_API_KEY را در فایل .env قرار بده و سرور را دوباره اجرا کن.'); return }
    setLoading(true); setError(''); setNotice('')
    try {
      const endpoint = type === 'movie' ? 'search/movie' : 'search/tv'
      const response = await fetch(`${TMDB_BASE}/${endpoint}?api_key=${TMDB_KEY}&language=fa-IR&query=${encodeURIComponent(query)}&include_adult=false`)
      if (!response.ok) throw new Error('TMDB request failed')
      const data = await response.json()
      setResults((data.results || []).map(item => ({ ...item, media_type: type })))
      if (!data.results?.length) setNotice('نتیجه‌ای پیدا نشد. نام انگلیسی اثر را هم امتحان کن.')
    } catch { setError('جست‌وجو در TMDB ناموفق بود. اتصال اینترنت و کلید API را بررسی کن.') }
    finally { setLoading(false) }
  }

  async function addFeatured(item) {
    if (featured.some(f => String(f.tmdb_id) === String(item.id) && f.media_type === type)) { setNotice('این اثر از قبل در فهرست منتخب است.'); return }
    const payload = { tmdb_id: item.id, media_type: type, title: item.title || item.name || '', poster_path: item.poster_path, overview: item.overview || '', vote_average: item.vote_average || 0, release_date: item.release_date || item.first_air_date || '', position: featured.length + 1 }
    const { error: insertError } = await supabase.from('featured_media').insert(payload)
    if (insertError) setError('ذخیره اثر انجام نشد. جدول و مجوزهای RLS را بررسی کن.')
    else { setNotice('اثر به فهرست منتخب اضافه شد.'); loadFeatured() }
  }
  async function removeFeatured(item) {
    if (!window.confirm(`«${item.title}» از فهرست منتخب حذف شود؟`)) return
    const { error: deleteError } = await supabase.from('featured_media').delete().eq('id', item.id)
    if (deleteError) setError('حذف انجام نشد. مجوز مدیر را بررسی کن.')
    else { setNotice('اثر از فهرست منتخب حذف شد.'); loadFeatured() }
  }

  return <div><div className="admin-page-heading"><div><div className="admin-eyebrow">TMDB LIBRARY</div><h1>مدیریت فیلم و سریال</h1><p>از TMDB جست‌وجو کن و آثار دلخواه را به فهرست منتخب Movie Land اضافه کن.</p></div><span className="admin-tmdb-badge">Powered by TMDB</span></div>
    {error && <div className="admin-feedback error">{error}</div>}{notice && <div className="admin-feedback success">{notice}</div>}
    <section className="admin-card admin-tmdb-search-card"><div className="admin-section-heading"><div><h2 className="admin-card-title">جست‌وجوی آثار</h2><p>نام فیلم یا سریال را وارد کن؛ برای نتیجه بهتر نام انگلیسی را هم امتحان کن.</p></div></div><form className="admin-tmdb-form" onSubmit={searchMedia}><div className="admin-type-switch"><button type="button" className={type === 'movie' ? 'active' : ''} onClick={() => {setType('movie');setResults([])}}>فیلم سینمایی</button><button type="button" className={type === 'tv' ? 'active' : ''} onClick={() => {setType('tv');setResults([])}}>سریال</button></div><input className="admin-search" value={query} onChange={e => setQuery(e.target.value)} placeholder={type === 'movie' ? 'جست‌وجوی فیلم، مثلاً Interstellar...' : 'جست‌وجوی سریال، مثلاً Dark...'} /><button className="admin-button primary" disabled={loading}>{loading ? 'در حال جست‌وجو...' : '⌕ جست‌وجو'}</button></form>
      {results.length > 0 && <div className="admin-media-grid">{results.map(item => <article className="admin-media-result" key={`${type}-${item.id}`}>{item.poster_path ? <img className="admin-media-poster" src={`${IMAGE_BASE}${item.poster_path}`} alt={item.title || item.name} loading="lazy"/> : <div className="admin-media-poster poster-empty">بدون پوستر</div>}<div className="admin-media-info"><strong>{item.title || item.name}</strong><small>{(item.release_date || item.first_air_date || '').slice(0,4) || 'سال نامشخص'} · ★ {Number(item.vote_average || 0).toFixed(1)}</small><p>{item.overview || 'خلاصه‌ای برای این اثر ثبت نشده است.'}</p><button className="admin-button primary" onClick={() => addFeatured(item)}>＋ افزودن به منتخب</button></div></article>)}</div>}
    </section>
    <section className="admin-card admin-featured-section"><div className="admin-section-heading"><div><h2 className="admin-card-title">آثار منتخب سایت</h2><p>این فهرست در دیتابیس ذخیره می‌شود؛ حذف از اینجا اطلاعات TMDB را حذف نمی‌کند.</p></div><span className="admin-count-pill">{featured.length} اثر</span></div><div className="admin-featured-list">{featured.length ? featured.map(item => <div className="admin-featured-item" key={item.id}>{item.poster_path ? <img src={`${IMAGE_BASE}${item.poster_path}`} alt=""/> : <div className="admin-featured-no-poster">▶</div>}<div className="admin-featured-copy"><strong>{item.title}</strong><small>{item.media_type === 'tv' ? 'سریال' : 'فیلم'} · {item.release_date?.slice(0,4) || '—'} · امتیاز {Number(item.vote_average || 0).toFixed(1)}</small></div><button className="admin-button danger" onClick={() => removeFeatured(item)}>حذف از منتخب</button></div>) : <div className="admin-table-empty">هنوز اثری به فهرست منتخب اضافه نشده است.</div>}</div></section>
  </div>
}
