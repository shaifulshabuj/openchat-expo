# 📋 Codex Next Priorities

**Last Updated:** February 4, 2026 13:50 JST  
**Current Phase:** Phase 0.B - Project Scaffolding  
**Migration Approach:** Integrated (77 features: 52 PWA + 25 Expo)  
**Timeline:** 20 weeks (Week 1-2 starting next)

---

## 🎯 CURRENT TASK QUEUE

### ✅ COMPLETED (Phase 0.A - 100%)
- [x] Create GitHub repository `openchat-expo`
- [x] Setup Copilot agentic infrastructure (240KB documentation)
- [x] Create 10 specialized skills
- [x] Validate 7-phase workflow with Codex CLI
- [x] Complete final review and scope clarification
- [x] Make critical decisions (UI library, approach, timeline)
- [x] Update all documentation files

### 🔄 NEXT (Phase 0.B - Week 1-2 of 20)
**Goal:** Initialize Expo app + NestJS backend with NativeBase

#### Priority 1 (Day 1-2):
- [ ] **Task 0.B.1:** Initialize Expo app with tabs template
  - Command: `npx create-expo-app@latest apps/mobile --template tabs`
  - Files: apps/mobile/ (new directory)
  - Verify: App runs with `npx expo start`

- [ ] **Task 0.B.2:** Install and configure NativeBase
  - Install: `npx expo install native-base`
  - Configure: Update app.json and _layout.tsx
  - Verify: NativeBase Button renders

- [ ] **Task 0.B.3:** Configure NativeWind
  - Install: tailwindcss + nativewind
  - Configure: tailwind.config.js + babel.config.js
  - Verify: Tailwind classes work

#### Priority 2 (Day 3-4):
- [ ] **Task 0.B.4:** Initialize NestJS backend
  - Command: `npx @nestjs/cli new apps/api`
  - Files: apps/api/ (new directory)
  - Verify: `pnpm --filter openchat-api start`

- [ ] **Task 0.B.5:** Migrate Prisma schema from PWA
  - Copy: /openchat/apps/api/prisma/schema.prisma
  - Update: Connection URLs for Docker
  - Run: `npx prisma migrate dev --name init`
  - Verify: 14 models created in PostgreSQL

- [ ] **Task 0.B.6:** Configure tRPC in NestJS
  - Install: @trpc/server + @trpc/client
  - Create: apps/api/src/trpc/ directory
  - Setup: Basic router with health check
  - Verify: tRPC procedure callable

#### Priority 3 (Day 5-7):
- [ ] **Task 0.B.7:** Create shared packages
  - Create: packages/types/ with @openchat/types
  - Create: packages/config/ with @openchat/config
  - Setup: TypeScript build config
  - Verify: Import in apps/mobile and apps/api

- [ ] **Task 0.B.8:** Verify Docker Compose stack
  - Start: `docker compose up -d`
  - Check: PostgreSQL, Redis, API containers
  - Test: `curl http://localhost:8080/health`
  - Verify: Hot reload works

#### Priority 4 (Day 8-10):
- [ ] **Task 0.B.9:** Test Expo on iOS simulator
  - Command: `cd apps/mobile && npx expo run:ios`
  - Verify: App launches on simulator
  - Test: Hot reload works

- [ ] **Task 0.B.10:** Test Expo on Android emulator
  - Command: `npx expo run:android`
  - Verify: App launches on emulator
  - Test: Hot reload works

- [ ] **Task 0.B.11:** Test pnpm workspace commands
  - Test: `pnpm dev` (all apps)
  - Test: `pnpm build` (all packages)
  - Test: `pnpm type-check` (all workspaces)
  - Verify: All commands work

- [ ] **Task 0.B.12:** Configure EAS Build and CI/CD
  - Run: `cd apps/mobile && eas build:configure`
  - Update: .github/workflows/ci.yml
  - Push: Verify CI/CD pipeline passes
  - Verify: EAS Build completes successfully

4. **Phase 0.5: Setup CI/CD**
   - GitHub Actions for EAS Build
   - Type checking workflow
   - Testing workflow
   - Deployment automation

5. **Phase 0.6: Copy Prisma Schema**
   - Migrate schema from openchat PWA
   - Run initial migrations
   - Create seed data

---

## 🚫 DO NOT
- Do not start Phase 1 until Phase 0 is complete
- Do not modify package.json without documenting changes
- Do not commit .env files
- Do not skip quality gates
- Do not proceed if tests fail

---

## 📝 NOTES
- Using Expo SDK 52 (latest stable)
- Using NestJS 10 with tRPC
- Using Prisma 5 for database ORM
- Using NativeWind 4 for styling
- Target: iOS 15+, Android 13+

---

**Next Update:** After Phase 0.1 completion

---

## 🧪 TEST TASK (DEMO)

### Task 0.TEST: Create EAS Build Configuration
**Status:** 🎯 READY TO START  
**Type:** Configuration  
**Files:** apps/mobile/eas.json (NEW)  
**Estimated:** 5 minutes  
**Purpose:** Demonstrate and validate Codex workflow

**Objective:**
Create eas.json configuration file for EAS Build with preview and production profiles.

**Codex Command:**
```bash
codex apply "Create apps/mobile/eas.json configuration file. Include 'preview' profile for internal testing (internal distribution) and 'production' profile for app store releases (store distribution). Configure for iOS and Android. Use environment variables for sensitive config. Follow EAS best practices from https://docs.expo.dev/build/eas-json/"
```

**Success Criteria:**
- [ ] apps/mobile/eas.json exists
- [ ] Valid JSON syntax
- [ ] Has preview profile (internal distribution)
- [ ] Has production profile (store distribution)
- [ ] Configured for iOS and Android

**Quality Gates:**
- [ ] JSON validates: `jq . < apps/mobile/eas.json`
- [ ] No TypeScript errors
- [ ] File follows EAS schema

**Retry Count:** 0/3

---

## 📝 TEST LOG TEMPLATE

After test task, record:
- Did Codex complete successfully?
- Were quality gates met?
- Any issues encountered?
- Workflow improvements needed?
