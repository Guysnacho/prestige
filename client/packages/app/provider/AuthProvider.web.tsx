import { Session } from '@supabase/supabase-js'
import { Dispatch, SetStateAction, createContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '../util/components'

interface IAuthContext {
  session: Session | null
  setSession: Dispatch<SetStateAction<IAuthContext['session']>>
}

export const AuthContext = createContext<IAuthContext | null>(null)

export const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)

  const value = useMemo(() => ({ session, setSession }), [session])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
