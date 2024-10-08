import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from './zustandStorage'

export interface UserState {
  id: string | undefined
  role: 'DRIVER' | 'RIDER' | 'ADMIN' | undefined
  setId: (id: string | undefined) => void
  setRole: (role: 'DRIVER' | 'RIDER' | 'ADMIN' | undefined) => void
}

/**
 * Stored User State
 *
 * @example
 * // This is how we use the user store
 * const store = useStore(useUserStore, (store) => store);
 */
export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      id: undefined,
      role: undefined,
      setId: (id) => set(() => ({ id })),
      setRole: (role) => set(() => ({ role })),
    }),
    {
      name: 'dp-user-store',
      storage: createJSONStorage(() => {
        return zustandStorage
      }),
    }
  )
)
