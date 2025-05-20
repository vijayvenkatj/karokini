import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

interface AuthStore {
  user: any
  setUser: (user: any) => void
  init: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => {
  const supabase = createClient()

  // Auth change subscription must be outside to persist across renders
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null })
  })

  return {
    user: null,
    setUser: (user) => set({ user }),
    init: async () => {
      const { data } = await supabase.auth.getUser()
      set({ user: data.user })
    },
  }
})
