import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function AdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setBusy(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        setBusy(false)
        if (error) {
            setError('ایمیل یا رمز عبور اشتباه است.')
            return
        }
        navigate('/admin', { replace: true })
    }

    return (
        <div className="adm-login">
            <form className="adm-login-card" onSubmit={handleSubmit}>
                <h1>ورود مدیر</h1>
                <p>پنل مدیریت مقاله لند</p>

                <label htmlFor="adm-email">ایمیل</label>
                <input
                    id="adm-email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                />

                <label htmlFor="adm-pass">رمز عبور</label>
                <input
                    id="adm-pass"
                    type="password"
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                {error && <div className="adm-error">{error}</div>}

                <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>
                    {busy ? 'در حال ورود...' : 'ورود'}
                </button>

                <Link to="/" className="adm-link">بازگشت به سایت</Link>
            </form>
        </div>
    )
}

export default AdminLogin
