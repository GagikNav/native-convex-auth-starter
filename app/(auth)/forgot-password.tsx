import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleResetPassword = async () => {
    setIsLoading(true)

    // Mock password reset - replace with Better Auth integration
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
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
                Reset password
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground px-2">
                {isSubmitted
                  ? 'Check your email for a reset link'
                  : 'Enter your email to receive a reset link'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              {!isSubmitted ? (
                <>
                  <View className="space-y-2 mb-2">
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
                  <Button
                    onPress={handleResetPassword}
                    disabled={isLoading || !email}
                    className="w-full h-12 mt-6"
                  >
                    <Text className="font-semibold">{isLoading ? 'Sending link...' : 'Send reset link'}</Text>
                  </Button>
                </>
              ) : (
                <Button
                  onPress={() => router.replace('/(auth)/login')}
                  className="w-full h-12 mt-4"
                >
                  <Text className="font-semibold">Back to login</Text>
                </Button>
              )}
            </CardContent>
            <CardFooter className="justify-center pt-6 pb-6">
              <Link href="/(auth)/login" asChild>
                <Text className="text-sm text-muted-foreground text-center">
                  Remember your password?{' '}
                  <Text className="text-primary font-semibold">Sign in</Text>
                </Text>
              </Link>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
