import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      theme: 'light',

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        set({ user, accessToken, refreshToken })
      },

      logout: () => {
        localStorage.clear()
        set({ user: null, accessToken: null, refreshToken: null })
      },

      toggleTheme: () => set((state) => {
        const next = state.theme === 'dark' ? 'light' : 'dark'
        document.body.className = next === 'dark' ? 'dark-mode' : 'light-mode'
        return { theme: next }
      }),
    }),
    { name: 'cgms-auth' }
  )
)