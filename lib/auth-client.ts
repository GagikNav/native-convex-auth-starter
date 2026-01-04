/**
 * Better Auth Client Placeholder
 *
 * This file will eventually contain the Better Auth client configuration.
 * For now, it serves as a placeholder to maintain the project structure.
 *
 * When integrating Better Auth:
 * 1. Install dependencies: bun add better-auth @better-auth/expo
 * 2. Import createAuthClient from @better-auth/expo
 * 3. Configure the client with your backend URL
 */

// export const authClient = createAuthClient({
//   baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_URL,
// })

export const authClient = {
  // Mock implementation
  signIn: {
    email: async () => console.log('Mock sign in'),
  },
  signUp: {
    email: async () => console.log('Mock sign up'),
  },
  useSession: () => ({
    data: null,
    isPending: false,
    error: null,
  }),
}
