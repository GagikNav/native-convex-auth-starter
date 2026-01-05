# Authentication Implementation Overview

## Libraries and Architecture

### State Management
- **Client-side State**: Zustand (via `lib/stores/auth.ts`)
  - Manages authentication state locally
  - Persists user data using AsyncStorage
  - Provides methods for `login` and `logout`

### Libraries
- **Frontend**:
  - Expo Router for navigation
  - React Native Reusables for UI components
  - NativeWind for styling
  - Zustand for state management
  - AsyncStorage for persistent storage

- **Backend Placeholder**:
  - Convex (prepared for future backend integration)
  - Mock authentication currently implemented

### Authentication Flow

#### Routes
- `/login`: Login screen
- `/register`: Registration screen
- `/forgot-password`: Password recovery screen (placeholder)

#### Current Implementation
- **Mock Authentication**: Currently using a simulated login process
- Stores user info in Zustand store with AsyncStorage persistence
- Redirects to home screen after successful "login"

#### Authentication State Management
- `useAuthStore` manages:
  - `user`: Current user information
  - `isAuthenticated`: Authentication status
  - `login()`: Simulate user login
  - `logout()`: Clear user session

### Key Files
- `app/(auth)/_layout.tsx`: Handles auth-related routing
- `app/(auth)/login.tsx`: Login screen implementation
- `app/(auth)/register.tsx`: Registration screen implementation
- `lib/stores/auth.ts`: Zustand authentication store

### Future Integration
- Placeholder for Better Auth integration
- Social login buttons currently disabled
- Ready for full authentication implementation

## Security Considerations
- Passwords not actually validated
- No real backend authentication
- Temporary mock implementation

## Next Steps
- Integrate actual authentication backend
- Implement proper password validation
- Add error handling
- Implement social login
