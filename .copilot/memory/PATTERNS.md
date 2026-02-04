# OpenChat Expo - Memory & Patterns

**Purpose:** Capture learned patterns, decisions, and gotchas for future reference  
**Last Updated:** February 4, 2026

---

## 🎓 Learned Patterns

### Repository Setup
- **Decision:** Monorepo with pnpm workspaces
- **Rationale:** Single source of truth, shared types, faster development
- **Pattern:** `apps/` for runnable projects, `packages/` for shared code

### Copilot Agentic Workflow
- **Decision:** 7-phase orchestration protocol
- **Rationale:** Systematic approach ensures quality and continuity
- **Pattern:** DISCOVER → DECOMPOSE → DELEGATE → WAIT → VERIFY → ITERATE → CHECKPOINT

---

## 🔧 Technical Decisions

### Why Expo Router over React Navigation?
- File-based routing (Next.js-like)
- Better web support
- Deep linking out of the box
- Simpler navigation state management

### Why tRPC over REST?
- End-to-end type safety
- No manual type syncing
- Better DX (autocomplete, inline docs)
- Smaller payloads

### Why NativeWind over StyleSheet?
- Familiar Tailwind syntax
- Better web compatibility
- Faster development
- Consistent styling

---

## ⚠️ Gotchas & Workarounds

### Expo Build Issues
- **Issue:** Native modules require prebuild
- **Solution:** Run `npx expo prebuild --clean` after adding native modules
- **Prevention:** Use Expo SDK modules when possible

### tRPC Type Sync
- **Issue:** Frontend types out of sync after backend changes
- **Solution:** Always rebuild API: `pnpm --filter @openchat/api build`
- **Prevention:** Use `turbo run build` which handles dependencies

---

## 📚 Resources & References

### Official Docs
- Expo: https://docs.expo.dev/
- NestJS: https://docs.nestjs.com/
- tRPC: https://trpc.io/docs/
- Prisma: https://www.prisma.io/docs/

### Community Resources
- Expo Discord: https://chat.expo.dev
- NestJS Discord: https://discord.gg/nestjs
- React Native Community: https://github.com/react-native-community

---

## 🚀 Quick Commands Reference

### Development
```bash
# Start everything
pnpm dev

# Mobile only
pnpm mobile

# API only
pnpm api

# With Docker
docker-compose up
```

### Building
```bash
# Build all
pnpm build

# Build mobile (iOS)
cd apps/mobile && npx expo run:ios

# Build mobile (Android)
cd apps/mobile && npx expo run:android

# Build for production (EAS)
cd apps/mobile && eas build --platform all --profile production
```

### Testing
```bash
# Run all tests
pnpm test

# API tests only
pnpm --filter @openchat/api test

# E2E tests
cd apps/mobile && maestro test .maestro/
```

### Deployment
```bash
# Deploy backend to Railway
cd apps/api && railway up

# Submit to App Store
cd apps/mobile && eas submit --platform ios

# Submit to Google Play
cd apps/mobile && eas submit --platform android
```

---

**Maintained By:** OpenChat Development Team  
**Updates:** Add new patterns as they emerge
