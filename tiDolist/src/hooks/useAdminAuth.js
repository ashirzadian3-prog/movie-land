import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAdminAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let subscription

    async function loadSession() {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!active) return
      if (sessionError) setError(sessionError.message)
      setSession(data?.session ?? null)
      if (data?.session?.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', data.session.user.id)
          .maybeSingle()
        if (!active) return
        if (profileError) setError('جدول profiles یا دسترسی آن آماده نیست. فایل admin-setup.sql را اجرا کن.')
        setProfile(userProfile ?? null)
      }
      setLoading(false)
    }

    loadSession()
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) {
        setProfile(null)
        setLoading(false)
      } else {
        setLoading(true)
        supabase.from('profiles').select('id, full_name, role').eq('id', nextSession.user.id).maybeSingle()
          .then(({ data: nextProfile, error: profileError }) => {
            if (!active) return
            setProfile(nextProfile ?? null)
            if (profileError) setError('جدول profiles یا دسترسی آن آماده نیست. فایل admin-setup.sql را اجرا کن.')
            setLoading(false)
          })
      }
    })
    subscription = data.subscription

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  return { session, profile, loading, error, isAdmin: profile?.role === 'admin' }
}
