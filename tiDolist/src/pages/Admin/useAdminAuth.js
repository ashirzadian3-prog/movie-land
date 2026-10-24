import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

// status: 'loading' | 'signed-out' | 'forbidden' | 'admin'
export function useAdminAuth() {
    const [status, setStatus] = useState('loading')
    const [user, setUser] = useState(null)

    useEffect(() => {
        let active = true

        async function check(session) {
            if (!session?.user) {
                if (active) {
                    setUser(null)
                    setStatus('signed-out')
                }
                return
            }

            const { data, error } = await supabase
                .from('admins')
                .select('user_id')
                .eq('user_id', session.user.id)
                .maybeSingle()

            if (!active) return
            setUser(session.user)
            setStatus(!error && data ? 'admin' : 'forbidden')
        }

        supabase.auth.getSession().then(({ data }) => check(data.session))

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            // defer to avoid calling supabase inside the auth callback
            setTimeout(() => check(session), 0)
        })

        return () => {
            active = false
            sub.subscription.unsubscribe()
        }
    }, [])

    return { status, user }
}

export async function adminSignOut() {
    await supabase.auth.signOut()
}
