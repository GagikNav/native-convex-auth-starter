import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </SafeAreaView>
  )
}
