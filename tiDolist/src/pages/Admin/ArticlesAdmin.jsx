import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { CATEGORIES } from './constants'

function ArticlesAdmin() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('همه')

    useEffect(() => {
        supabase
            .from('articles')
            .select('id,title,author,category,date,views,image')
            .order('date', { ascending: false })
            .then(({ data, error }) => {
                if (error) setError('خطا در دریافت مقالات.')
                else setArticles(data || [])
                setLoading(false)
            })
    }, [])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return articles.filter((a) => {
            const okCat = category === 'همه' || a.category === category
            const okSearch =
                !q ||
                (a.title || '').toLowerCase().includes(q) ||
                (a.author || '').toLowerCase().includes(q)
            return okCat && okSearch
        })
    }, [articles, search, category])

    async function handleDelete(article) {
        if (!window.confirm(`مقاله «${article.title}» حذف شود؟ این کار قابل بازگشت نیست.`)) return

        const { error } = await supabase.from('articles').delete().eq('id', article.id)
        if (error) {
            setError('حذف انجام نشد. دسترسی مدیر را بررسی کنید.')
            return
        }
        setArticles((prev) => prev.filter((a) => a.id !== article.id))
    }

    return (
        <>
            <div className="adm-row">
                <h1 className="adm-title">مقالات</h1>
                <Link to="/admin/articles/new" className="adm-btn adm-btn-primary">+ مقاله جدید</Link>
            </div>

            <div className="adm-toolbar">
                <input
                    type="search"
                    placeholder="جستجو در عنوان یا نویسنده..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="همه">همه دسته‌ها</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading ? <p>در حال بارگذاری...</p> : (
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>عنوان</th>
                                <th>نویسنده</th>
                                <th>دسته</th>
                                <th>تاریخ</th>
                                <th>بازدید</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan="6" className="adm-empty">مقاله‌ای پیدا نشد.</td></tr>
                            )}
                            {filtered.map((a) => (
                                <tr key={a.id}>
                                    <td className="adm-cell-title">{a.title}</td>
                                    <td>{a.author}</td>
                                    <td><span className="adm-tag">{a.category}</span></td>
                                    <td>{a.date}</td>
                                    <td>{(a.views || 0).toLocaleString('fa-IR')}</td>
                                    <td className="adm-actions">
                                        <Link to={`/Articlepage/${a.id}`} target="_blank">مشاهده</Link>
                                        <Link to={`/admin/articles/${a.id}`}>ویرایش</Link>
                                        <button className="adm-danger" onClick={() => handleDelete(a)}>حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default ArticlesAdmin
