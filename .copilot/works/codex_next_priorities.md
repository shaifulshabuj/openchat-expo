# 📋 Codex Next Priorities

**Last Updated:** February 4, 2026 12:35 JST  
**Current Phase:** Phase 0 - Project Setup

---

## 🎯 CURRENT TASK QUEUE

### ✅ COMPLETED
- [x] Create GitHub repository `openchat-expo`
- [x] Setup Copilot agentic infrastructure
  - [x] Instructions/ORCHESTRATOR.md
  - [x] Skills index and core skills
  - [x] Work tracking system

### 🔄 IN PROGRESS
- [ ] **Phase 0.1: Initialize Expo Mobile App**
  - Priority: HIGH
  - Assignee: Awaiting start command
  - Deadline: Today
  - Details: Create Expo app with Expo Router, TypeScript, NativeWind

### 📋 PENDING (In Priority Order)
1. **Phase 0.2: Initialize NestJS Backend**
   - Create NestJS API with tRPC integration
   - Setup Prisma with PostgreSQL schema
   - Configure JWT authentication

2. **Phase 0.3: Setup Monorepo Structure**
   - Configure pnpm workspaces
   - Setup Turborepo for build orchestration
   - Create shared packages (types, config)

3. **Phase 0.4: Configure Docker Compose**
   - PostgreSQL service
   - Redis service
   - API service
   - Hot reload setup

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
