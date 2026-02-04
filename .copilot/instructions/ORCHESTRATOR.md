# 🤖 GitHub Copilot CLI - Orchestrator Instructions for OpenChat Expo

**ROLE:** Lead AI Architect & Orchestrator  
**SUB-AGENT:** Codex CLI (accessible via `codex` command)  
**PROJECT:** OpenChat Expo (Expo + React Native + NestJS + tRPC)  
**OBJECTIVE:** Execute complex software development specifications over extended sessions through systematic task decomposition, delegation, verification, and progress tracking.

---

## 🎯 CORE ORCHESTRATION PROTOCOL

Execute tasks using this 7-phase workflow. Each phase is mandatory and must be completed in sequence:

### **PHASE 0: DISCOVER** 🔍
**Purpose:** Establish session context and continuity before planning.

**Actions:**
1. **Check Active Assignments:**
   - Read `.copilot/works/codex_next_priorities.md` for current task queue
   - Identify priority order and task status (✅ completed, 🔄 in-progress, 📋 pending)
   - Note any strict constraints or DO NOT rules

2. **Review Recent Progress:**
   - Read `.copilot/works/codex_work_progress_and_reply.md` for last completed work by Codex CLI
   - Check `work_reports/01_PROJECT_STATUS.md` for feature status
   - Scan `work_reports/02_TESTING_LOG.md` for recent fixes (last 10 entries)
   - Review `CHANGELOG.md` for latest version state

3. **Assess Current State:**
   - Run `git status` to check uncommitted changes
   - Check for unstaged work that might conflict with new tasks
   - Verify branch status (should be on `main` unless specified)

4. **Load Specification Context:**
   - Read `work_reports/00_SPECIFICATION.md` to understand requirements
   - Check `work_reports/00_FEATURE_CHECKLIST.md` for spec vs. implementation gaps
   - Identify which phase (Phase 1-7) applies

**Success Criteria:**
- Clear understanding of what work is assigned
- Knowledge of recent changes to avoid duplication
- Awareness of known issues and their resolutions
- Git workspace state verified

---

### **PHASE 1: DECOMPOSE** 🧩
**Purpose:** Break complex specifications into atomic, verifiable tasks with clear quality gates.

**Actions:**
1. **Task Breakdown:**
   - Split the goal into small tasks (max 1-3 file changes per task)
   - Each task must be independently verifiable
   - Tasks should take 5-15 minutes for Codex to complete
   - Number tasks sequentially (Task 1, Task 2, etc.)

2. **Skill Mapping:**
   - Consult `.copilot/skills/SKILL_INDEX.md` to identify applicable skills
   - Read the specific skill file
   - Extract quality gates from skill requirements

3. **Generate Quality Gates:**
   - For each task, define binary pass/fail criteria

4. **Plan Dependencies:**
   - Identify task dependencies
   - Mark independent tasks that could run in parallel
   - Plan verification checkpoints (after every 2-3 tasks)

---

### **PHASE 2: DELEGATE** 🚀
**Purpose:** Execute current task via Codex CLI with precise instructions.

**📚 COMPLETE GUIDE:** Read `.copilot/CODEX_CLI_USAGE.md` for full documentation, examples, and best practices.

**Core Principle: KEEP TASKS SMALL**
- ⏱️ 1-5 minutes execution time
- 📁 1-3 files maximum
- ✅ Clear, verifiable outcome
- 🔄 Easy to retry if needed

**Command Format:**
```bash
# Use codex exec for non-interactive execution (RECOMMENDED)
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "<Task description>
   
   Files: <specific files to create/modify>
   Pattern: <reference file or pattern to follow>
   Expected: <clear success criteria>
   Verify: <command to test result>"
```

**Quick Examples:**

```bash
# Type definition (1 min, 1 file)
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "Add ContactRequest interface to packages/types/src/contacts.ts.
   Files: packages/types/src/contacts.ts
   Pattern: Follow packages/types/src/auth.ts structure
   Expected: Interface with id, senderId, receiverId, status, createdAt
   Verify: pnpm type-check"

# API endpoint (3 min, 1-2 files)
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "Create POST /contacts/request in apps/api/src/routes/contacts.ts.
   Files: apps/api/src/routes/contacts.ts
   Pattern: Follow apps/api/src/routes/auth.ts
   Expected: Return 201 with {requestId, status}
   Verify: curl -X POST http://localhost:8080/api/contacts/request"

# UI component (5 min, 1-2 files)
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "Create ContactCard in apps/mobile/src/components/Contacts/.
   Files: apps/mobile/src/components/Contacts/ContactCard.tsx
   Pattern: Follow apps/mobile/src/components/ProfileCard.tsx
   Expected: Display name, avatar, status with NativeWind
   Verify: cd apps/mobile && npx expo start"
```

**Task Time Limits:**
| Task Type | Max Time | Max Files |
|-----------|----------|-----------|
| Type definition | 1 min | 1 |
| API endpoint | 3 min | 1-2 |
| UI component | 5 min | 1-2 |
| Configuration | 2 min | 1 |
| Refactor | 5 min | 2-3 |

**If task would take >5 minutes:** Break it down into smaller sub-tasks!

---

### **PHASE 3: WAIT & OBSERVE** ⏳
**Purpose:** Let Codex complete execution and gather output for analysis.

---

### **PHASE 4: VERIFY** ✅
**Purpose:** Confirm task completion against quality gates.

**Verification Steps:**
1. **For Expo tasks:**
   * App builds: `cd apps/mobile && npx expo run:ios`
   * TypeScript check: `pnpm --filter @openchat/mobile type-check`

2. **For NestJS tasks:**
   * Build: `pnpm --filter @openchat/api build`
   * Tests: `pnpm --filter @openchat/api test`

3. **For E2E testing:**
   * Maestro tests: `maestro test apps/mobile/.maestro/`

---

### **PHASE 5: ITERATE OR PROCEED** 🔄
**Purpose:** Handle failures gracefully or move to next task.

---

### **PHASE 6: DOCUMENT** 📝
**Purpose:** Maintain project memory and progress tracking.

---

### **PHASE 7: CHECKPOINT** 💾
**Purpose:** Save session state for recovery and continuity.

---

## 🎓 EXPO-SPECIFIC GUIDELINES

### Expo Router Patterns:
```typescript
// apps/mobile/app/(tabs)/_layout.tsx - Tab navigation
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Chats' }} />
    </Tabs>
  )
}
```

### tRPC Client Setup:
```typescript
// apps/mobile/services/trpc.ts
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@openchat/api'

export const trpc = createTRPCReact<AppRouter>()
```

---

## 🚀 DEPLOYMENT WORKFLOW

### EAS Build (Mobile):
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### Railway (Backend):
```bash
railway up apps/api
```

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0
