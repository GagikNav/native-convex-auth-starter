# Extensive Developer Overview

## Project Architecture & Tech Stack

This Native Convex Auth Starter is a modern React Native mobile app with a serverless backend, designed for rapid development of authenticated mobile applications. The stack combines proven technologies with modern patterns for optimal developer experience.

### Core Technology Choices

- **Frontend**: React Native (0.81.5) with Expo SDK 54 for cross-platform mobile development
- **Routing**: Expo Router v6 (file-based routing) for type-safe navigation
- **UI Components**: React Native Reusables (https://reactnativereusables.com/) - Priority library for all UI components
- **Styling**: NativeWind v4 (Tailwind CSS for React Native) with CSS variables for semantic theming
- **State Management**: Zustand v5 (client-side state) + Convex queries (server-state with real-time updates)
- **Backend**: Convex (reactive serverless backend) with real-time subscriptions
- **Type Safety**: TypeScript strict mode with auto-generated types from Convex
- **Package Manager**: Bun (configured but npm/yarn compatible)

### Architecture Rationale

**File-based routing**: Simplifies navigation logic and provides automatic type generation for routes.

**Dual state strategy**: Zustand handles ephemeral client state while Convex manages persistent, synchronized data, preventing state duplication.

**NativeWind + CSS variables**: Combines Tailwind's utility-first approach with semantic theming for consistent cross-platform design.

**React 19 + New Architecture**: Leverages latest React features including the experimental compiler for optimized performance.

## Directory Structure

```
├── app/                    # Expo Router screens (file = route)
│   ├── _layout.tsx         # Root layout with providers
│   └── index.tsx           # Home screen (/)
├── convex/                 # Backend functions and configuration
│   ├── health.ts           # Health check query example
│   ├── tsconfig.json       # Convex TypeScript configuration
│   └── _generated/         # Auto-generated API types (DO NOT EDIT)
├── lib/                    # Shared utilities and client-side logic
│   ├── stores/             # Zustand stores for client state
│   ├── utils.ts            # Utility functions (cn helper)
│   └── theme.ts            # Theme constants and navigation themes
├── styles/                 # Global styles and CSS variables
│   └── global.css          # Tailwind base + semantic CSS variables
├── assets/                 # Static resources (images, icons, etc.)
└── docs/                   # Project documentation
    └── llm/                # LLM-generated planning and execution files
```

### Key Configuration Files

- [package.json](package.json) - Dependencies and scripts
- [app.json](app.json) - Expo configuration with experiments enabled
- [tsconfig.json](tsconfig.json) - TypeScript config with path aliases
- [tailwind.config.ts](tailwind.config.ts) - NativeWind theme configuration
- [convex/tsconfig.json](convex/tsconfig.json) - Backend TypeScript configuration

## Key Files Reference

### [app/_layout.tsx](app/_layout.tsx)
**Purpose**: Root layout component that wraps the entire app with essential providers.
**Key Features**:
- ConvexProvider for backend connection
- PortalHost for overlay components (modals, dropdowns)
- Global CSS import
- Stack navigator setup

**When to edit**: Adding global providers, changing navigation structure, or configuring app-wide settings.

### [app/index.tsx](app/index.tsx)
**Purpose**: Home screen demonstrating Convex integration with real-time health check.
**Pattern**: Shows proper usage of `useQuery` hook and conditional rendering based on server state.

### [convex/health.ts](convex/health.ts)
**Purpose**: Example Convex query function for backend health monitoring.
**Pattern**: Demonstrates basic query structure with no arguments and simple return value.

### [lib/stores/index.ts](lib/stores/index.ts)
**Purpose**: Centralized exports for all Zustand stores.
**Usage**: Import stores with `import { useThemeStore, useAuthStore } from '@/lib/stores'`

### [styles/global.css](styles/global.css)
**Purpose**: Defines CSS variables for semantic theming and imports Tailwind.
**Critical**: Contains light/dark theme variables that power the entire design system.

## Frontend Architecture

### Routing (Expo Router)

The app uses Expo Router v6 with file-based routing where each file in the `app/` directory automatically becomes a route:

- `app/index.tsx` → `/` (home)
- `app/profile.tsx` → `/profile`
- `app/(auth)/login.tsx` → `/login` (grouped routes)
- `app/[id].tsx` → `/123` (dynamic routes)

**Type Safety**: With `typedRoutes: true` in [app.json](app.json#L36), navigation gets full TypeScript autocomplete.

**Navigation Pattern**:
```tsx
import { router } from 'expo-router'

// Type-safe navigation
router.push('/profile')
router.replace('/')
```

### Component Hierarchy

1. **Root Layout** ([app/_layout.tsx](app/_layout.tsx)) - Providers and global setup
2. **Screen Components** - Individual route components
3. **Shared Components** - Prioritize React Native Reusables (https://reactnativereusables.com/)
   - **First Choice**: Use components from React Native Reusables library when available
   - **Installation**: Run `npx @react-native-reusables/cli@latest add <component-name>`
   - **Custom Components**: Create in `components/` directory only when React Native Reusables doesn't have the needed component

### Screen Structure Pattern

Each screen component should follow this pattern:
```tsx
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import { View, Text } from 'react-native'

export default function ScreenName() {
  // Server state via Convex
  const data = useQuery(api.module.functionName)

  // Client state via Zustand (if needed)
  const { setting } = useThemeStore()

  // Render with semantic classes
  return (
    <View className="flex-1 bg-background">
      <Text className="text-foreground">Content</Text>
    </View>
  )
}
```

## Backend Architecture (Convex)

### Function Structure

Convex functions live in the `convex/` directory and follow three patterns:

#### Query Pattern
```tsx
// convex/users.ts
import { query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db.query('users').take(args.limit ?? 10)
  },
})
```

#### Mutation Pattern
```tsx
// convex/users.ts
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      createdAt: Date.now(),
    })
  },
})
```

#### Action Pattern
```tsx
// convex/external.ts
import { action } from './_generated/server'

export const sendEmail = action({
  args: { to: v.string(), subject: v.string() },
  handler: async (ctx, args) => {
    // Call external APIs, send emails, etc.
    const result = await fetch('https://api.example.com/send-email', {
      method: 'POST',
      body: JSON.stringify(args),
    })
    return await result.json()
  },
})
```

### Type Generation

Convex automatically generates TypeScript types in [convex/_generated/](convex/_generated/) when `bun convex:dev` is running. These files should never be edited manually.

**Import pattern**: Always use `@/convex/_generated/api` for imports:
```tsx
import { api } from '@/convex/_generated/api'
```

### Database Integration

Convex provides real-time reactive queries that automatically update components when data changes:

```tsx
// Component updates automatically when data changes in the database
const messages = useQuery(api.messages.list)
const sendMessage = useMutation(api.messages.create)

// Fire-and-forget mutation
sendMessage({ text: 'Hello!', userId: user.id })

// Await mutation result
const newMessage = await sendMessage({ text: 'Hello!', userId: user.id })
```

## State Management

### Decision Tree

Use this decision tree to determine the appropriate state management approach:

**Use Convex (Server State) for**:
✅ Database records and persistent data
✅ Real-time synchronized state across users
✅ Data shared between sessions/devices
✅ Server-side business logic and validation

**Use Zustand (Client State) for**:
✅ Client-only state (theme preferences, UI visibility)
✅ Authentication tokens and session state
✅ User preferences and app settings
✅ Computed/filtered views without server reactivity
✅ Cross-component communication without prop drilling

### Anti-patterns to Avoid

❌ **Don't duplicate server data in Zustand**:
```tsx
// BAD - Duplicating Convex data
const messages = useQuery(api.messages.list)
const { setMessages } = useMessageStore() // Don't do this
useEffect(() => setMessages(messages), [messages])
```

✅ **Good - Use Convex directly with client-side filtering**:
```tsx
// GOOD - Single source of truth
const messages = useQuery(api.messages.list)
const { filterBy } = useMessageFilters() // Client state only
const filtered = messages?.filter(m => m.type === filterBy)
```

### Zustand Stores

#### Available Stores

**[lib/stores/theme.ts](lib/stores/theme.ts)** - Theme preferences ('light' | 'dark' | 'system')
```tsx
const { theme, setTheme } = useThemeStore()
```

**[lib/stores/auth.ts](lib/stores/auth.ts)** - Authentication state (scaffold for future implementation)
```tsx
const { user, isAuthenticated, login, logout } = useAuthStore()
```

#### Creating New Stores

Add new stores to `lib/stores/` and export from `index.ts`:

```tsx
// lib/stores/newStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface NewState {
  value: string
  setValue: (value: string) => void
}

export const useNewStore = create<NewState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    {
      name: 'new-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

#### Store Best Practices

- Use TypeScript interfaces for type safety
- Apply `persist` middleware for data that should survive app restarts
- Use shallow selectors to prevent unnecessary rerenders:
  ```tsx
  // ✅ Subscribe to specific value
  const theme = useThemeStore(state => state.theme)

  // ❌ Subscribe to entire store
  const { theme } = useThemeStore() // Rerenders on any store change
  ```

### Convex Integration

#### Using Queries
```tsx
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

const data = useQuery(api.module.function, { arg1: 'value' })
// data is automatically reactive - component rerenders on updates
```

#### Using Mutations
```tsx
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const createUser = useMutation(api.users.create)

// Fire and forget (most common)
createUser({ name: 'John', email: 'john@example.com' })

// Or await the result
const newUser = await createUser({ name: 'John', email: 'john@example.com' })
```

## Styling & Theming

### NativeWind + CSS Variables

The styling system combines NativeWind (Tailwind for React Native) with semantic CSS variables for consistent theming across platforms.

#### Semantic Token Usage

Always use semantic color tokens instead of hardcoded colors:

```tsx
// ✅ CORRECT - Uses semantic tokens (supports dark mode)
<View className="bg-background border-border">
  <Text className="text-foreground">Content</Text>
</View>

// ❌ WRONG - Hardcoded colors break dark mode
<View className="bg-white border-gray-200">
  <Text className="text-black">Content</Text>
</View>
```

#### Available Semantic Tokens

From [tailwind.config.ts](tailwind.config.ts#L8-L46):

- **Background**: `background`, `card`, `popover`
- **Foreground**: `foreground`, `card-foreground`, `popover-foreground`
- **Interactive**: `primary`, `secondary`, `accent`, `destructive`
- **UI Elements**: `border`, `input`, `ring`, `muted`

Each token automatically adapts to light/dark mode based on CSS variables in [styles/global.css](styles/global.css).

### CSS Variables System

Theme variables are defined in [styles/global.css](styles/global.css) with automatic dark mode support:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... */
}

.dark:root {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

Variables use HSL values without the `hsl()` wrapper for compatibility with both web and native.

### Utility Pattern

Use the `cn()` helper from [lib/utils.ts](lib/utils.ts) for conditional classes:

```tsx
import { cn } from '@/lib/utils'

<View className={cn(
  "base-classes",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50"
)} />
```

### Cross-Platform Considerations

- Most Tailwind utilities work across iOS, Android, and Web
- Some CSS features don't work on native (backdrop-filter, complex gradients)
- Use `Platform.OS` from React Native when platform-specific styling is needed
- Text styles don't inherit on React Native - apply classes directly to `<Text>` components

## TypeScript & Type Safety

### Strict Mode Configuration

The project uses TypeScript strict mode ([tsconfig.json](tsconfig.json)) with comprehensive type checking:

- `strict: true` - All strict checking flags enabled
- No implicit `any` types allowed
- Path aliases configured with `@/*` mapping to project root

### Path Aliases

Always use the `@/` prefix for internal imports:

```tsx
// ✅ CORRECT
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import '@/styles/global.css'

// ❌ WRONG
import { api } from '../convex/_generated/api'
import { cn } from './utils'
```

### Type Inference from Convex

Convex automatically generates types that can be used for component props:

```tsx
import { FunctionReturnType } from 'convex/server'
import { api } from '@/convex/_generated/api'

type User = FunctionReturnType<typeof api.users.get>

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  // user is fully typed based on Convex function return type
  return <Text>{user.name}</Text>
}
```

### Common Typing Patterns

**Component Props**:
```tsx
interface ScreenProps {
  title: string
  onPress?: () => void
}

export default function Screen({ title, onPress }: ScreenProps) {
  // ...
}
```

**Zustand Store States**:
```tsx
interface AppState {
  count: number
  increment: () => void
}
```

## Development Workflows

### Local Development Setup

**Critical**: Convex must be running before starting Expo. The app requires both terminals:

```bash
# Terminal 1: Start Convex backend (MUST RUN FIRST)
bun convex:dev

# Terminal 2: Start Expo dev server (after Convex is running)
bun start
```

### Initial Project Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repo>
   cd native-convex-auth-starter
   bun install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env.local
   ```

3. **Start Convex** (first time setup):
   ```bash
   bun convex:dev
   # Follow prompts to create/select Convex project
   # Copy the deployment URL to .env.local as EXPO_PUBLIC_CONVEX_URL
   ```

4. **Start Expo**:
   ```bash
   bun start
   ```

### Environment Variables

Variables must use `EXPO_PUBLIC_` prefix to be accessible in the app:

```bash
# .env.local
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud
```

**Important**: Restart Expo server after changing environment variables.

### Platform-Specific Development

**iOS Development** (macOS only):
```bash
bun ios  # Requires Xcode
```

**Android Development**:
```bash
bun android  # Requires Android Studio + emulator
```

**Physical Device**:
- Install Expo Go app
- Run `bun start`
- Scan QR code

**Web Development**:
```bash
bun web  # Limited mobile component support
```

### Common Commands

```bash
# Development
bun start          # Start Expo dev server
bun convex:dev     # Start Convex backend
bun ios           # Run on iOS simulator
bun android       # Run on Android emulator
bun web           # Run on web

# Code Quality
bun lint          # Run ESLint
```

## UI Components & React Native Reusables

### Component Selection Priority

**1. React Native Reusables (First Choice)**
Always check React Native Reusables (https://reactnativereusables.com/) first for any UI component needs:

```bash
# Install specific components
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add input
npx @react-native-reusables/cli@latest add dialog
```

**2. Available Components**:
- Buttons, Inputs, Dialogs, Cards, Sheets
- Navigation components, Form elements
- Layout components, Typography
- See full list at: https://reactnativereusables.com/

**3. Usage Pattern**:
```tsx
// ✅ PREFERRED - Use React Native Reusables
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm() {
  return (
    <View className="p-4">
      <Input placeholder="Email" />
      <Button onPress={handleLogin}>Login</Button>
    </View>
  )
}
```

**4. When to Create Custom Components**:
- Only when React Native Reusables doesn't provide the needed component
- For highly specialized business logic components
- When existing components need significant customization beyond props

## Common Patterns

### ✅ Good Patterns

**Convex Query with Loading States**:
```tsx
// From app/index.tsx
const health = useQuery(api.health.check)
return (
  <View className="flex-row items-center gap-2">
    <View className={`h-4 w-4 rounded-full ${health ? 'bg-green-500' : 'bg-red-500'}`} />
    <Text>{health ? 'Connected' : 'Connecting...'}</Text>
  </View>
)
```

**Zustand Store with Persistence**:
```tsx
// From lib/stores/theme.ts
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

**Semantic Styling**:
```tsx
<View className="bg-background border-border">
  <Text className="text-foreground">Adapts to theme</Text>
</View>
```

### ❌ Anti-patterns to Avoid

**Wrong State Management**:
```tsx
// ❌ DON'T duplicate Convex data in Zustand
const messages = useQuery(api.messages.list)
const setMessages = useMessageStore(state => state.setMessages)
useEffect(() => setMessages(messages), [messages])
```

**Wrong Import Paths**:
```tsx
// ❌ DON'T use relative paths for Convex
import { api } from '../convex/_generated/api'

// ✅ DO use path alias
import { api } from '@/convex/_generated/api'
```

**Wrong Styling**:
```tsx
// ❌ DON'T use hardcoded colors
<View className="bg-white text-black">

// ✅ DO use semantic tokens
<View className="bg-background text-foreground">
```

**Wrong Text Styling**:
```tsx
// ❌ DON'T apply text styles to View
<View className="text-lg font-bold">
  <Text>Content</Text>
</View>

// ✅ DO apply text styles to Text
<View>
  <Text className="text-lg font-bold">Content</Text>
</View>
```

## Dependencies & Key Libraries

### Core Dependencies

**React Native Ecosystem**:
- `expo` (54.0.30) - Development platform and SDK
- `expo-router` (6.0.21) - File-based routing with type safety
- `react-native` (0.81.5) - Core framework

**Backend & State**:
- `convex` (1.31.2) - Reactive serverless backend
- `zustand` (5.0.9) - Lightweight state management

**Styling**:
- `nativewind` (4.2.1) - Tailwind CSS for React Native
- `tailwindcss` (3.4.17) - Utility-first CSS framework
- `class-variance-authority` (0.7.1) - Component variant handling
- `clsx` & `tailwind-merge` - Conditional class utilities

**UI & Navigation**:
- **React Native Reusables** - Priority UI component library (install as needed)
- `@react-navigation/native` (7.1.8) - Navigation library
- `@rn-primitives/portal` (1.3.0) - Portal for overlays
- `expo-haptics`, `expo-image`, etc. - Expo modules

### Development Dependencies

- `typescript` (5.9.2) - Type safety
- `eslint` with Expo config - Code linting
- `postcss` & `prettier-plugin-tailwindcss` - Build tools

### Storage & Persistence

- `@react-native-async-storage/async-storage` - Client-side storage for Zustand persistence

## UI Components & React Native Reusables

### Component Selection Priority

**1. React Native Reusables (First Choice)**
Always check React Native Reusables (https://reactnativereusables.com/) first for any UI component needs:

```bash
# Install specific components
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add input
npx @react-native-reusables/cli@latest add dialog
```

**2. Available Components**:
- Buttons, Inputs, Dialogs, Cards, Sheets
- Navigation components, Form elements
- Layout components, Typography
- See full list at: https://reactnativereusables.com/

**3. Usage Pattern**:
```tsx
// ✅ PREFERRED - Use React Native Reusables
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm() {
  return (
    <View className="p-4">
      <Input placeholder="Email" />
      <Button onPress={handleLogin}>Login</Button>
    </View>
  )
}
```

**4. When to Create Custom Components**:
- Only when React Native Reusables doesn't provide the needed component
- For highly specialized business logic components
- When existing components need significant customization beyond props

## Performance & Optimization

### React 19 Features

The project leverages React 19 with experimental features enabled:

**React Compiler** ([app.json](app.json#L37)):
```json
"experiments": {
  "reactCompiler": true
}
```
Automatically optimizes components and reduces unnecessary re-renders.

**New Architecture** ([app.json](app.json#L8)):
```json
"newArchEnabled": true
```
Uses Expo's new architecture for improved performance and future compatibility.

### Optimization Best Practices

**Zustand Selectors**:
```tsx
// ✅ Subscribe to specific values
const theme = useThemeStore(state => state.theme)

// ❌ Subscribe to entire store
const store = useThemeStore()
```

**Convex Query Optimization**:
- Queries are automatically optimized and cached
- Use specific arguments to avoid over-fetching
- Leverage Convex's built-in pagination for large datasets

**NativeWind Performance**:
- Utility classes are optimized at build time
- CSS variables enable efficient theme switching
- `future.hoverOnlyWhenSupported` avoids hover states on touch devices

### Build Optimization

- Metro bundler with tree shaking
- TypeScript compilation optimizations
- Automatic asset optimization through Expo

## 16. Troubleshooting & Common Issues

### Connection Issues

**"Connecting to Convex..." forever**:
1. Check if `bun convex:dev` is running in a separate terminal
2. Verify `EXPO_PUBLIC_CONVEX_URL` is set in `.env.local`
3. Restart Expo server after adding environment variables
4. Check Convex deployment URL format

**Environment Variables Not Working**:
- Must use `EXPO_PUBLIC_` prefix for client access
- Restart Expo dev server after changes
- Check `.env.local` file exists and is correctly formatted

### Type Errors

**Cannot find module '@/...'**:
- Check [tsconfig.json](tsconfig.json) has path alias configured
- Restart TypeScript language server in VS Code
- Verify import path is correct

**Convex API Types Missing**:
- Ensure `bun convex:dev` is running (generates types automatically)
- Check [convex/_generated/api.d.ts](convex/_generated/api.d.ts) exists
- Restart TypeScript language server

### Styling Issues

**Classes Not Applied**:
- Check NativeWind is properly configured in [tailwind.config.ts](tailwind.config.ts)
- Verify [styles/global.css](styles/global.css) is imported in [app/_layout.tsx](app/_layout.tsx)
- Use semantic tokens instead of hardcoded colors

**Dark Mode Not Working**:
- Check CSS variables are defined for both light and dark themes
- Verify theme switching logic in Zustand store
- Ensure device appearance settings are correct

### Build Issues

**Metro Bundle Errors**:
- Clear Metro cache: `npx expo start --clear`
- Delete `node_modules` and reinstall
- Check for duplicate dependencies

**TypeScript Build Errors**:
- Run `npx tsc --noEmit` to check types
- Verify all required types are installed
- Check [tsconfig.json](tsconfig.json) configuration

## 17. Quick Reference

### Essential Commands

```bash
# Start development (two terminals required)
bun convex:dev    # Terminal 1: Backend
bun start         # Terminal 2: Frontend

# Platform-specific development
bun ios           # iOS simulator
bun android       # Android emulator
bun web           # Web development

# Utilities
bun lint          # Code linting
npx expo doctor   # Check project health
npx convex --help # Convex CLI help
```

### Important File Locations

- **Environment**: `.env.local`
- **Global styles**: [styles/global.css](styles/global.css)
- **Root layout**: [app/_layout.tsx](app/_layout.tsx)
- **Stores**: [lib/stores/index.ts](lib/stores/index.ts)
- **Utils**: [lib/utils.ts](lib/utils.ts)
- **Convex functions**: `convex/*.ts`
- **Generated types**: `convex/_generated/`

### Key Imports

```tsx
// Convex
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'

// State management
import { useThemeStore, useAuthStore } from '@/lib/stores'

// Utilities
import { cn } from '@/lib/utils'

// Navigation
import { router } from 'expo-router'
```

### Documentation Links

- [Expo Router Docs](https://docs.expo.dev/routing/introduction/)
- [Convex Docs](https://docs.convex.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Native Docs](https://reactnative.dev/)

---

This developer overview serves as your comprehensive guide to the Native Convex Auth Starter architecture. Keep this document updated as the project evolves, and refer to the actual source code for the most current implementation details.
