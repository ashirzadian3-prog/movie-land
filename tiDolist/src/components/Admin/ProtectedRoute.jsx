import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function ProtectedRoute() {
  const { session, isAdmin, loading, error } = useAdminAuth()
  const location = useLocation()

  if (loading) return <div className="admin-screen-state"><span className="admin-spinner" />در حال بررسی دسترسی...</div>
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location }} />
  if (!isAdmin) return <div className="admin-screen-state"><div className="admin-state-icon">🔒</div><h2>دسترسی مدیر تأیید نشد</h2><p>{error || 'این حساب کاربری نقش مدیر ندارد. از مدیر اصلی بخواه نقش حساب را در Supabase به admin تغییر دهد.'}</p><button className="admin-button primary" onClick={() => window.location.href = '/admin/login'}>بازگشت به ورود</button></div>
  return <Outlet />
}
