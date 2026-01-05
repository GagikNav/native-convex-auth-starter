import { expo } from '@better-auth/expo'
import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex, crossDomain } from '@convex-dev/better-auth/plugins'
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal'
import { v } from 'convex/values'
import { components } from './_generated/api'
import { DataModel } from './_generated/dataModel'
import { query } from './_generated/server'
import authConfig from './auth.config'

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth)

// Site URL for web support (cross-domain authentication)
const siteUrl = process.env.SITE_URL

/**
 * Creates a Better Auth instance configured for this Convex deployment.
 *
 * Configuration:
 * - Email/password authentication enabled
 * - Email verification disabled (for development)
 * - Expo plugin for React Native support
 * - Convex plugin for database integration
 * - Cross-domain plugin for web support
 */
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    trustedOrigins: [
      // Production app scheme
      'native-convex-auth-starter://',
      // Development - Expo Go with local IP ranges
      //! The wildcard patterns for exp:// should only be used in development. In production, use your app's specific scheme (e.g., myapp://).
      'exp://*',
      'exp://192.168.*.*:*/*',
      'exp://10.0.0.*:*/*',
      'exp://172.*.*.*:*/*',
      'exp://localhost:*/*',
      // Web support
      ...(siteUrl ? [siteUrl] : []),
      'http://localhost:8081',
      'http://localhost:19006',
    ],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Expo and Convex plugins are required
      expo(),
      convex({ authConfig }),
      // Cross-domain plugin for web support
      ...(siteUrl ? [crossDomain({ siteUrl })] : []),
    ],
  } satisfies BetterAuthOptions)
}

/**
 * Query to get the current authenticated user.
 * Returns null if no user is authenticated.
 */
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      id: v.string(),
      name: v.string(),
      email: v.string(),
      emailVerified: v.boolean(),
      image: v.optional(v.union(v.string(), v.null())),
      createdAt: v.string(),
      updatedAt: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx)
    if (!user) return null
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
    }
  },
})
