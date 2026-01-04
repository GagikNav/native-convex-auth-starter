# Native Convex Auth Starter - AI Coding Instructions

## Project Architecture

This is a React Native mobile app built with Expo SDK 54 + Convex backend. The stack:

- **Frontend**: React Native with Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native) + CSS variables for theming
- **State Management**: Zustand (client-side state) + Convex queries (server-state)
- **Backend**: Convex (reactive serverless backend with real-time subscriptions)
- **Type Safety**: TypeScript with strict mode enabled

### Key Architecture Decisions

**File-based routing**: Uses Expo Router in `app/` directory. Routes map to files (`app/index.tsx` → `/`, `app/profile.tsx` → `/profile`).

**Convex integration**: ConvexProvider wraps the entire app in [app/\_layout.tsx](app/_layout.tsx#L10-L14). All Convex hooks (`useQuery`, `useMutation`) must be used within this provider.

**Styling pattern**: Combines NativeWind's `className` prop with CSS variables defined in [styles/global.css](styles/global.css). Always use `className` for styling, not inline `style` unless positioning is required.

**Path aliases**: `@/*` maps to root directory. Use `@/convex/_generated/api` for Convex imports, `@/styles/global.css` for styles.

**State management separation**: Zustand handles client-side state (theme, UI, auth tokens, preferences). Convex handles server-state (database records, real-time data). Never duplicate server data in Zustand unless there's a specific caching/performance reason.

## State Management with Zustand

### When to Use Zustand vs Convex

**Use Zustand for:**
- Client-only state (theme, UI visibility, form state)
- Authentication tokens and session state
- User preferences and settings
- Computed/filtered views that don't need server reactivity
- Cross-component communication without prop drilling

**Use Convex for:**
- Database records and persistent data
- Real-time synchronized state across users
- Server-side business logic and validation
- Data that needs to be shared between sessions/devices

**✅ Good pattern - Complementary usage:**
```typescript
// Convex for server data (reactive)
const messages = useQuery(api.messages.list)
// Zustand for client UI state
const { filterBy } = useMessageFilters()
const filtered = messages?.filter(m => m.type === filterBy)
```

**❌ Bad pattern - Duplicating server data:**
```typescript
const messages = useQuery(api.messages.list)
const { setMessages } = useMessageStore() // Don't do this
useEffect(() => setMessages(messages), [messages])
```

### Using Zustand Stores

Import stores from `@/lib/stores`:

```typescript
import { useThemeStore, useAuthStore } from '@/lib/stores'

function MyComponent() {
  // Subscribe to entire store
  const { theme, setTheme } = useThemeStore()

  // Subscribe to specific values (prevents unnecessary rerenders)
  const theme = useThemeStore(state => state.theme)
  const setTheme = useThemeStore(state => state.setTheme)
}
```

**Available stores:**
- `useThemeStore` - Theme preferences (light/dark/system) with AsyncStorage persistence
- `useAuthStore` - Authentication state (user, isAuthenticated, login/logout)

### Creating New Stores

Add new stores to `lib/stores/` directory:

```typescript
// lib/stores/myStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface MyState {
  count: number
  increment: () => void
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'my-storage', // unique name for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

Then export from `lib/stores/index.ts`:

```typescript
export { useMyStore } from './myStore'
```

**Best practices:**
- Keep stores focused (one concern per store)
- Use TypeScript interfaces for type safety
- Use `persist` middleware for state that should survive app restarts
- Use shallow selectors to prevent unnecessary rerenders
- Document store purpose and usage in JSDoc comments

## Critical Developer Workflows

### Starting Development (TWO terminals required)

```bash
# Terminal 1: Convex backend (must run first)
bun convex:dev

# Terminal 2: Expo dev server
bun start
```

**Important**: Convex must be running before starting Expo. The app will not connect to backend without it.

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Run `bun convex:dev` - it will prompt to create/select a Convex project
3. Copy deployment URL to `.env.local` as `EXPO_PUBLIC_CONVEX_URL`
4. Restart Expo server after changing environment variables

### Running on Devices

- **iOS**: `bun ios` (requires macOS + Xcode)
- **Android**: `bun android` (requires Android Studio + emulator)
- **Physical device**: Use Expo Go app + scan QR code from `bun start`
- **Web**: `bun web` (limited mobile component support)

## Convex Backend Patterns

### Function Structure

All Convex functions live in `convex/` directory. Example pattern from [convex/health.ts](convex/health.ts):

```typescript
import { query } from './_generated/server'
import { v } from 'convex/values'

export const myQuery = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('users').collect()
  },
})
```

### Using Convex in Components

Pattern from [app/index.tsx](app/index.tsx#L5):

```typescript
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'

// In component:
const data = useQuery(api.moduleName.functionName)
const doMutation = useMutation(api.moduleName.mutationName)
```

**Key conventions**:

- Queries are reactive - components auto-rerender when data changes
- Mutations return promises - can be fire-and-forget or awaited
- Always import from `@/convex/_generated/api`, not hardcoded paths

### Generated Files

`convex/_generated/` is auto-generated by Convex CLI. Never edit these files manually. They regenerate on save when `bun convex:dev` is running.

## Styling Conventions

### NativeWind + CSS Variables Pattern

The project uses a shadcn/ui-inspired theming system. From [tailwind.config.ts](tailwind.config.ts#L8-L46):

```tsx
// ✅ Correct - uses semantic color tokens
<View className="bg-background border-border">
  <Text className="text-foreground">Hello</Text>
</View>

// ❌ Avoid - hardcoded colors break dark mode
<View className="bg-white border-gray-200">
```

**Available semantic tokens**: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover`.

### Utility Pattern

Use `cn()` helper from [lib/utils.ts](lib/utils.ts#L4-L6) for conditional classes:

```typescript
import { cn } from '@/lib/utils'

className={cn(
  "base-class",
  isActive && "bg-primary",
  "more-classes"
)}
```

## TypeScript Patterns

**Strict mode enabled** - all files require proper typing. No implicit `any`.

**Path alias usage**: Always use `@/` prefix for imports within the project:

```typescript
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import '@/styles/global.css'
```

**Convex type inference**: Types are inferred from Convex functions. Use `FunctionReturnType` from Convex for component props:

```typescript
import { FunctionReturnType } from 'convex/server'
type User = FunctionReturnType<typeof api.users.get>
```

## Cross-Platform Considerations

This app targets iOS, Android, and Web simultaneously. Key points:

1. **Expo Router**: File-based routing works across all platforms
2. **NativeWind**: Most Tailwind classes work, but some CSS features (backdrop-filter, complex gradients) don't
3. **Platform-specific code**: Use `Platform.OS` from `react-native` when needed
4. **Web limitations**: Some React Native components (Camera, Haptics) don't work on web

## Project Configuration

**App metadata**: Update `name`, `slug`, and `scheme` in [app.json](app.json#L3-L5) when forking this template.

**Package manager**: Project uses Bun (see `package.json` scripts), but npm/yarn also work.

**Expo experiments enabled**:

- `typedRoutes: true` - Get TypeScript autocomplete for navigation
- `reactCompiler: true` - Uses React 19 compiler for optimizations
- `newArchEnabled: true` - Uses Expo's new architecture

## Common Pitfalls

1. **Environment variables**: Must use `EXPO_PUBLIC_` prefix to expose to app. Without it, variables are `undefined` in client code.

2. **Convex connection**: If seeing "Connecting to Convex..." forever, check:
   - Is `bun convex:dev` running?
   - Is `EXPO_PUBLIC_CONVEX_URL` in `.env.local`?
   - Did you restart Expo server after adding env var?

3. **Style inheritance**: React Native doesn't inherit text styles like web. Must apply text classes to `<Text>` directly, not parent `<View>`.

4. **Import from Convex**: Always use `@/convex/_generated/api`, never relative paths. The generated files may move.

5. **Portal for overlays**: Use `PortalHost` from `@rn-primitives/portal` (already in [app/\_layout.tsx](app/_layout.tsx#L15)) for modals/dropdowns that need to render above other content.

## File Organization

```
app/           - Expo Router screens (each file = route)
convex/        - Backend functions (queries, mutations, actions)
styles/        - Global CSS with theme variables
lib/           - Shared utilities (cn helper, theme utils)
  stores/      - Zustand stores for client-side state management
assets/        - Static files (images, fonts)
```

When adding features:

- New screen? → Add to `app/`
- Backend logic? → Add to `convex/`
- Client-side state? → Add to `lib/stores/`
- Shared UI component? → Create `components/` directory
- Utility function? → Add to `lib/utils.ts` or new file in `lib/`

## LLM-generated planning & execution files (docs/llm)

We use LLMs to draft planning, todo, memory, and execution artifacts in Markdown. To keep machine-generated artifacts separate from hand-authored documentation, follow these conventions:

- **Location**:
  - Put all LLM-generated files under `docs/llm/`.
  - For each task or feature, create a dedicated subfolder: `docs/llm/<task-slug>/` (e.g., `docs/llm/authentication-signin/`).
  - Save canonical artifacts (PRDs, ADRs, final specs) under `docs/<task-slug>/` (same slug, separate root) so LLM drafts are clearly distinguished from the project's canonical docs.

- **File Types & Names** (recommended):
  - Planning: `planning.md`
  - TODO / Execution list: `todo.md`
  - Memory / Context: `memory.md`
  - Execution log / Runbook: `execution.md`
  - PRD (canonical): `prd.md` → store in `docs/<task-slug>/` (not `docs/llm`)
  - ADR (canonical): `adr.md` → store in `docs/<task-slug>/`

- **Frontmatter / Metadata**: Add a small YAML header to LLM-generated files so reviewers / tools can detect them automatically. Example:

```yaml
---
title: 'Sign-in Flow - Planning'
task: 'authentication-signin'
generated_by: 'llm'
created_at: '2026-01-04'
---
```

- **Workflow**:
  1. Use an LLM to draft the document with a focused prompt.
  2. Save the draft to `docs/llm/<task-slug>/{planning,todo,memory,execution}.md`.
  3. Review, refine, and, if accepted as canonical, copy or move the final PRD/ADR into `docs/<task-slug>/` (or create a separate PR that references the draft).
  4. Always commit LLM drafts so history is preserved.

- **Review notes**:
  - LLM files are drafts and must be reviewed by a human before being treated as conclusive.
  - Use `generated_by: llm` metadata to filter or exclude LLM artifacts from automated checks if needed.

This structure keeps LLM outputs discoverable and separated from hand-authored, canonical documentation while maintaining an audit trail and clear migration path from draft → canonical PRD/ADR.
