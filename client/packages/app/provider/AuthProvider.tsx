import { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { Dispatch, SetStateAction, createContext, useEffect, useMemo, useState } from 'react'
import Radar from 'react-native-radar'
import useStore from '../store/useStore'
import { UserState, useUserStore } from '../store/userStore'
import { createClient } from '../util/components'
import { Database } from '../util/schema'

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
      } else hydrateUser(supabase, session, store)
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

function hydrateUser(
  supabase: SupabaseClient<Database>,
  session: Session,
  store: UserState | undefined
) {
  supabase
    .from('member')
    .select('id, fname, lname, type')
    .eq('id', session.user.id)
    .single()
    .then(({ data, error, statusText }) => {
      if (error) {
        console.debug('Issue fetching user')
        console.debug(statusText)
      } else {
        Radar.setUserId(session.user.id)
        Radar.setMetadata({ role: data.type })
        store?.setId(session.user.id)
        store?.setName(data.fname + ' ' + data.lname)
        store?.setRole(data.type)
      }
    })
}
