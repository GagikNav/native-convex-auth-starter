# React Native + Convex Starter Template 🚀

A production-ready React Native template built with [Expo](https://expo.dev) and [Convex](https://convex.dev) - the reactive backend for modern applications. This template includes TypeScript, NativeWind (Tailwind CSS), and file-based routing out of the box.

## Features

- ⚡️ **Expo Router** - File-based routing for React Native
- 🎨 **NativeWind** - Tailwind CSS for React Native
- 🔄 **Convex Backend** - Real-time database and serverless functions
- 📱 **Cross-platform** - iOS, Android, and Web support
- 🔒 **TypeScript** - Full type safety
- 🎯 **Modern Architecture** - React 19 with Expo SDK 54

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended) or npm
- [Expo Go](https://expo.dev/go) app on your mobile device (for quick testing)
- A [Convex](https://convex.dev) account (free tier available)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/GagikNav/native-convex-auth-starter.git
cd native-convex-auth-starter
```

> **Important:** Remember to update the `name`, `slug`, and `scheme` fields in [app.json](app.json) to match your project name.

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 3. Set Up Convex Backend

#### Create a Convex Project

1. Sign up or log in to [Convex](https://dashboard.convex.dev)
2. Initialize Convex in your project:

Using Bun:
```bash
bun convex:dev
```

Or using npm:
```bash
npm run convex:dev
```

3. Follow the prompts to create a new project or connect to an existing one
4. This will:
   - Create a `.env.local` file with your `CONVEX_DEPLOYMENT` variable
   - Generate Convex client code in `convex/_generated/`
   - Start the Convex development server

#### Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your Convex deployment URL:
```env
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

> **Note:** The `EXPO_PUBLIC_` prefix is required for Expo to expose the variable to your app.

You can find your deployment URL in:
- The terminal output after running `bun convex:dev`
- Your [Convex Dashboard](https://dashboard.convex.dev)

### 4. Start the Development Server

In a **new terminal** (keep `bun convex:dev` running), start the Expo development server:

Using Bun:
```bash
bun start
```

Or using npm:
```bash
npm start
```

This will open Expo DevTools in your browser.

### 5. Run the App

You have several options to run the app:

#### On Physical Device (Recommended for Testing)
1. Install [Expo Go](https://expo.dev/go) on your iOS or Android device
2. Scan the QR code from the terminal or Expo DevTools
3. The app will open in Expo Go

#### On iOS Simulator (Mac only)
```bash
bun ios
# or: npm run ios
```

#### On Android Emulator
```bash
bun android
# or: npm run android
```

#### On Web
```bash
bun web
# or: npm run web
```

## Project Structure

```
.
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with ConvexProvider
│   └── index.tsx          # Home screen
├── app-example/           # Example code (from create-expo-app)
├── assets/                # Images, fonts, and other static assets
├── convex/                # Convex backend functions
│   ├── _generated/        # Auto-generated Convex client
│   ├── health.ts          # Example query function
│   └── README.md          # Convex functions documentation
├── styles/                # Global styles
│   └── global.css         # NativeWind/Tailwind styles
├── .env.local            # Environment variables (not in git)
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## Convex Integration

This template is pre-configured with Convex. The setup includes:

### ConvexProvider Setup
The app is wrapped with `ConvexProvider` in [app/_layout.tsx](app/_layout.tsx):

```tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      {/* Your app screens */}
    </ConvexProvider>
  )
}
```

### Using Convex Functions

See the example in `convex/health.ts` for how to create queries and mutations. Use them in your components:

```tsx
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function MyComponent() {
  const data = useQuery(api.health.check)
  const myMutation = useMutation(api.myModule.myFunction)

  // Your component logic
}
```

### Convex Dashboard

Monitor your backend, view logs, and manage data at:
https://dashboard.convex.dev

## Available Scripts

- `bun start` - Start the Expo development server
- `bun android` - Run on Android emulator/device
- `bun ios` - Run on iOS simulator/device
- `bun web` - Run in web browser
- `bun convex:dev` - Start Convex development server
- `bun reset-project` - Move example code and start fresh

## Development Workflow

1. **Keep Convex running**: Always have `bun convex:dev` running in one terminal
2. **Run Expo**: Start `bun start` in another terminal
3. **Make changes**: Edit files in `app/` (frontend) or `convex/` (backend)
4. **See updates**: Changes hot-reload automatically in both Convex and Expo

## Environment Variables

This project uses environment variables for configuration. See `.env.example` for all required variables.

**Important:**
- Use `EXPO_PUBLIC_` prefix for variables that need to be accessible in your app
- Never commit `.env.local` to version control
- Keep your Convex deployment URL secure

## Learn More

### Expo Resources
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

### Convex Resources
- [Convex Documentation](https://docs.convex.dev/)
- [Convex React Client](https://docs.convex.dev/client/react)
- [Convex Functions Guide](https://docs.convex.dev/functions)
- [Convex Dashboard](https://dashboard.convex.dev)

### NativeWind Resources
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Troubleshooting

### Convex Connection Issues

If you see "Failed to connect to Convex":
1. Verify `EXPO_PUBLIC_CONVEX_URL` is set correctly in `.env.local`
2. Ensure `bunx convex dev` is running
3. Check your deployment URL in [Convex Dashboard](https://dashboard.convex.dev)
4. Restart the Expo development server

### Environment Variables Not Working

1. Make sure the variable starts with `EXPO_PUBLIC_`
2. Restart the Expo development server after changing `.env.local`
3. Clear the cache: `bun start -c`

### Convex Functions Not Found

1. Ensure `bunx convex dev` is running
2. Check that your functions are properly exported in `convex/` directory
3. Wait for Convex to finish code generation

## Contributing

This is a template repository. Feel free to fork and customize it for your needs!

## License

See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Expo and Convex**
