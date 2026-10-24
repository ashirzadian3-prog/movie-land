import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { CATEGORIES } from './constants'

function Dashboard() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        supabase
            .from('articles')
            .select('id,title,category,views,date,author')
            .then(({ data, error }) => {
                if (error) setError('خطا در دریافت اطلاعات.')
                else setArticles(data || [])
                setLoading(false)
            })
    }, [])

    const stats = useMemo(() => {
        const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0)
        const byCategory = CATEGORIES.map((c) => ({
            name: c,
            count: articles.filter((a) => a.category === c).length,
        }))
        const max = Math.max(1, ...byCategory.map((c) => c.count))
        const top = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
        const authors = new Set(articles.map((a) => a.author).filter(Boolean)).size
        return { totalViews, byCategory, max, top, authors }
    }, [articles])

    if (loading) return <p>در حال بارگذاری...</p>
    if (error) return <div className="adm-error">{error}</div>

    return (
        <>
            <h1 className="adm-title">داشبورد</h1>

            <div className="adm-cards">
                <div className="adm-card"><span>تعداد مقالات</span><strong>{articles.length}</strong></div>
                <div className="adm-card"><span>مجموع بازدید</span><strong>{stats.totalViews.toLocaleString('fa-IR')}</strong></div>
                <div className="adm-card"><span>تعداد نویسندگان</span><strong>{stats.authors}</strong></div>
            </div>

            <div className="adm-grid-2">
                <section className="adm-panel">
                    <h2>مقالات بر اساس دسته‌بندی</h2>
                    {stats.byCategory.map((c) => (
                        <div className="adm-bar-row" key={c.name}>
                            <span>{c.name}</span>
                            <div className="adm-bar"><i style={{ width: `${(c.count / stats.max) * 100}%` }} /></div>
                            <b>{c.count}</b>
                        </div>
                    ))}
                </section>

                <section className="adm-panel">
                    <h2>پربازدیدترین مقالات</h2>
                    {stats.top.length === 0 && <p>هنوز مقاله‌ای ثبت نشده.</p>}
                    <ol className="adm-toplist">
                        {stats.top.map((a) => (
                            <li key={a.id}>
                                <Link to={`/admin/articles/${a.id}`}>{a.title}</Link>
                                <b>{(a.views || 0).toLocaleString('fa-IR')}</b>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </>
    )
}

export default Dashboard
