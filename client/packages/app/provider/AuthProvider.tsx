import { Session, User } from '@supabase/supabase-js'
import { Dispatch, SetStateAction, createContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '../util/components'
import useStore from '../util/useStore'
import { UserState, useUserStore } from '../util/userStore'

interface IAuthContext {
  session: Session | null
  setSession: Dispatch<SetStateAction<IAuthContext['session']>>
  user: User | null
  setUser: Dispatch<SetStateAction<IAuthContext['user']>>
}

/**
 * Auth Provider to pass Supabase user all the way down to children. Also updates stored user id
 * @param props
 * @returns
 */
export const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const store = useStore(useUserStore, (store) => store)

  const value = useMemo(() => ({ session, setSession, user, setUser }), [session, user])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session === null) {
        clearAuth(setUser, store)
      }
    })
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const AuthContext = createContext<IAuthContext | null>(null)

/**
 * Clear stored auth
 * @param setUser
 * @param store
 */
const clearAuth = (
  setUser: Dispatch<SetStateAction<User | null>>,
  store: UserState | undefined
) => {
  setUser(null)
  store?.setId(undefined)
  store?.setRole(undefined)
}
