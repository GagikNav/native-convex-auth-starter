import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { authClient } from '@/lib/auth-client'
import '@/styles/global.css'
import { useQuery } from 'convex/react'
import { Redirect, useRouter } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'

export default function Index() {
  const health = useQuery(api.health.check)
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  // Show loading while session is being fetched
  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  // Redirect to login if no session
  if (!session) {
    return <Redirect href="/(auth)/login" />
  }

  const handleLogout = async () => {
    await authClient.signOut()
    router.replace('/(auth)/login')
  }

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-1 items-center justify-center space-y-4">
        <View className="flex-row items-center gap-2">
          <View
            className={`h-4 w-4 rounded-full ${
              health ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <Text className="text-xl font-bold">
            {health ? 'Convex Connected' : 'Connecting to Convex...'}
          </Text>
        </View>

        {session.user && (
          <View className="items-center space-y-2 mt-10">
            <Text className="text-lg text-foreground">
              Welcome, {session.user.name}!
            </Text>
            <Text className="text-sm text-muted-foreground">
              {session.user.email}
            </Text>
          </View>
        )}

        <Button onPress={handleLogout} variant="outline" className="mt-8">
          <Text>Sign Out</Text>
        </Button>
      </View>
    </View>
  )
}
