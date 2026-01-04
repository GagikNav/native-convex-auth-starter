import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/**
 * Zustand store for managing theme state with persistence.
 *
 * The theme setting is persisted to AsyncStorage and will survive app restarts.
 * Default theme is 'system' which follows the device's color scheme.
 *
 * @example
 * ```tsx
 * import { useThemeStore } from '@/lib/stores'
 *
 * function ThemeToggle() {
 *   const { theme, setTheme } = useThemeStore()
 *   return (
 *     <Button onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
 *       Toggle Theme
 *     </Button>
 *   )
 * }
 * ```
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
