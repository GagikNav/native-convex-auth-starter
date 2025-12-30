import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Text, View } from 'react-native'

export default function Index() {
  const health = useQuery(api.health.check)
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
    </View>
  )
}
