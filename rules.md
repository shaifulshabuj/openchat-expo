# 📜 OpenChat Expo Development Rules

**Project:** OpenChat Expo  
**Enforcement:** Mandatory  
**Version:** 1.0  
**Last Updated:** February 4, 2026

---

## 🚫 ABSOLUTE RULES (NEVER BREAK)

### 1. **NEVER Commit Without Quality Gates**
```bash
# These MUST pass before git commit:
pnpm type-check    # ✅ Required
pnpm build         # ✅ Required
git diff           # ✅ Review required
```

**No exceptions. Broken builds are not allowed.**

### 2. **NEVER Work on >5 Minute Tasks**
If a task would take more than 5 minutes:
- ❌ Do NOT execute it as-is
- ✅ Break it down into smaller tasks (1-5 min each)
- ✅ Each subtask should be independently verifiable

**Rationale:** Small tasks are faster, easier to verify, and less risky.

### 3. **NEVER Skip Documentation Updates**
After EVERY task, update:
1. `work_reports/01_PROJECT_STATUS.md` ✅ Always
2. `CHANGELOG.md` ✅ Always
3. `.copilot/works/codex_work_progress_and_reply.md` ✅ Always
4. `.copilot/works/codex_metrics.md` ✅ Always
5. `work_reports/00_FEATURE_CHECKLIST.md` ✅ Always

**No documentation = task not complete.**

### 4. **NEVER Create Temp Files in Project Root**
Temporary files ONLY go in:
```
/Volumes/SATECHI_WD_BLACK_2/openchat-expo/tmp/
```

**Never:**
- `planning.md` in root ❌
- `notes.md` in .copilot/ ❌  
- `scratch.txt` anywhere ❌

**Always:**
- `tmp/planning_YYMMDDHHMMSS.md` ✅
- `tmp/notes_YYMMDDHHMMSS.md` ✅
- `tmp/scratch_YYMMDDHHMMSS.md` ✅

### 5. **NEVER Modify More Than 3 Files Per Task**
One task = 1-3 files maximum

If you need to modify 4+ files:
- ❌ Do NOT do it in one task
- ✅ Break into multiple tasks
- ✅ Each task modifies 1-3 files

**Rationale:** Easier to review, verify, and rollback if needed.

### 6. **NEVER Commit Directly to Main Without Verification**
Every commit must:
```bash
git diff                    # ✅ Review changes
pnpm type-check            # ✅ Types valid
pnpm build                 # ✅ Build passes
[task-specific check]      # ✅ Feature works
```

**Broken code on main is unacceptable.**

### 7. **NEVER Use Vague Commit Messages**
```bash
# ❌ BAD
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "wip"

# ✅ GOOD
git commit -m "feat: add contact request API endpoint

- Created POST /api/contacts/request route
- Returns 201 with requestId and status
- Added validation for targetUserId

Quality gates: All passed
Duration: 3 minutes"
```

### 8. **NEVER Retry More Than 3 Times**
If a task fails 3 times:
- ❌ Do NOT keep retrying the same approach
- ✅ Break the task down into smaller pieces
- ✅ Or escalate for human guidance

**Insanity = doing the same thing expecting different results.**

### 9. **NEVER Ignore Type Errors**
TypeScript errors must be fixed, not suppressed:
```typescript
// ❌ FORBIDDEN
// @ts-ignore
// @ts-expect-error
any as types

// ✅ REQUIRED
Proper TypeScript types
Explicit interfaces
Type safety maintained
```

**Type safety is not optional.**

### 10. **NEVER Deploy Without Testing**
Before any deployment (EAS Build, Railway, etc.):
```bash
pnpm type-check            # ✅ Required
pnpm build                 # ✅ Required
pnpm test                  # ✅ Required (if tests exist)
Manual feature test        # ✅ Required
```

**Untested code does not go to production.**

---

## ⚠️ STRONG RECOMMENDATIONS (Break Only with Good Reason)

### 11. **Prefer Codex CLI for Automation**
```bash
# ✅ PREFERRED
codex exec --full-auto "Task with Files:, Pattern:, Expected:, Verify:"

# ⚠️ ACCEPTABLE (if Codex unavailable)
Manual execution with GitHub Copilot assistance
```

**But:** Always have manual fallback ready.

### 12. **Prefer Small Commits Over Large Commits**
```bash
# ✅ GOOD: One task = one commit
feat: add ContactRequest interface (1 file)
feat: create contact request API route (1 file)
feat: add contact request UI button (2 files)

# ⚠️ ACCEPTABLE: Related tasks = one commit
feat: implement contact request feature (5 files)

# ❌ BAD: Unrelated changes in one commit
feat: add contacts, update auth, fix profile bug (10 files)
```

### 13. **Prefer Existing Patterns Over New Patterns**
When implementing features:
1. ✅ Find similar existing code
2. ✅ Follow the same pattern
3. ✅ Maintain consistency

**Don't invent new patterns unless necessary.**

### 14. **Prefer Type-Safe Over Any**
```typescript
// ❌ AVOID
const data: any = fetchData()
function process(input: any): any { }

// ✅ PREFER
const data: UserData = fetchData()
function process(input: ContactRequest): ContactResponse { }
```

### 15. **Prefer Explicit Over Implicit**
```typescript
// ⚠️ IMPLICIT (acceptable)
const status = response.status

// ✅ EXPLICIT (better)
const status: number = response.status

// ⚠️ IMPLICIT
export default UserService

// ✅ EXPLICIT  
export { UserService }
export default UserService
```

---

## 📋 PROJECT-SPECIFIC RULES

### Architecture Rules

#### 16. **Monorepo Structure Must Be Maintained**
```
apps/
  mobile/          # Expo React Native app
  api/             # NestJS backend
packages/
  types/           # Shared TypeScript types
  config/          # Shared configuration
  ui/              # Shared UI components (future)
```

**Never:**
- Move apps outside `apps/` ❌
- Create packages outside `packages/` ❌
- Mix backend code into mobile ❌

#### 17. **Package Boundaries Must Be Respected**
```typescript
// ❌ FORBIDDEN: Direct import from other app
import { UserService } from '../../../api/src/services/user'

// ✅ REQUIRED: Import from shared package
import { User, UserDTO } from '@openchat/types'

// ✅ REQUIRED: Use tRPC for API communication
const user = await trpc.user.getById.query({ id })
```

#### 18. **Types Must Be Shared via @openchat/types**
```typescript
// ❌ FORBIDDEN: Duplicate types
// In apps/mobile/types.ts
interface User { id: string, name: string }

// In apps/api/types.ts  
interface User { id: string, name: string }

// ✅ REQUIRED: Single source of truth
// In packages/types/src/user.ts
export interface User { id: string, name: string }

// Import everywhere
import { User } from '@openchat/types'
```

### Technology Stack Rules

#### 19. **Use Expo for Mobile Development**
```bash
# ✅ REQUIRED
import { View, Text } from 'react-native'
import { Link, router } from 'expo-router'
import { className } from 'nativewind'

# ❌ FORBIDDEN  
import { BrowserRouter } from 'react-router-dom'  # Wrong! Not React Native
```

#### 20. **Use NestJS for Backend**
```typescript
// ✅ REQUIRED
import { Controller, Get, Post } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

// ❌ FORBIDDEN
import express from 'express'  # Wrong! Use NestJS
import fastify from 'fastify'  # Wrong! Use NestJS
```

#### 21. **Use tRPC for API Communication**
```typescript
// ✅ REQUIRED: Type-safe RPC
const user = await trpc.user.getById.query({ id: '123' })

// ❌ FORBIDDEN: Manual REST API
fetch('/api/users/123')  # Wrong! Use tRPC
axios.get('/api/users/123')  # Wrong! Use tRPC
```

#### 22. **Use Prisma for Database**
```typescript
// ✅ REQUIRED
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const user = await prisma.user.findUnique({ where: { id } })

// ❌ FORBIDDEN
import mysql from 'mysql'  # Wrong! Use Prisma
import pg from 'pg'  # Wrong! Use Prisma
```

#### 23. **Use NativeWind for Mobile Styling**
```typescript
// ✅ REQUIRED
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold">Hello</Text>
</View>

// ❌ FORBIDDEN
<View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
  # Wrong! Use NativeWind Tailwind classes
</View>
```

### Code Quality Rules

#### 24. **All Functions Must Have Clear Purpose**
```typescript
// ❌ BAD: Unclear purpose
function doStuff(data: any) { }
function process(x: any) { }

// ✅ GOOD: Clear purpose
function createContactRequest(senderId: string, receiverId: string): ContactRequest { }
function validateEmail(email: string): boolean { }
```

#### 25. **Error Handling Must Be Explicit**
```typescript
// ❌ BAD: Swallowed errors
try {
  await riskyOperation()
} catch (e) {
  // Silent failure
}

// ✅ GOOD: Explicit error handling
try {
  await riskyOperation()
} catch (error) {
  logger.error('Failed to perform risky operation', error)
  throw new HttpException('Operation failed', HttpStatus.INTERNAL_SERVER_ERROR)
}
```

#### 26. **Async Operations Must Be Awaited**
```typescript
// ❌ BAD: Unawaited promise
function createUser(data: UserData) {
  prisma.user.create({ data })  # Missing await!
}

// ✅ GOOD: Properly awaited
async function createUser(data: UserData) {
  return await prisma.user.create({ data })
}
```

### Testing Rules

#### 27. **E2E Tests Go in Proper Location**
```bash
# ✅ REQUIRED
.copilot/works/test_log/YYMMDDHHMMSS_log_feature_name.md

# ❌ FORBIDDEN
test_results.md in project root
test.log in random location
```

#### 28. **Test Logs Must Include Timestamp**
```bash
# ✅ REQUIRED
.copilot/works/test_log/260204133045_log_contact_request_flow.md

# ❌ FORBIDDEN
.copilot/works/test_log/contact_request_test.md  # No timestamp
```

### Git & Version Control Rules

#### 29. **Branch Strategy: Main Only (for now)**
```bash
# ✅ CURRENT: Direct to main
git checkout main
git pull
[make changes]
git commit
git push origin main

# 🔜 FUTURE: Feature branches (Phase 2+)
git checkout -b feature/contact-requests
[make changes]
git commit
git push origin feature/contact-requests
# Create PR, review, merge
```

#### 30. **Commit Message Format: Conventional Commits**
```bash
# Format: <type>: <description>
#
# Types:
#   feat:     New feature
#   fix:      Bug fix
#   docs:     Documentation only
#   style:    Code style (formatting, no logic change)
#   refactor: Code refactor (no feature change)
#   test:     Adding/updating tests
#   chore:    Build, dependencies, tooling

# ✅ EXAMPLES
feat: add contact request API endpoint
fix: resolve authentication token expiry issue
docs: update README with Expo setup instructions
refactor: extract validation logic into utility
test: add unit tests for contact service
chore: upgrade Expo SDK from 51 to 52
```

### Security Rules

#### 31. **No Secrets in Code or Git**
```typescript
// ❌ FORBIDDEN
const API_KEY = 'sk_live_abc123...'  # NEVER COMMIT SECRETS
const DATABASE_URL = 'postgres://user:pass@...'

// ✅ REQUIRED
import { env } from './config/env'
const API_KEY = env.API_KEY  # From environment variables
const DATABASE_URL = env.DATABASE_URL
```

#### 32. **Environment Variables Must Use .env Files**
```bash
# ✅ REQUIRED
# .env (gitignored)
DATABASE_URL=postgres://...
JWT_SECRET=...
OPENAI_API_KEY=...

# .env.example (committed)
DATABASE_URL=postgres://localhost:5432/openchat
JWT_SECRET=your-secret-here
OPENAI_API_KEY=your-key-here
```

#### 33. **Passwords Must Be Hashed**
```typescript
// ❌ FORBIDDEN
await prisma.user.create({
  data: { email, password: plainPassword }  # NEVER STORE PLAIN PASSWORDS
})

// ✅ REQUIRED
import * as bcrypt from 'bcrypt'
const hashedPassword = await bcrypt.hash(plainPassword, 10)
await prisma.user.create({
  data: { email, password: hashedPassword }
})
```

### Performance Rules

#### 34. **Minimize Bundle Size**
```typescript
// ❌ BAD: Import entire library
import _ from 'lodash'
import * as moment from 'moment'

// ✅ GOOD: Import only what you need
import { debounce } from 'lodash/debounce'
import { format } from 'date-fns/format'
```

#### 35. **Use Pagination for Lists**
```typescript
// ❌ BAD: Fetch all records
const users = await prisma.user.findMany()  # Could be 1 million records!

// ✅ GOOD: Paginate
const users = await prisma.user.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
})
```

---

## 🎯 TASK-SPECIFIC RULES

### For API Endpoint Tasks:

#### 36. **All Endpoints Must Have Validation**
```typescript
// ❌ BAD: No validation
@Post('create')
async create(@Body() data: any) {
  return await this.service.create(data)
}

// ✅ GOOD: Validated
import { IsString, IsEmail, Length } from 'class-validator'

class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @Length(3, 50)
  username: string
}

@Post('create')
async create(@Body() data: CreateUserDto) {
  return await this.service.create(data)
}
```

#### 37. **All Endpoints Must Have Error Handling**
```typescript
// ❌ BAD: No error handling
@Get(':id')
async getUser(@Param('id') id: string) {
  return await this.prisma.user.findUnique({ where: { id } })
}

// ✅ GOOD: With error handling
@Get(':id')
async getUser(@Param('id') id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw new NotFoundException(`User ${id} not found`)
  }
  return user
}
```

### For UI Component Tasks:

#### 38. **All Components Must Have TypeScript Props**
```typescript
// ❌ BAD: No types
function ContactCard({ contact }) {
  return <View>...</View>
}

// ✅ GOOD: Typed props
interface ContactCardProps {
  contact: Contact
  onPress?: () => void
}

function ContactCard({ contact, onPress }: ContactCardProps) {
  return <View>...</View>
}
```

#### 39. **All Interactive Elements Must Have Feedback**
```typescript
// ❌ BAD: No feedback
<Pressable onPress={handlePress}>
  <Text>Button</Text>
</Pressable>

// ✅ GOOD: Visual feedback
<Pressable 
  onPress={handlePress}
  className="active:opacity-70"  // Visual feedback
>
  <Text>Button</Text>
</Pressable>
```

### For Database Tasks:

#### 40. **All Migrations Must Have Descriptive Names**
```bash
# ❌ BAD
npx prisma migrate dev --name update

# ✅ GOOD
npx prisma migrate dev --name add_contact_requests_table
npx prisma migrate dev --name add_user_avatar_field
```

#### 41. **All Models Must Have Timestamps**
```prisma
// ❌ BAD: No timestamps
model User {
  id       String @id @default(uuid())
  email    String @unique
  username String
}

// ✅ GOOD: With timestamps
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🚨 ENFORCEMENT

### How Rules Are Enforced:

1. **Pre-commit Checks:** 
   - Git hooks (future) will enforce quality gates
   - Manual verification required for now

2. **Code Review:**
   - GitHub Copilot reviews all changes
   - Codex CLI validates task outputs

3. **CI/CD Pipeline:**
   - GitHub Actions runs on every push
   - Must pass build, type-check, tests

4. **Documentation Audits:**
   - Work reports must be updated
   - Session logs must be maintained

### Consequences of Breaking Rules:

**Absolute Rules (1-10):**
- Task is INCOMPLETE until fixed
- Changes must be reverted or corrected
- No exceptions

**Strong Recommendations (11-15):**
- Warning issued
- Justification required in commit message
- Pattern reviewed for future improvement

**Project-Specific Rules (16-41):**
- Fix required before merge
- May require refactoring
- Must align with architecture

---

## 📚 RULE CATEGORIES SUMMARY

| Category | Rules | Enforcement | Exceptions |
|----------|-------|-------------|------------|
| **Absolute** | 1-10 | Mandatory | NEVER |
| **Strong Recommendations** | 11-15 | Default | With reason |
| **Architecture** | 16-19 | Mandatory | Rare |
| **Technology** | 20-23 | Mandatory | Never |
| **Code Quality** | 24-26 | Mandatory | Never |
| **Testing** | 27-28 | Mandatory | Never |
| **Git** | 29-30 | Mandatory | Never |
| **Security** | 31-33 | Mandatory | NEVER |
| **Performance** | 34-35 | Strong | With reason |
| **Task-Specific** | 36-41 | Mandatory | Rare |

---

## 🎯 WHEN IN DOUBT

If you're unsure whether something breaks a rule:

1. **Check this document** - Most cases are covered
2. **Check `.github/copilot.instructions.md`** - For workflow guidance
3. **Check `AGENT.md`** - For behavior guidance
4. **Err on the side of caution** - Follow the strictest interpretation
5. **Document your decision** - Explain in commit message

---

**Remember:**

> "Rules exist to ensure quality, consistency, and maintainability.  
> Following them makes the codebase better for everyone,  
> including your future self."

**Version:** 1.0  
**Effective:** February 4, 2026  
**Review:** Every Phase completion  
**Status:** Active and Enforced
