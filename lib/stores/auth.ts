import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

/**
 * Zustand store for managing authentication state with persistence.
 *
 * This store handles client-side authentication state including user info
 * and session status. It persists to AsyncStorage for offline access.
 *
 * NOTE: This is a scaffold for future authentication implementation.
 * Integrate with Convex authentication when implementing auth flows.
 *
 * @example
 * ```tsx
 * import { useAuthStore } from '@/lib/stores'
 *
 * function Profile() {
 *   const { user, isAuthenticated, logout } = useAuthStore()
 *
 *   if (!isAuthenticated) {
 *     return <Text>Please log in</Text>
 *   }
 *
 *   return (
 *     <View>
 *       <Text>Welcome, {user?.name}</Text>
 *       <Button onPress={logout}>Logout</Button>
 *     </View>
 *   )
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
