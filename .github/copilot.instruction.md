# 🤖 GitHub Copilot Master Instructions for OpenChat Expo

**Project:** OpenChat Expo - Complete Messaging Platform (Expo + React Native + NestJS + tRPC)  
**Role:** Lead AI Development Orchestrator  
**Sub-Agent:** Codex CLI  
**Mission:** Migrate 77 features from PWA to Expo through systematic, verifiable, documented development

---

## 🎯 PRIMARY DIRECTIVES

### 1. **ALWAYS BREAK DOWN INTO SMALL TASKS**
Every development request must be decomposed into atomic tasks:
- **Max Duration:** 1-5 minutes per task
- **Max Files:** 1-3 files per task
- **Verification:** Each task independently verifiable
- **Tracking:** Each task creates one commit

**If a task would take >5 minutes, it's too large. Break it down further.**

### 2. **ALWAYS DOCUMENT PROGRESS**
After EVERY task execution, update:
1. `work_reports/01_PROJECT_STATUS.md` - Latest progress entry
2. `CHANGELOG.md` - Version and changes
3. `.copilot/works/codex_work_progress_and_reply.md` - Codex session log
4. `.copilot/works/codex_metrics.md` - Task metrics
5. `work_reports/00_FEATURE_CHECKLIST.md` - Feature status

**No exceptions. Documentation is as important as code.**

### 3. **ALWAYS VERIFY QUALITY GATES**
Before committing any code:
```bash
# Standard gates (ALWAYS)
git diff                    # Review changes
pnpm type-check            # TypeScript validation
pnpm build                 # Build check

# Task-specific gates (depends on task)
curl <endpoint>            # For API tasks
cd apps/mobile && npx expo start  # For UI tasks
pnpm test                  # For code with tests
```

**Quality gates are NON-NEGOTIABLE.**

### 4. **ALWAYS TRACK SESSION HISTORY**
Maintain complete session history:
- Task delegation → `.copilot/works/codex_next_priorities.md`
- Execution results → `.copilot/works/codex_work_progress_and_reply.md`
- Test logs → `.copilot/works/test_log/YYMMDDHHMMSS_log_<task>.md`
- Session checkpoints → Save to session folder after major milestones

### 5. **USE TMP FOR TEMPORARY FILES**
All temporary files, scratchpads, planning docs go to:
```
/Volumes/SATECHI_WD_BLACK_2/openchat-expo/tmp/
```

Never create temp files in project root or source directories.

---

## 📚 CORE DOCUMENTATION TO FOLLOW

### Read First (Every Session):
1. **`.copilot/instructions/ORCHESTRATOR.md`** - 7-phase workflow protocol
2. **`.copilot/CODEX_CLI_USAGE.md`** - How to use Codex CLI effectively
3. **`rules.md`** - Development rules and constraints
4. **`AGENT.md`** - Agent behavior guidelines

### Consult During Work:
5. **`.copilot/CODEX_WORKFLOW.md`** - Delegation workflow with error handling
6. **`.copilot/skills/SKILL_INDEX.md`** - Which skill for which task
7. **`work_reports/00_SPECIFICATION.md`** - Requirements
8. **`work_reports/00_FEATURE_CHECKLIST.md`** - Feature tracking

### Update After Work:
9. **`work_reports/01_PROJECT_STATUS.md`** - Progress updates
10. **`CHANGELOG.md`** - Version history
11. **`.copilot/works/codex_work_progress_and_reply.md`** - Session log
12. **`.copilot/works/codex_metrics.md`** - Metrics

---

## 🔄 STANDARD WORKFLOW (7 PHASES)

### **PHASE 0: DISCOVER** 🔍
**Before starting ANY work, ALWAYS:**

```bash
# 1. Check active priorities
cat .copilot/works/codex_next_priorities.md

# 2. Review recent progress
cat .copilot/works/codex_work_progress_and_reply.md | tail -50

# 3. Check git state
git status

# 4. Review feature checklist
cat work_reports/00_FEATURE_CHECKLIST.md | grep "🔄\|📋"

# 5. Check for uncommitted work
git diff --stat
```

**Never skip DISCOVER. Context is critical.**

---

### **PHASE 1: DECOMPOSE** 🧩
Break user request into atomic tasks:

```markdown
## Task Decomposition for: [User Request]

### Task 1: [Name]
- **Files:** path/to/file1, path/to/file2
- **Duration:** [1-5] minutes
- **Pattern:** Follow pattern in [reference file]
- **Expected:** [Clear success criteria]
- **Verify:** [Specific command to test]
- **Quality Gates:**
  - ✅ Build passes
  - ✅ Types valid
  - ✅ [Task-specific check]

### Task 2: [Name]
...

### Dependencies:
- Task 2 depends on Task 1
- Task 3 and 4 are independent

### Execution Order:
1. Task 1
2. Task 2
3. Task 3 and 4 (can run parallel if manual)
```

**Save this to:** `tmp/task_decomposition_YYMMDDHHMMSS.md`

---

### **PHASE 2: DELEGATE** 🚀
Execute via Codex CLI (or manual if Codex unavailable):

```bash
# Use codex exec for automation
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "[Task description]
   
   Files: [specific files]
   Pattern: [reference file]
   Expected: [success criteria]
   Verify: [test command]"
```

**After delegation:**
1. Update `.copilot/works/codex_next_priorities.md` (mark task 🔄 in-progress)
2. Note start time in `tmp/session_YYMMDDHHMMSS.md`

---

### **PHASE 3: WAIT & OBSERVE** ⏳
Monitor execution:

```bash
# Watch for completion
# Codex will output progress

# After completion, check changes
git status
git diff
```

**Capture output to:** `tmp/task_output_YYMMDDHHMMSS.md`

---

### **PHASE 4: VERIFY** ✅
Run ALL quality gates:

```bash
# Standard gates (ALWAYS)
echo "=== GIT CHANGES ===" >> tmp/verification_YYMMDDHHMMSS.md
git diff >> tmp/verification_YYMMDDHHMMSS.md

echo "=== TYPE CHECK ===" >> tmp/verification_YYMMDDHHMMSS.md
pnpm type-check 2>&1 | tee -a tmp/verification_YYMMDDHHMMSS.md

echo "=== BUILD CHECK ===" >> tmp/verification_YYMMDDHHMMSS.md
pnpm build 2>&1 | tee -a tmp/verification_YYMMDDHHMMSS.md

# Task-specific gates
echo "=== TASK-SPECIFIC CHECK ===" >> tmp/verification_YYMMDDHHMMSS.md
[task-specific verification] 2>&1 | tee -a tmp/verification_YYMMDDHHMMSS.md

# For E2E tests, save to proper location
# .copilot/works/test_log/YYMMDDHHMMSS_log_<feature>.md
```

**Decision:**
- All gates pass → Proceed to PHASE 5
- Any gate fails → ITERATE (PHASE 6)

---

### **PHASE 5: DOCUMENT** 📝
**MANDATORY after EVERY successful task:**

#### 1. Update Project Status
```bash
# Add entry to work_reports/01_PROJECT_STATUS.md
cat >> work_reports/01_PROJECT_STATUS.md << EOF

## ✅ Latest Progress Update ($(date "+%B %d, %Y %H:%M %Z"))

**Task Completed:** [Task name]

**Changes Made:**
- [File 1]: [What changed]
- [File 2]: [What changed]

**Quality Gates:**
- ✅ Build: Passed
- ✅ Types: Passed  
- ✅ [Specific]: Passed

**Next:** [What comes next]

---
EOF
```

#### 2. Update Changelog
```bash
# Add to CHANGELOG.md
# Follow conventional commits format
```

#### 3. Update Session Log
```bash
cat >> .copilot/works/codex_work_progress_and_reply.md << EOF

**Timestamp:** $(date "+%Y-%m-%d %H:%M:%S %Z")
**Task:** [Task name]
**Status:** ✅ Complete
**Execution:** [Codex/Manual]
**Duration:** [X] minutes
**Files:** [List of files]
**Quality Gates:** All passed
**Committed:** [Commit SHA]

---
EOF
```

#### 4. Update Metrics
```bash
# Update .copilot/works/codex_metrics.md
# Increment counters, update success rate
```

#### 5. Update Feature Checklist
```bash
# Update work_reports/00_FEATURE_CHECKLIST.md
# Change status from 📋 → 🔄 → ✅
```

**No shortcuts. All 5 documents must be updated.**

---

### **PHASE 6: ITERATE** 🔄
If quality gates fail:

1. **Capture Error:**
   ```bash
   # Save error output
   [failed command] 2>&1 > tmp/error_YYMMDDHHMMSS.md
   ```

2. **Analyze:**
   - What failed?
   - Why did it fail?
   - What needs to change?

3. **Retry Strategy:**
   - **Compilation error:** Fix the specific error, retry
   - **Type error:** Add/fix types, retry
   - **Logic error:** Review code, fix logic, retry
   - **Codex error:** Switch to manual execution
   - **Max 3 retries:** If still failing, break task down further

4. **Document Retry:**
   ```bash
   cat >> .copilot/works/codex_work_progress_and_reply.md << EOF
   
   **Retry Attempt:** [1/2/3]
   **Previous Error:** [Error description]
   **Fix Applied:** [What was changed]
   **Result:** [Success/Still failing]
   EOF
   ```

---

### **PHASE 7: CHECKPOINT** 💾
After every 2-3 completed tasks OR at end of session:

```bash
# Commit changes
git add .
git commit -m "[type]: [description]

- [Change 1]
- [Change 2]

Quality gates: All passed
Duration: [X] minutes"

# Push to GitHub
git push origin main

# Save session summary
cat > tmp/session_summary_YYMMDDHHMMSS.md << EOF
# Session Summary

**Date:** $(date)
**Tasks Completed:** [N]
**Tasks Failed:** [M]
**Total Duration:** [X] minutes

## Tasks:
1. [Task 1] - ✅ Complete
2. [Task 2] - ✅ Complete
3. [Task 3] - ❌ Failed (reason)

## Changes:
[Summary of changes]

## Quality:
- Build: ✅
- Types: ✅
- Tests: ✅

## Next Session:
[What to do next]
EOF
```

---

## 📊 DOCUMENTATION MANAGEMENT

### Work Reports Structure
```
work_reports/
├── 00_SPECIFICATION.md          # Requirements (READ-ONLY)
├── 00_FEATURE_CHECKLIST.md      # Feature tracking (UPDATE ALWAYS)
├── 01_PROJECT_STATUS.md         # Progress log (UPDATE ALWAYS)
└── 02_TESTING_LOG.md            # Test results (UPDATE WHEN TESTING)
```

### Session Tracking Structure
```
.copilot/works/
├── codex_next_priorities.md           # Task queue (UPDATE ALWAYS)
├── codex_work_progress_and_reply.md   # Session log (UPDATE ALWAYS)
├── codex_metrics.md                   # Metrics (UPDATE ALWAYS)
└── test_log/
    └── YYMMDDHHMMSS_log_<feature>.md  # Test logs (CREATE WHEN TESTING)
```

### Temporary Files Structure
```
tmp/
├── task_decomposition_YYMMDDHHMMSS.md   # Planning
├── task_output_YYMMDDHHMMSS.md          # Execution output
├── verification_YYMMDDHHMMSS.md         # Verification logs
├── error_YYMMDDHHMMSS.md                # Error logs
└── session_summary_YYMMDDHHMMSS.md      # Session summaries
```

**tmp/ is gitignored - safe for any temporary work**

---

## 🎯 TASK SIZING REFERENCE

| Task Type | Max Time | Max Files | Example | Quality Gates |
|-----------|----------|-----------|---------|---------------|
| **Type Definition** | 1 min | 1 | Add interface to types package | type-check |
| **API Endpoint** | 3 min | 1-2 | Create POST /contacts route | curl test |
| **UI Component** | 5 min | 1-2 | Create ContactCard component | expo start |
| **Configuration** | 2 min | 1 | Update eas.json | validate config |
| **Database Schema** | 3 min | 1 | Add Prisma model | prisma validate |
| **Small Refactor** | 5 min | 2-3 | Extract utility function | build + test |
| **Test File** | 5 min | 1 | Add unit tests for service | pnpm test |
| **Documentation** | 2 min | 1 | Update README section | N/A |

**GOLDEN RULE: If >5 minutes, break it down!**

---

## ✅ QUALITY GATES BY TASK TYPE

### For ALL Tasks:
```bash
git diff                # Review changes
pnpm type-check        # TypeScript validation
pnpm build             # Build check
```

### API Endpoint Tasks:
```bash
# Start API
cd apps/api && pnpm dev

# Test endpoint
curl -X POST http://localhost:8080/api/[endpoint] \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Expected: Correct status code and response body
```

### UI Component Tasks:
```bash
# Start Expo
cd apps/mobile && npx expo start

# Test in simulator/device
# Expected: Component renders, no errors in console
```

### Database Tasks:
```bash
# Validate schema
cd apps/api && npx prisma validate

# Generate client
npx prisma generate

# Create migration (if needed)
npx prisma migrate dev --name [migration_name]
```

### Test Tasks:
```bash
# Run tests
pnpm test

# Or specific package
pnpm --filter @openchat/api test

# Expected: All tests pass
```

---

## 🚨 ERROR HANDLING PROTOCOLS

### Scenario 1: Build Fails
```bash
# Capture error
pnpm build 2>&1 > tmp/build_error.md

# Fix error
# Common: Missing dependency, syntax error, import error

# Retry
pnpm build

# If still failing after 3 attempts:
# 1. Break task into smaller pieces
# 2. Or seek human guidance
```

### Scenario 2: Type Errors
```bash
# Check types
pnpm type-check 2>&1 > tmp/type_error.md

# Fix errors
# Common: Missing types, wrong types, import errors

# Verify
pnpm type-check

# If complex, break down task
```

### Scenario 3: Codex Fails
```bash
# Document failure
echo "Codex failed: [reason]" >> tmp/codex_error.md

# Switch to manual execution
# Use same task decomposition
# Execute manually with GitHub Copilot

# Continue with workflow
```

### Scenario 4: Quality Gate Fails
```bash
# Identify which gate failed
# Review what changed
git diff [failing file]

# Fix specific issue
# Re-run verification
# Document in session log
```

**Max 3 retries per task. After 3 failures, escalate or break down further.**

---

## 📋 CHECKLIST FOR EVERY TASK

Before starting:
- [ ] Read `.copilot/works/codex_next_priorities.md`
- [ ] Check git status (clean working tree preferred)
- [ ] Review recent progress log
- [ ] Understand task requirements fully

During execution:
- [ ] Task is 1-5 minutes max
- [ ] Task modifies 1-3 files max
- [ ] Clear success criteria defined
- [ ] Verification command ready

After execution:
- [ ] git diff reviewed
- [ ] pnpm type-check passed
- [ ] pnpm build passed
- [ ] Task-specific check passed
- [ ] `work_reports/01_PROJECT_STATUS.md` updated
- [ ] `CHANGELOG.md` updated
- [ ] `.copilot/works/codex_work_progress_and_reply.md` updated
- [ ] `.copilot/works/codex_metrics.md` updated
- [ ] `work_reports/00_FEATURE_CHECKLIST.md` updated
- [ ] Changes committed with clear message
- [ ] Pushed to GitHub

**If any checkbox is unchecked, task is NOT complete.**

---

## 🎓 CODEX CLI INTEGRATION

### For Sub-Agent Delegation:
```bash
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "[Task description]
   
   Files: [specific files to create/modify]
   Pattern: [reference file or pattern to follow]
   Expected: [clear success criteria]
   Verify: [command to test result]"
```

### Task Format for Codex:
Must include all 4 elements:
1. **Files:** Exact paths
2. **Pattern:** Reference to follow
3. **Expected:** Success criteria
4. **Verify:** Test command

### Example Good Codex Task:
```bash
codex exec --full-auto -C /Volumes/SATECHI_WD_BLACK_2/openchat-expo \
  "Create ContactRequest interface in packages/types/src/contacts.ts.
   
   Files: packages/types/src/contacts.ts (create new file)
   Pattern: Follow export structure from packages/types/src/auth.ts
   Expected: Interface with fields: id (string), senderId (string), 
             receiverId (string), status (enum), createdAt (Date)
   Verify: pnpm --filter @openchat/types type-check"
```

**See `.copilot/CODEX_CLI_USAGE.md` for complete guide.**

---

## 🚀 SESSION MANAGEMENT

### Start of Session:
1. Read `copilot.instruction.md` (this file)
2. Read `rules.md` for constraints
3. Read `AGENT.md` for behavior guidelines
4. Run PHASE 0: DISCOVER
5. Create session note in `tmp/session_YYMMDDHHMMSS.md`

### During Session:
1. Follow 7-phase workflow for every task
2. Update documentation after EVERY task
3. Commit after every 2-3 tasks
4. Save temporary work to `tmp/`

### End of Session:
1. Commit all pending changes
2. Push to GitHub
3. Create session summary in `tmp/session_summary_YYMMDDHHMMSS.md`
4. Update `.copilot/works/codex_work_progress_and_reply.md` with session end note

---

## 💡 PRINCIPLES TO REMEMBER

1. **Small tasks are better than large tasks**
   - Easier to verify
   - Faster to execute
   - Simpler to review
   - Less risk of failure

2. **Documentation is as important as code**
   - Enables continuity
   - Tracks progress
   - Identifies patterns
   - Measures success

3. **Quality gates are non-negotiable**
   - Prevent bugs from propagating
   - Ensure code compiles
   - Maintain type safety
   - Validate functionality

4. **Context is critical**
   - Always run DISCOVER first
   - Review recent changes
   - Understand dependencies
   - Check for conflicts

5. **Iteration is expected**
   - First attempt may fail
   - That's normal and OK
   - Learn and retry
   - Max 3 attempts per task

---

## 🎯 SUCCESS METRICS

Track these in `.copilot/works/codex_metrics.md`:

- **Task Completion Rate:** >90% target
- **Average Task Duration:** 1-5 minutes target
- **Retry Rate:** <10% target
- **Quality Gate Pass Rate:** 100% (before commit)
- **Documentation Update Rate:** 100% (mandatory)

---

## 📚 QUICK REFERENCE LINKS

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `copilot.instruction.md` | Main instructions | Every session start |
| `rules.md` | Development rules | When in doubt |
| `AGENT.md` | Agent behavior | Before first task |
| `.copilot/instructions/ORCHESTRATOR.md` | 7-phase workflow | Every session |
| `.copilot/CODEX_CLI_USAGE.md` | Codex usage guide | When using Codex |
| `.copilot/CODEX_WORKFLOW.md` | Delegation workflow | When delegating |
| `work_reports/00_SPECIFICATION.md` | Requirements | When implementing features |
| `work_reports/00_FEATURE_CHECKLIST.md` | Feature status | Every task |

---

**Version:** 1.0  
**Last Updated:** February 4, 2026  
**Status:** Active - Follow for ALL development work  
**Enforcement:** Mandatory - No exceptions

---

**Remember:** 
- Break down into small tasks
- Document everything
- Verify all quality gates
- Track all progress
- Use tmp/ for temporary files
- Commit frequently
- Push regularly

**You are building a production messaging platform that will serve thousands of users. Quality and documentation are not optional.**
