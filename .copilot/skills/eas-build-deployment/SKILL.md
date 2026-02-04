# 🚀 EAS Build Deployment Skill

## Purpose
Build and deploy Expo apps to iOS/Android.

## Prerequisites
- EAS CLI: `npm install -g eas-cli`
- Expo account

## Workflow

### Build for Testing
```bash
cd apps/mobile
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### Submit to Stores
```bash
eas submit --platform ios
eas submit --platform android
```

## Quality Gates
- ✅ Build completes without errors
- ✅ App installs on device
