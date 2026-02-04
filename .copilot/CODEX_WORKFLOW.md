# 🤖 Codex Sub-Agent Delegation Workflow

**Purpose:** Guide for using Codex CLI as a sub-agent for task execution  
**Version:** 2.0 (Improved with error handling)  
**Last Updated:** February 4, 2026

---

## 📋 Overview

Codex CLI is used as a sub-agent to execute small, verifiable tasks. The orchestrator (GitHub Copilot CLI) decomposes complex work into atomic tasks and delegates them to Codex.

**Key Principles:**
- **Small Tasks:** 1-3 file changes, 5-15 minutes max
- **Verifiable:** Clear success/failure criteria
- **Atomic:** Can be completed independently
- **Traceable:** All work logged and tracked

---

## 🔄 DELEGATION WORKFLOW (7 PHASES)

### **PHASE 0: DISCOVER** 🔍
Read context before delegating

```bash
# Check current priorities
cat .copilot/works/codex_next_priorities.md

# Check recent progress
cat .copilot/works/codex_work_progress_and_reply.md

# Verify git status
git status
```

---

### **PHASE 1: DECOMPOSE** 🧩
Break goal into atomic tasks

**Task Template:**
```markdown
## Task [N]: [Brief Description]
**Type:** [Feature/Fix/Refactor/Docs/Test]
**Files:** [List of files to modify]
**Estimated Time:** [5-15 minutes]
**Dependencies:** [Task numbers this depends on]

**Objective:**
[Clear description of what should be done]

**Success Criteria:**
- ✅ [Specific, measurable outcome 1]
- ✅ [Specific, measurable outcome 2]
- ✅ [Specific, measurable outcome 3]

**Quality Gates:**
- ✅ [Build passes]
- ✅ [Tests pass]
- ✅ [TypeScript 0 errors]
```

---

### **PHASE 2: DELEGATE** 🚀
Execute task via Codex

**Command Format:**
```bash
codex apply "[Task description with full context]"
```

**Best Practices:**

1. **Be Specific:**
```bash
# ❌ BAD
codex apply "Add auth endpoint"

# ✅ GOOD
codex apply "Create POST /api/auth/login endpoint in apps/api/src/routes/auth.ts. Accept {email, password} in body. Return JWT token on success. Use bcrypt to verify password. Return 401 on invalid credentials. Follow the pattern in apps/api/src/routes/users.ts for route structure."
```

2. **Provide Context:**
```bash
codex apply "Add chat message component to apps/mobile/app/chat/[id].tsx. Component should display message content, sender avatar, and timestamp. Follow the design pattern in apps/mobile/components/MessageBubble.tsx. Use NativeWind classes for styling. Accept messageId, content, sender, timestamp as props."
```

3. **Reference Skills:**
```bash
codex apply "Setup Socket.io gateway in NestJS following .copilot/skills/socketio-realtime/SKILL.md workflow. Create RealtimeGateway in apps/api/src/modules/realtime/realtime.gateway.ts. Implement message:send and message:new events. Use @WebSocketGateway decorator."
```

4. **Set Expectations:**
```bash
codex apply "Add Prisma User model to apps/api/prisma/schema.prisma. Include fields: id (UUID), email (unique), username (unique), password, avatar (optional), createdAt, updatedAt. Run 'npx prisma migrate dev --name add_user_model' after adding. Verify with 'npx prisma validate'."
```

---

### **PHASE 3: WAIT & OBSERVE** ⏳
Let Codex execute and gather output

**What to Watch:**
- Codex process completion
- Files modified (use `git diff`)
- Console output (errors, warnings)
- Exit code (0 = success, non-zero = error)

**During Execution:**
```bash
# Watch git changes in real-time (optional)
watch -n 2 git status --short

# Monitor Codex output
# (Codex will show progress in terminal)
```

---

### **PHASE 4: VERIFY** ✅
Confirm task completion against quality gates

**Verification Checklist:**

1. **Files Changed:**
```bash
git diff --stat
git diff [file]  # Review changes
```

2. **Quality Gates (Skill-Specific):**

**For Expo Tasks:**
```bash
cd apps/mobile
pnpm install  # If new dependencies
npx expo prebuild  # If native modules changed
npx expo run:ios  # Verify iOS build
pnpm type-check  # TypeScript validation
```

**For NestJS Tasks:**
```bash
cd apps/api
pnpm install  # If new dependencies
pnpm run build  # Verify build
pnpm run test  # Run tests
curl http://localhost:3000/health  # Check API
```

**For Prisma Tasks:**
```bash
cd apps/api
npx prisma validate  # Schema validation
npx prisma generate  # Generate client
npx prisma migrate status  # Check migrations
```

3. **Extract Artifacts:**
```bash
# Create test log
mkdir -p .copilot/works/test_log
cat > .codex/works/test_log/$(date +%y%m%d%H%M%S)_log_[task_name].md << EOF
## Test: [Task Name]
**Date:** $(date)
**Status:** [PASS/FAIL]

### Files Modified:
$(git diff --stat)

### Verification Results:
- [Result 1]
- [Result 2]

### Issues Found:
- [Issue 1 or "None"]
EOF
```

---

### **PHASE 5: ITERATE OR PROCEED** 🔄
Handle failures or move forward

**If Quality Gates PASS:**
```bash
# Commit changes
git add .
git commit -m "feat: [task description]"
git push origin main

# Update progress
echo "✅ Task [N] complete" >> .copilot/works/codex_work_progress_and_reply.md

# Move to next task
```

**If Quality Gates FAIL:**

1. **Analyze Failure:**
```bash
# Check what went wrong
git diff [file]
# Read error logs
pnpm run build 2>&1 | tee build-error.log
```

2. **Create Recovery Task:**
```bash
# Option A: Fix with Codex (retry with more context)
codex apply "Fix the issue in [file]. Error: [specific error message]. Expected behavior: [what should happen]. The previous attempt did [what codex did]. Please [specific fix needed]."

# Option B: Fix manually
# Edit files directly, then commit
```

3. **Maximum Retries:** 3 attempts per task
   - After 3 failures, escalate to manual intervention

---

### **PHASE 6: DOCUMENT** 📝
Maintain project memory

**Update Work Reports:**

1. **Progress Log:**
```bash
cat >> .copilot/works/codex_work_progress_and_reply.md << EOF

## ✅ Task [N] Complete ($(date))

**What Was Done:**
- [Action 1]
- [Action 2]

**Files Modified:**
- [File 1]: [Change description]
- [File 2]: [Change description]

**Quality Gates Met:**
- ✅ [Gate 1]
- ✅ [Gate 2]

**Next Task:** Task [N+1]
EOF
```

2. **Feature Checklist:**
```bash
# Update work_reports/00_FEATURE_CHECKLIST.md
# Mark feature as complete with ✅
```

3. **Status Report:**
```bash
# Add entry to work_reports/01_PROJECT_STATUS.md
```

---

### **PHASE 7: CHECKPOINT** 💾
Save session state

```bash
# Git checkpoint
git add -A
git commit -m "checkpoint: Phase [X] Task [N] - [summary]"
git push origin main

# Update priorities
# Edit .copilot/works/codex_next_priorities.md
# Move completed task to "COMPLETED" section
```

---

## ⚠️ ERROR HANDLING & RECOVERY

### **Scenario 1: Codex Hangs/Freezes**

**Symptoms:** Codex runs but produces no output for >5 minutes

**Recovery:**
```bash
# 1. Cancel Codex (Ctrl+C)
# 2. Check what files changed
git status
git diff

# 3. If changes look good, proceed to verify
# 4. If changes incomplete, retry with more specific instructions

# 5. If Codex consistently hangs, switch to manual execution
```

---

### **Scenario 2: Codex Makes Wrong Changes**

**Symptoms:** Files modified but doesn't meet success criteria

**Recovery:**
```bash
# 1. Review changes
git diff [file]

# 2. Revert if needed
git restore [file]

# 3. Retry with corrected instructions
codex apply "In [file], [specific correction needed]. Previous attempt did [what went wrong]. Instead, please [correct approach]."

# 4. After 3 retries, fix manually
```

---

### **Scenario 3: Codex Stops Mid-Task**

**Symptoms:** Codex exits before completing all requirements

**Recovery:**
```bash
# 1. Check partial work
git status
git diff

# 2. If partial work is good, create continuation task
codex apply "Continue Task [N]: Complete the remaining work. Already done: [list completed parts]. Still needed: [list remaining parts]. Continue in [file]."

# 3. If partial work is broken, revert and retry from scratch
git restore .
codex apply "[Original task with more detail]"
```

---

### **Scenario 4: Codex Creates Build Errors**

**Symptoms:** TypeScript errors, build failures after Codex changes

**Recovery:**
```bash
# 1. Capture error
pnpm run build 2>&1 > build-error.log

# 2. Show error to Codex
codex apply "Fix TypeScript errors in [file]. Error log: $(cat build-error.log | head -20). The code should [expected behavior]. Please fix type errors without changing functionality."

# 3. If unfixable, revert
git restore [file]
# Fix manually or redesign task
```

---

### **Scenario 5: Codex Not Available**

**Symptoms:** `codex: command not found`

**Recovery:**
```bash
# 1. Check Codex installation
which codex
codex --version

# 2. If missing, install
# See: https://github.com/getcursor/codex-cli

# 3. If installed but not working, use GitHub Copilot directly
# Execute task manually with GitHub Copilot assistance

# 4. Document workaround
echo "⚠️ Codex unavailable, executed manually" >> .copilot/works/codex_work_progress_and_reply.md
```

---

## 📊 TASK TRACKING TEMPLATE

Use this template in `.copilot/works/codex_next_priorities.md`:

```markdown
## 🔄 ACTIVE TASK

### Task [N]: [Task Name]
**Status:** 🔄 IN PROGRESS  
**Started:** [Timestamp]  
**Assignee:** Codex CLI  
**Estimated:** [5-15 min]  
**Retry Count:** [0-3]

**Objective:**
[What needs to be done]

**Codex Command:**
\`\`\`bash
codex apply "[Full instruction]"
\`\`\`

**Success Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Quality Gates:**
- [ ] Build passes
- [ ] Tests pass
- [ ] TypeScript 0 errors

**Attempts:**
1. [Timestamp] - [Outcome]
2. [If retry needed]

---

## ✅ COMPLETED TASKS
[Archived completed tasks]

---

## 📋 PENDING TASKS
[Queue of upcoming tasks]
```

---

## 🎯 BEST PRACTICES

### Do's ✅
- ✅ Keep tasks small (1-3 files max)
- ✅ Provide full context in Codex command
- ✅ Reference existing patterns in codebase
- ✅ Set clear success criteria before delegating
- ✅ Verify immediately after Codex completes
- ✅ Commit frequently (after each successful task)
- ✅ Log all attempts (success and failures)

### Don'ts ❌
- ❌ Don't delegate complex multi-step tasks
- ❌ Don't skip quality gate verification
- ❌ Don't retry more than 3 times without analysis
- ❌ Don't commit unverified Codex output
- ❌ Don't delegate tasks without clear success criteria
- ❌ Don't work on multiple tasks simultaneously

---

## 📝 EXAMPLE: COMPLETE WORKFLOW

Let's demonstrate a complete workflow with a real task:

**Task:** Create EAS configuration file for Expo app

### Phase 1: Decompose
```markdown
## Task 1: Create EAS Build Configuration
**Type:** Configuration  
**Files:** apps/mobile/eas.json (NEW)  
**Estimated:** 5 minutes

**Objective:**
Create eas.json with preview and production build profiles for iOS and Android.

**Success Criteria:**
- ✅ eas.json exists in apps/mobile/
- ✅ File has valid JSON syntax
- ✅ Contains preview and production profiles
- ✅ Configured for both iOS and Android

**Quality Gates:**
- ✅ JSON validates: `cat apps/mobile/eas.json | jq .`
- ✅ EAS accepts config: `eas build:configure --non-interactive`
```

### Phase 2: Delegate
```bash
cd /Volumes/SATECHI_WD_BLACK_2/openchat-expo

codex apply "Create apps/mobile/eas.json configuration file for EAS Build. Include two build profiles: 'preview' for testing and 'production' for app store releases. Preview should use internal distribution, production should use store distribution. Configure for both iOS and Android platforms. Use latest SDK version. Reference: https://docs.expo.dev/build/eas-json/"
```

### Phase 3: Wait & Observe
```bash
# Codex executes...
# Watch for completion
```

### Phase 4: Verify
```bash
# Check file exists
ls -la apps/mobile/eas.json

# Validate JSON
cat apps/mobile/eas.json | jq .

# Check content
cat apps/mobile/eas.json

# Verify EAS accepts it (dry run)
cd apps/mobile && eas build:configure --non-interactive
```

### Phase 5: Decision
```bash
# If all checks pass:
git add apps/mobile/eas.json
git commit -m "feat: add EAS build configuration"
git push origin main

# Update progress
echo "✅ Task 1: EAS configuration complete" >> .copilot/works/codex_work_progress_and_reply.md
```

### Phase 6: Document
```bash
# Update checklist
# Mark "EAS Build configured" as ✅ in work_reports/00_FEATURE_CHECKLIST.md

# Update status
# Add entry to work_reports/01_PROJECT_STATUS.md

# Create test log
cat > .copilot/works/test_log/$(date +%y%m%d%H%M%S)_log_eas_config.md << EOF
## Test: EAS Build Configuration
**Date:** $(date)
**Status:** ✅ PASS

### Files Created:
- apps/mobile/eas.json

### Verification Results:
- ✅ JSON syntax valid
- ✅ EAS CLI accepts configuration
- ✅ Preview and production profiles present
- ✅ iOS and Android configured

### Issues: None
EOF
```

### Phase 7: Checkpoint
```bash
git add -A
git commit -m "checkpoint: Phase 0.B Task 9 - EAS configuration complete"
git push origin main
```

---

## 🔍 MONITORING & METRICS

Track Codex performance to identify issues:

```bash
# Create metrics file
cat > .copilot/works/codex_metrics.md << EOF
# Codex Performance Metrics

## Task Success Rate
- Total Tasks: 0
- Successful: 0
- Failed: 0
- Success Rate: 0%

## Average Retry Count
- Tasks requiring 0 retries: 0
- Tasks requiring 1 retry: 0
- Tasks requiring 2 retries: 0
- Tasks requiring 3 retries: 0
- Average: 0

## Common Failure Patterns
[Track patterns as they emerge]

## Improvements Made
[Document workflow improvements]
EOF
```

Update after each task to track patterns.

---

## ✅ WORKFLOW VALIDATION CHECKLIST

Before starting major migration, validate this workflow:

- [ ] Codex CLI installed and working
- [ ] Can delegate simple task successfully
- [ ] Quality gates work as expected
- [ ] Error recovery procedures tested
- [ ] Logging and tracking functional
- [ ] Retry mechanism works
- [ ] Manual fallback available
- [ ] Metrics tracking setup

---

**Last Updated:** February 4, 2026  
**Version:** 2.0  
**Status:** Ready for Production Use

---

**Next:** Demonstrate this workflow with a test task before Phase 0.B
