import { expoClient } from '@better-auth/expo/client'
import {
  convexClient,
  crossDomainClient,
} from '@convex-dev/better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

/**
 * Better Auth Client Configuration
 *
 * Configures the authentication client with:
 * - Expo plugin for secure storage and deep linking (native)
 * - Cross-domain plugin for web support
 * - Convex plugin for backend integration
 * - Base URL from environment variables
 */
export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL!,
  plugins: [
    convexClient(),
    // Use crossDomainClient for web, expoClient for native
    ...(Platform.OS === 'web'
      ? [crossDomainClient()]
      : [
          expoClient({
            scheme: Constants.expoConfig?.scheme as string,
            storagePrefix: Constants.expoConfig?.scheme as string,
            storage: SecureStore,
          }),
        ]),
  ],
})
