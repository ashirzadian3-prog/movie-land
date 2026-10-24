import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { CATEGORIES } from './constants'

const EMPTY = {
    title: '',
    author: '',
    date: '',
    category: CATEGORIES[0],
    readingtime: '',
    image: '',
    textarea: '',
    views: 0,
}

// Used for both /admin/articles/new and /admin/articles/:id
function ArticleForm() {
    const { id } = useParams()
    const isNew = !id
    const navigate = useNavigate()

    const [form, setForm] = useState(EMPTY)
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isNew) return
        supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .maybeSingle()
            .then(({ data, error }) => {
                if (error || !data) setError('مقاله پیدا نشد.')
                else setForm({ ...EMPTY, ...data })
                setLoading(false)
            })
    }, [id, isNew])

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: name === 'views' ? Number(value) || 0 : value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError('')

        const payload = {
            title: form.title,
            author: form.author,
            date: form.date,
            category: form.category,
            readingtime: form.readingtime,
            image: form.image,
            textarea: form.textarea,
            views: form.views,
        }

        const { error } = isNew
            ? await supabase.from('articles').insert([{ id: Date.now().toString(), ...payload }])
            : await supabase.from('articles').update(payload).eq('id', id)

        setSaving(false)
        if (error) {
            setError('ذخیره انجام نشد. دسترسی مدیر را بررسی کنید.')
            return
        }
        navigate('/admin/articles')
    }

    if (loading) return <p>در حال بارگذاری...</p>

    return (
        <>
            <h1 className="adm-title">{isNew ? 'مقاله جدید' : 'ویرایش مقاله'}</h1>

            <form className="adm-form" onSubmit={handleSubmit}>
                <div className="adm-field adm-span-2">
                    <label htmlFor="title">عنوان</label>
                    <input id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>

                <div className="adm-field">
                    <label htmlFor="author">نویسنده</label>
                    <input id="author" name="author" value={form.author} onChange={handleChange} required />
                </div>

                <div className="adm-field">
                    <label htmlFor="date">تاریخ</label>
                    <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
                </div>

                <div className="adm-field">
                    <label htmlFor="category">دسته‌بندی</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="adm-field">
                    <label htmlFor="readingtime">زمان مطالعه</label>
                    <input id="readingtime" name="readingtime" value={form.readingtime} onChange={handleChange} placeholder="مثلاً 5 دقیقه" />
                </div>

                <div className="adm-field adm-span-2">
                    <label htmlFor="image">لینک تصویر</label>
                    <input id="image" name="image" dir="ltr" value={form.image} onChange={handleChange} placeholder="https://..." />
                    {form.image && form.image.length < 2000 && (
                        <img className="adm-preview" src={form.image} alt="پیش‌نمایش" />
                    )}
                </div>

                {!isNew && (
                    <div className="adm-field">
                        <label htmlFor="views">بازدید</label>
                        <input id="views" name="views" type="number" min="0" value={form.views} onChange={handleChange} />
                    </div>
                )}

                <div className="adm-field adm-span-2">
                    <label htmlFor="textarea">متن مقاله</label>
                    <textarea id="textarea" name="textarea" rows="12" value={form.textarea} onChange={handleChange} />
                </div>

                {error && <div className="adm-error adm-span-2">{error}</div>}

                <div className="adm-span-2 adm-row-start">
                    <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                        {saving ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button type="button" className="adm-btn" onClick={() => navigate('/admin/articles')}>انصراف</button>
                </div>
            </form>
        </>
    )
}

export default ArticleForm
