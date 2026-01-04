# Mock Authentication Flow Planning

## Overview

This document outlines the plan for scaffolding mock authentication screens and routes using React Native Reusables' authentication blocks for the Native Convex Auth Starter project.

---

## Folder Structure

```
app/
├── (auth)/                      # Auth route group (layout handles auth-specific navigation)
│   ├── _layout.tsx              # Auth layout (no header, centered content)
│   ├── login.tsx                # Login screen
│   ├── register.tsx             # Register screen
│   └── forgot-password.tsx      # Forgot password screen
├── _layout.tsx                  # Root layout (existing)
└── index.tsx                    # Home screen (existing)

components/
└── ui/                          # React Native Reusables UI components
    ├── button.tsx               # (to install via CLI)
    ├── input.tsx                # (to install via CLI)
    ├── text.tsx                 # (to install via CLI)
    ├── card.tsx                 # (to install via CLI)
    └── separator.tsx            # (to install via CLI)

lib/
├── stores/
│   └── auth.ts                  # Auth store (existing - will be used for mock auth)
└── auth-client.ts               # Better Auth client setup (placeholder for future)
```

---

## Routes and Screens

| Route | File | Description |
|-------|------|-------------|
| `/(auth)/login` | `app/(auth)/login.tsx` | Login screen with email/password |
| `/(auth)/register` | `app/(auth)/register.tsx` | Registration screen with name/email/password |
| `/(auth)/forgot-password` | `app/(auth)/forgot-password.tsx` | Password recovery screen |

---

## React Native Reusables Components Needed

Install via CLI:
```bash
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add input
npx @react-native-reusables/cli@latest add text
npx @react-native-reusables/cli@latest add card
npx @react-native-reusables/cli@latest add separator
```

---

## Code Snippets

### 1. Auth Layout (`app/(auth)/_layout.tsx`)

```tsx
import { Stack } from 'expo-router'
import { View } from 'react-native'

export default function AuthLayout() {
  return (
    <View className="flex-1 bg-background">
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
    </View>
  )
}
```

### 2. Login Screen (`app/(auth)/login.tsx`)

```tsx
import { useState } from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/lib/stores'

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
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <View className="space-y-2">
                <Text className="text-sm font-medium text-foreground">Email</Text>
                <Input
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-foreground">Password</Text>
                  <Link href="/(auth)/forgot-password" asChild>
                    <Text className="text-sm text-primary">Forgot password?</Text>
                  </Link>
                </View>
                <Input
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
              <Button
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full"
              >
                <Text>{isLoading ? 'Signing in...' : 'Sign in'}</Text>
              </Button>
              
              <Separator className="my-4" />
              
              {/* Social login buttons - placeholder for Better Auth social providers */}
              <Button variant="outline" className="w-full" disabled>
                <Text>Continue with Google</Text>
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Text>Continue with Apple</Text>
              </Button>
            </CardContent>
            <CardFooter className="justify-center">
              <Text className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/(auth)/register" asChild>
                  <Text className="text-primary font-medium">Sign up</Text>
                </Link>
              </Text>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
```

### 3. Register Screen (`app/(auth)/register.tsx`)

```tsx
... (similar structure to LoginScreen, with fields for name, email, password, and confirm password)
```

### 4. Forgot Password Screen (`app/(auth)/forgot-password.tsx`)

```tsx
... (similar structure to LoginScreen, with a single email field and reset link logic)
```

### 5. Better Auth Client Placeholder (`lib/auth-client.ts`)

```tsx
... (mock implementation for Better Auth client, ready for future integration)
```

---

## Styling Guidelines

### NativeWind & Semantic Tokens

All screens use the project's established semantic color tokens:

| Token | Usage |
|-------|-------|
| `bg-background` | Main screen background |
| `text-foreground` | Primary text color |
| `text-muted-foreground` | Secondary/helper text |
| `text-primary` | Links and accent text |
| `text-destructive` | Error messages |
| `border-border` | Input borders, separators |
| `bg-primary` | Primary button background |

### Component Styling Patterns

- Use `className` prop for all styling (NativeWind)
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Apply `KeyboardAvoidingView` for screens with inputs
- Use `ScrollView` with `keyboardShouldPersistTaps="handled"` for form screens
- Center auth cards using `flex-1 justify-center` on container

---

## Better Auth Integration Notes

When integrating with Better Auth, make the following changes:

1. **Install Better Auth packages:**
   ```bash
   bun add better-auth @better-auth/expo expo-secure-store expo-linking expo-web-browser expo-constants
   ```

2. **Configure metro bundler** (`metro.config.js`):
   ```js
   config.resolver.unstable_enablePackageExports = true;
   ```

3. **Update `app.json`** - ensure scheme is defined:
   ```json
   {
     "expo": {
       "scheme": "native-convex-auth"
     }
   }
   ```

4. **Create auth server** (if using Expo API routes):
   ```ts
   // app/api/auth/[...auth]+api.ts
   import { auth } from '@/lib/auth'
   const handler = auth.handler
   export { handler as GET, handler as POST }
   ```

5. **Replace mock auth in screens** with `authClient.signIn.email()`, `authClient.signUp.email()`, etc.

6. **Use `authClient.useSession()`** hook instead of Zustand `useAuthStore` for session management

---

## Implementation Checklist

- [ ] Install React Native Reusables components via CLI
- [ ] Create `app/(auth)/_layout.tsx`
- [ ] Create `app/(auth)/login.tsx`
- [ ] Create `app/(auth)/register.tsx`
- [ ] Create `app/(auth)/forgot-password.tsx`
- [ ] Create `lib/auth-client.ts` placeholder
- [ ] Update root layout to handle auth routes
- [ ] Test navigation between auth screens
- [ ] Test mock authentication flow

---

## Success Criteria

✅ Clear folder structure under `app/(auth)/`  
✅ Routes defined using Expo Router conventions  
✅ UI components from React Native Reusables  
✅ Styling uses NativeWind with semantic tokens  
✅ Mock authentication stores state in Zustand  
✅ Ready for Better Auth integration with clear TODO markers