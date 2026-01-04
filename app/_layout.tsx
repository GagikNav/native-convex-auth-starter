
import { PortalHost } from '@rn-primitives/portal'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
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
      <ConvexProvider client={convex}>
        <Stack>
          <Stack.Screen name='index' />
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </ConvexProvider>
    </SafeAreaProvider>
  )
}
