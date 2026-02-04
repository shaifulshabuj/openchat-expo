# Changelog

All notable changes to OpenChat Expo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-04

### Added - Phase 0.B Complete: Project Scaffolding
**Mobile App:**
- Initialized Expo mobile app with tabs template in `apps/mobile/`
- Installed and configured NativeBase 3.4 UI component library
- Configured NativeWind 4.2 (Tailwind CSS for React Native)
- Added demo button to test NativeBase integration
- Setup tRPC client for API communication

**Backend API:**
- Initialized NestJS 11 backend in `apps/api/`
- Migrated Prisma schema with 14 database models:
  - User, Message, Conversation, ConversationMember
  - Friendship, FriendRequest, Attachment, ReadReceipt
  - Reaction, Notification, BlockedUser, Device
  - Session, Settings
- Configured tRPC 11.9 server with health check and hello procedures
- Setup Prisma 7.3 ORM with PostgreSQL connection
- Added environment configuration for Docker

**Shared Packages:**
- Created `@openchat/types` package with shared TypeScript interfaces
- Created `@openchat/config` package with shared constants
- Setup TypeScript compilation for packages

**Infrastructure:**
- Verified Docker Compose configuration (PostgreSQL 15 + Redis 7)
- Created EAS Build configuration for iOS/Android
- Validated GitHub Actions CI/CD workflow
- Fixed Docker Compose version format

### Verified
- Expo app structure created successfully
- NestJS backend with tRPC ready for development
- 14 Prisma models defined and ready for migrations
- Shared packages integrated in monorepo
- tRPC client-server communication configured
- Docker services configuration validated
- EAS Build profiles ready (development, preview, production)
- CI/CD pipeline functional

### Phase
- Phase 0.B: Project Scaffolding (Week 1-2 of 20) - COMPLETE ✅
- Ready for Phase 1: Authentication & User Management

### Breaking Changes
- None (initial setup)

### Migration Notes
- Fresh Expo project, no migration needed
- Prisma schema ready for initial migration with `prisma migrate dev`

## [0.0.1] - 2026-02-04

### Added
- GitHub repository created at https://github.com/shaifulshabuj/openchat-expo
- Copilot orchestration workflow with 7-phase protocol
- 6 core skills: Expo development, NestJS, tRPC, deployment, tracking
- Work tracking system with priority queue and progress logging
- Feature checklist with 77 planned features across 7 phases
- Monorepo structure configured (pnpm + Turborepo)
- Docker Compose for local development (PostgreSQL + Redis + API)
- GitHub Actions CI/CD workflow
- README, LICENSE, and project documentation

[Unreleased]: https://github.com/shaifulshabuj/openchat-expo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/shaifulshabuj/openchat-expo/releases/tag/v0.1.0
[0.0.1]: https://github.com/shaifulshabuj/openchat-expo/releases/tag/v0.0.1
