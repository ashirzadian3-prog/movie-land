import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import { adminSignOut, useAdminAuth } from './useAdminAuth'
import './Admin.css'

function AdminLayout() {
    const { status, user } = useAdminAuth()

    if (status === 'loading') {
        return <div className="adm-center">در حال بررسی دسترسی...</div>
    }

    if (status === 'signed-out') {
        return <Navigate to="/admin/login" replace />
    }

    if (status === 'forbidden') {
        return (
            <div className="adm-center">
                <h2>دسترسی ندارید</h2>
                <p>این حساب کاربری مدیر نیست.</p>
                <button className="adm-btn" onClick={adminSignOut}>خروج</button>
                <Link to="/" className="adm-link">بازگشت به سایت</Link>
            </div>
        )
    }

    return (
        <div className="adm-shell">
            <aside className="adm-sidebar">
                <div className="adm-brand">مقاله لند <span>مدیریت</span></div>

                <nav>
                    <NavLink to="/admin" end>داشبورد</NavLink>
                    <NavLink to="/admin/articles">مقالات</NavLink>
                    <NavLink to="/admin/articles/new">مقاله جدید</NavLink>
                </nav>

                <div className="adm-sidebar-foot">
                    <small dir="ltr">{user?.email}</small>
                    <Link to="/" className="adm-link">مشاهده سایت</Link>
                    <button className="adm-btn" onClick={adminSignOut}>خروج</button>
                </div>
            </aside>

            <main className="adm-main">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
