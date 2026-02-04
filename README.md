# OpenChat Expo

Cross-platform messaging and social platform built with Expo (React Native) for iOS, Android, Web, and Desktop.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- pnpm (recommended) or npm
- Expo CLI: `npm install -g expo-cli eas-cli`
- Docker Desktop (for local backend)

### Mobile App
```bash
cd apps/mobile
pnpm install
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

### Backend API
```bash
cd apps/api
pnpm install
pnpm run dev
```

### With Docker
```bash
docker-compose up
```

## 📦 Project Structure

```
openchat-expo/
├── apps/
│   ├── mobile/          # Expo mobile app (iOS + Android + Web)
│   └── api/             # NestJS backend with tRPC
├── packages/            # Shared packages
│   ├── types/          # Shared TypeScript types
│   └── config/         # Shared configurations
├── .copilot/           # Copilot agentic development workflow
├── work_reports/       # Project documentation & progress tracking
└── docs/              # Additional documentation
```

## 🛠️ Tech Stack

**Frontend:**
- Expo SDK 52
- React Native
- Expo Router (file-based routing)
- NativeWind (Tailwind for RN)
- Zustand (state management)
- TanStack Query (server state)

**Backend:**
- NestJS 10
- tRPC (type-safe API)
- Socket.io (real-time)
- Prisma (ORM)
- PostgreSQL
- Redis

**Deployment:**
- Mobile: EAS Build
- Backend: Railway
- Web: Vercel

## 📚 Documentation

- [Migration Plan](docs/MIGRATION_PLAN.md)
- [Development Workflow](.copilot/instructions/ORCHESTRATOR.md)
- [Skills](.copilot/skills/SKILL_INDEX.md)
- [Feature Checklist](work_reports/00_FEATURE_CHECKLIST.md)
- [Project Status](work_reports/01_PROJECT_STATUS.md)

## 🎯 Features (Planned)

- ✅ Real-time messaging
- ✅ Voice/video calls
- ✅ Group chats
- ✅ Social feed (Moments)
- ✅ Contact management with QR codes
- ✅ Location sharing
- ✅ Stories/Status
- ✅ Push notifications
- ✅ Offline mode
- ✅ Dark mode
- ✅ Multi-language support

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **Repository:** https://github.com/shaifulshabuj/openchat-expo
- **Original PWA:** https://github.com/shaifulshabuj/openchat-pwa
- **Deployed App:** (Coming soon)

---

**Status:** 🚧 In Development - Phase 0 Setup  
**Last Updated:** February 4, 2026
