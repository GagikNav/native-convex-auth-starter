import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { authClient } from '@/lib/auth-client'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

export default function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (error) {
        console.log("error", error);

        Alert.alert('Registration Failed', error.message)
      } else {
        router.replace('/')
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-4 py-8">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-3xl font-bold text-center text-foreground">
                Create an account
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground px-2">
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <View className="space-y-2">
                <Text className="text-sm font-semibold text-foreground mb-2">Name</Text>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  className="h-12"
                />
              </View>
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
                <Text className="text-sm font-semibold text-foreground mb-2">Password</Text>
                <Input
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  className="h-12"
                />
              </View>
              <View className="space-y-2">
                <Text className="text-sm font-semibold text-foreground mb-2">Confirm Password</Text>
                <Input
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  className="h-12"
                />
              </View>
              <Button
                onPress={handleRegister}
                disabled={isLoading || !name || !email || !password || !confirmPassword}
                className="w-full h-12 mt-6"
              >
                <Text className="font-semibold">{isLoading ? 'Creating account...' : 'Create account'}</Text>
              </Button>

              <View className="my-8">
                <Separator className="" />
              </View>

              {/* Social login buttons - placeholder for Better Auth social providers */}
              <View className="space-y-3 mb-2">
                <Button variant="outline" className="w-full h-12" disabled>
                  <Text className="font-medium">Continue with Google</Text>
                </Button>
                <Button variant="outline" className="w-full h-12" disabled>
                  <Text className="font-medium">Continue with Apple</Text>
                </Button>
              </View>
            </CardContent>
            <CardFooter className="justify-center pt-6 pb-6">
              <Text className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link href="/(auth)/login" asChild>
                  <Text className="text-primary font-semibold">Sign in</Text>
                </Link>
              </Text>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
