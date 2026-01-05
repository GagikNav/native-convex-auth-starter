
import { authClient } from '@/lib/auth-client'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { PortalHost } from '@rn-primitives/portal'
import { ConvexReactClient } from 'convex/react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <Stack>
          <Stack.Screen name='index' />
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </ConvexBetterAuthProvider>
    </SafeAreaProvider>
  )
}
