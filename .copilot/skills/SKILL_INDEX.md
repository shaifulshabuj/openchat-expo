# 🎯 OpenChat Expo - Copilot Skills Index

This file maps development tasks to specific skills. Consult this before starting any work.

---

## 📱 **Mobile Development Skills**

### `expo-mobile-development`
**Use for:** Expo app development, React Native components, Expo Router
**Location:** `.copilot/skills/expo-mobile-development/SKILL.md`
**Triggers:**
- Creating/modifying screens in `apps/mobile/app/`
- Working with React Native components
- Expo SDK integrations (camera, image-picker, etc.)
- Expo Router navigation

---

### `expo-e2e-testing`
**Use for:** End-to-end testing with Maestro or Detox
**Location:** `.copilot/skills/expo-e2e-testing/SKILL.md`
**Triggers:**
- Writing UI flow tests
- Testing user journeys
- Validating app behavior on real devices
- Creating `.maestro` test flows

---

### `expo-ui-styling`
**Use for:** Styling with NativeWind (Tailwind for RN)
**Location:** `.copilot/skills/expo-ui-styling/SKILL.md`
**Triggers:**
- Styling components with Tailwind classes
- Creating responsive layouts
- Implementing dark mode
- Custom theme configuration

---

## 🖥️ **Backend Development Skills**

### `nestjs-backend-development`
**Use for:** NestJS API development, modules, services
**Location:** `.copilot/skills/nestjs-backend-development/SKILL.md`
**Triggers:**
- Creating/modifying API endpoints
- Working with NestJS modules
- Service layer logic
- Guards, interceptors, pipes

---

### `trpc-integration`
**Use for:** Setting up tRPC routers and procedures
**Location:** `.copilot/skills/trpc-integration/SKILL.md`
**Triggers:**
- Creating tRPC procedures
- Type-safe API calls
- tRPC client setup in Expo
- Input validation with Zod

---

### `nestjs-unit-testing`
**Use for:** Backend unit and integration tests
**Location:** `.copilot/skills/nestjs-unit-testing/SKILL.md`
**Triggers:**
- Writing tests for services/controllers
- Mocking dependencies
- Test database setup
- Coverage reports

---

### `prisma-schema-management`
**Use for:** Database schema changes and migrations
**Location:** `.copilot/skills/prisma-schema-management/SKILL.md`
**Triggers:**
- Modifying `schema.prisma`
- Creating migrations
- Seeding database
- Database queries optimization

---

### `socketio-realtime`
**Use for:** Real-time features with Socket.io
**Location:** `.copilot/skills/socketio-realtime/SKILL.md`
**Triggers:**
- Setting up Socket.io gateway in NestJS
- Real-time messaging
- Typing indicators
- Presence detection

---

## 🚀 **Deployment Skills**

### `eas-build-deployment`
**Use for:** Building and deploying Expo apps
**Location:** `.copilot/skills/eas-build-deployment/SKILL.md`
**Triggers:**
- Building iOS/Android apps
- Submitting to App Store/Google Play
- Over-the-air updates
- EAS configuration

---

### `railway-deployment`
**Use for:** Deploying NestJS backend to Railway
**Location:** `.copilot/skills/railway-deployment/SKILL.md`
**Triggers:**
- Deploying API to Railway
- Database setup on Railway
- Environment variable configuration
- Monitoring and logs

---

### `docker-compose-local`
**Use for:** Local development with Docker
**Location:** `.copilot/skills/docker-compose-local/SKILL.md`
**Triggers:**
- Running PostgreSQL/Redis locally
- Docker Compose troubleshooting
- Multi-container development
- Database management

---

## 🧪 **Testing & Quality Skills**

### `typescript-type-safety`
**Use for:** TypeScript best practices and type errors
**Location:** `.copilot/skills/typescript-type-safety/SKILL.md`
**Triggers:**
- Fixing TypeScript errors
- Creating shared types
- Type guards and utilities
- Strict mode compliance

---

### `performance-optimization`
**Use for:** App performance improvements
**Location:** `.copilot/skills/performance-optimization/SKILL.md`
**Triggers:**
- Reducing bundle size
- Optimizing renders (React.memo, useMemo)
- Image optimization
- Lazy loading

---

## 📊 **Project Management Skills**

### `spec-progress-tracking`
**Use for:** Tracking feature implementation against spec
**Location:** `.copilot/skills/spec-progress-tracking/SKILL.md`
**Triggers:**
- Updating feature checklist
- Writing status reports
- Documenting completed work
- Creating test logs

---

## 🔧 **How to Use Skills**

1. **Identify Task Type:** Determine which skill applies to your current task
2. **Read Skill File:** Open the skill's SKILL.md file for detailed workflow
3. **Follow Quality Gates:** Use the skill's defined quality gates for verification
4. **Document Progress:** Update work reports using skill guidelines

---

## 📝 **Skill Creation Template**

When creating new skills, use this structure:

```markdown
# Skill Name

## Purpose
Brief description of when to use this skill

## Prerequisites
- Tool X installed
- Configuration Y set up

## Workflow
Step-by-step instructions

## Quality Gates
✅ Checklist of success criteria

## Common Issues
Problems and solutions

## Examples
Code snippets and usage examples
```

---

**Last Updated:** February 4, 2026  
**Maintained By:** OpenChat Expo Team
