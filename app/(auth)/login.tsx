import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { useAuthStore } from '@/lib/stores'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const handleLogin = async () => {
    setIsLoading(true)

    // Mock authentication - replace with Better Auth integration
    setTimeout(() => {
      login({
        id: '1',
        name: 'Test User',
        email: email,
      })
      setIsLoading(false)
      router.replace('/')
    }, 1000)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-4 py-8">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-3xl font-bold text-center text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground px-2">
                Enter your credentials to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <View className="space-y-2">
                <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
                <Input
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="h-12"
                />
              </View>
              <View className="space-y-2">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-foreground">Password</Text>
                  <Link href="/(auth)/forgot-password" asChild>
                    <Text className="text-sm text-primary font-medium">Forgot password?</Text>
                  </Link>
                </View>
                <Input
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  className="h-12"
                />
              </View>
              <Button
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full h-12 mt-6"
              >
                <Text className="font-semibold">{isLoading ? 'Signing in...' : 'Sign in'}</Text>
              </Button>

              <View className="my-8">
                <Separator className="" />
              </View>

              {/* Social login buttons - placeholder for Better Auth social providers */}
              <View className="space-y-3 mb-5">
                <Button variant="outline" className="w-full h-12 mb-4" disabled>
                  <Text className="font-medium">Continue with Google</Text>
                </Button>
                <Button variant="outline" className="w-full h-12" disabled>
                  <Text className="font-medium">Continue with Apple</Text>
                </Button>
              </View>
            </CardContent>
            <CardFooter className="justify-center pt-6 pb-6">
              <Text className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Link href="/(auth)/register" asChild>
                  <Text className="text-primary font-semibold">Sign up</Text>
                </Link>
              </Text>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
