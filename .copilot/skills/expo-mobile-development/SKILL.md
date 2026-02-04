# 📱 Expo Mobile Development Skill

## Purpose
Guide development of Expo-based mobile applications with React Native, Expo Router, and Expo SDK modules.

## Prerequisites
- Node.js 20+ installed
- Expo CLI: `npm install -g expo-cli eas-cli`
- iOS Simulator (Mac) or Android Emulator

## Workflow

### 1. Start Development
```bash
cd apps/mobile
npx expo start          # Start Metro
npx expo run:ios        # Run on iOS
npx expo run:android    # Run on Android
```

### 2. Create Screens (Expo Router)
```typescript
// apps/mobile/app/chat/[id].tsx
import { useLocalSearchParams, Stack } from 'expo-router'

export default function ChatScreen() {
  const { id } = useLocalSearchParams()
  return <Stack.Screen options={{ title: 'Chat' }} />
}
```

### 3. Use Expo SDK
```typescript
// Camera
import { Camera } from 'expo-camera'
const [permission] = Camera.useCameraPermissions()

// Image Picker
import * as ImagePicker from 'expo-image-picker'
const result = await ImagePicker.launchImageLibraryAsync()

// Secure Storage
import * as SecureStore from 'expo-secure-store'
await SecureStore.setItemAsync('token', jwt)
```

## Quality Gates
- ✅ App builds without errors
- ✅ TypeScript check passes
- ✅ Navigation works
- ✅ No console errors

## Common Issues
- Module not found: `npx expo install <package>`
- Native errors: `npx expo prebuild --clean`
- Cache issues: `npx expo start --clear`
