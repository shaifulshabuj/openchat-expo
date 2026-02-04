# 📋 Copilot Master Prompts Guide

This guide is for **GitHub Copilot** to create and execute master prompts that orchestrate the OpenChat Expo migration.

---

## 🎯 Purpose

Master prompts provide:
- **High-level orchestration** for features or phases
- **Task decomposition** into atomic Codex tasks
- **Progress tracking** across multiple tasks
- **Quality validation** for complete features
- **Documentation coordination** across sessions

---

## 📁 File Naming Convention

```
<Task Serial>_YYYYMMDD.prompts.md
```

**Examples:**
- `001_20260204.prompts.md` - Task 1 created on Feb 4, 2026
- `002_20260205.prompts.md` - Task 2 created on Feb 5, 2026
- `010_20260210.prompts.md` - Task 10 created on Feb 10, 2026

**Rules:**
- Task Serial: 3-digit zero-padded number (001, 002, ..., 999)
- Date: YYYYMMDD format (year-month-day)
- Extension: `.prompts.md` (always)

---

## 📝 Master Prompt Template

```markdown
# Master Prompt XXX: [Feature/Phase Name]

**Date:** YYYY-MM-DD HH:MM JST  
**Phase:** [Phase name]  
**Type:** [Feature / Phase / Multi-Task]  
**Estimated Duration:** [Hours/Days]  
**Codex Tasks:** [X tasks]

---

## 🎯 Objective

[1-2 paragraph description of the feature or phase goal]

---

## 📋 Context

### Current State:
- [What exists now]
- [Dependencies met]

### Desired State:
- [What should exist after]
- [Success indicators]

### Why This Master Prompt:
- [Strategic importance]
- [How it fits in migration plan]
- [Relationship to other features]

---

## 🧩 Task Decomposition

This master prompt breaks down into the following Codex tasks:

### Codex Task 1: [Task Name]
- **File:** `CODEX_XXX_YYYYMMDD.prompts.md`
- **What:** [Brief description]
- **Files:** [Files to modify]
- **Time:** [Estimated minutes]
- **Status:** [NOT STARTED / IN PROGRESS / COMPLETE]

### Codex Task 2: [Task Name]
- **File:** `CODEX_XXX_YYYYMMDD.prompts.md`
- **What:** [Brief description]
- **Files:** [Files to modify]
- **Time:** [Estimated minutes]
- **Status:** [NOT STARTED / IN PROGRESS / COMPLETE]

[... repeat for all tasks ...]

**Total Codex Tasks:** X  
**Total Estimated Time:** Y minutes

---

## 🔄 Execution Workflow

### Phase 1: DISCOVER
**Actions:**
- [ ] Read `.copilot/works/codex_next_priorities.md`
- [ ] Read `work_reports/01_PROJECT_STATUS.md`
- [ ] Check git status (clean working tree)
- [ ] Review feature specification
- [ ] Identify dependencies

**Success Criteria:**
- All prerequisites met
- Clear understanding of current state
- No blocking issues

---

### Phase 2: DECOMPOSE (Already Done)
**This master prompt has pre-decomposed tasks:**
- X Codex tasks identified
- Each task is atomic (1-5 min, 1-3 files)
- Dependencies mapped
- Quality gates defined

---

### Phase 3: DELEGATE

For each Codex task:

**Step 1:** Create or verify Codex prompt exists
```bash
# Check if prompt exists
ls .copilot/prompts/CODEX_XXX_YYYYMMDD.prompts.md

# If not, create using CODEX_README.md template
```

**Step 2:** Execute via Codex CLI (or manual fallback)
```bash
# Primary: Codex CLI
codex exec --full-auto -C /path "$(cat .copilot/prompts/CODEX_XXX_YYYYMMDD.prompts.md)"

# Fallback: Manual execution
cat .copilot/prompts/CODEX_XXX_YYYYMMDD.prompts.md
# Follow steps manually
```

**Step 3:** Wait for completion and capture output

---

### Phase 4: VERIFY

After each Codex task:
- [ ] Run quality gates from Codex prompt
- [ ] Verify files modified correctly
- [ ] Check no unintended changes
- [ ] Test on target platform (if applicable)

After all Codex tasks:
- [ ] Feature works end-to-end
- [ ] All quality gates pass
- [ ] No regressions introduced
- [ ] Performance acceptable

---

### Phase 5: DOCUMENT

After completing all tasks:

**Update 5 Required Files:**

1. **`.copilot/works/codex_work_progress_and_reply.md`**
   ```markdown
   ## Master Prompt XXX Complete

   **Feature:** [Name]
   **Date:** [Date]
   **Codex Tasks:** X/X complete
   **Time:** [Actual vs estimated]
   **Issues:** [Any issues encountered]
   ```

2. **`work_reports/01_PROJECT_STATUS.md`**
   ```markdown
   ## ✅ Latest Progress (Date) - [FEATURE NAME COMPLETE]
   - Feature description
   - Key accomplishments
   - Phase progress updated
   ```

3. **`work_reports/00_FEATURE_CHECKLIST.md`**
   - Update feature status to ✅
   - Mark sub-features complete

4. **`.copilot/works/codex_metrics.md`**
   - Master prompt metrics
   - Codex task breakdown
   - Time accuracy

5. **`CHANGELOG.md`**
   - Feature entry with changes
   - Breaking changes (if any)

---

### Phase 6: CHECKPOINT

**Actions:**
- [ ] Review all changes: `git diff`
- [ ] Stage changes: `git add -A`
- [ ] Commit with clear message
- [ ] Push to GitHub
- [ ] Update master prompt status to COMPLETE
- [ ] Move to next master prompt

**Commit Message Format:**
```
✨ feat: [Feature name]

ADDED:
- [List additions]

CHANGED:
- [List changes]

VERIFIED:
- [Quality checks passed]

CODEX TASKS: X/X complete
TIME: Y minutes (estimated: Z minutes)
```

---

## 📊 Master Prompt Types

### Type 1: Single Feature
**Characteristics:**
- 1-3 Codex tasks
- Single user-facing feature
- 1-2 hour duration

**Example:** "Add biometric authentication"
- Codex Task 1: Add expo-local-authentication
- Codex Task 2: Create auth service
- Codex Task 3: Wire up login UI

---

### Type 2: Feature Group
**Characteristics:**
- 4-8 Codex tasks
- Related features (same domain)
- 4-8 hour duration

**Example:** "Authentication System"
- Multiple related features
- Shared backend/state
- Complex integration

---

### Type 3: Phase Completion
**Characteristics:**
- 10+ Codex tasks
- Complete phase milestone
- 1-2 day duration

**Example:** "Phase 0.B: Project Scaffolding"
- Infrastructure setup
- Multiple tools/frameworks
- Foundation for future work

---

## ✅ Quality Standards for Master Prompts

### Before Creating:
- [ ] Objective is clear and measurable
- [ ] All Codex tasks identified (atomic, 1-5 min each)
- [ ] Dependencies mapped
- [ ] Success criteria defined
- [ ] Documentation plan clear

### During Execution:
- [ ] Follow 6-phase workflow exactly
- [ ] Verify each Codex task before next
- [ ] Document issues immediately
- [ ] Update status continuously

### After Completion:
- [ ] All 5 documentation files updated
- [ ] All quality gates passed
- [ ] Changes committed and pushed
- [ ] Master prompt marked COMPLETE

---

## 🎯 Integration with Codex

### Relationship:
```
Master Prompt (Copilot)
├── Orchestrates overall feature
├── Manages progress tracking
└── Delegates atomic tasks to:
    ├── CODEX_001_*.prompts.md
    ├── CODEX_002_*.prompts.md
    └── CODEX_XXX_*.prompts.md
```

### When to Create Codex Prompts:
- **Pre-created:** Master prompt references existing Codex prompts
- **On-the-fly:** Copilot creates Codex prompt as needed during execution
- **Template-based:** Use `.copilot/prompts/CODEX_README.md` template

### How to Delegate:
```bash
# Read Codex task guide
cat .copilot/prompts/CODEX_README.md

# Execute Codex task
codex exec --full-auto -C /path "$(cat .copilot/prompts/CODEX_XXX_YYYYMMDD.prompts.md)"

# Or manual fallback
cat .copilot/prompts/CODEX_XXX_YYYYMMDD.prompts.md
# Follow steps manually
```

---

## 📋 Master Prompt Lifecycle

### 1. Planning
- Read migration plan and feature specifications
- Identify next feature/phase to implement
- Determine if feature needs master prompt
- Create master prompt with task breakdown

### 2. Preparation
- Ensure all Codex prompts exist or create them
- Verify prerequisites met
- Check for blocking issues
- Estimate total time

### 3. Execution
- Follow 6-phase workflow
- Execute Codex tasks sequentially
- Verify after each task
- Handle errors with rollback plans

### 4. Completion
- Update all documentation
- Run final verification
- Commit and push
- Mark master prompt complete

### 5. Retrospective
- Compare estimated vs actual time
- Note issues encountered
- Improve future prompts
- Update metrics

---

## 📁 Directory Structure

```
.copilot/prompts/
├── README.md (this file - Master prompts guide)
├── CODEX_README.md (Codex CLI tasks guide)
│
├── Master Prompts (Copilot):
│   ├── 001_20260204.md (Phase 0.B: Scaffolding)
│   ├── 002_20260207.md (Phase 1: Auth System)
│   ├── 003_20260214.md (Phase 2: Messaging)
│   └── ...
│
└── Codex Tasks (atomic):
    ├── CODEX_001_20260204.prompts.md (Init Expo)
    ├── CODEX_002_20260204.prompts.md (NativeBase)
    ├── CODEX_003_20260205.prompts.md (NativeWind)
    └── ...
```

---

## 🎓 Best Practices

### DO:
- ✅ Break features into atomic Codex tasks
- ✅ Follow 6-phase workflow strictly
- ✅ Verify after each Codex task
- ✅ Update documentation continuously
- ✅ Use Codex CLI when available
- ✅ Have manual fallback ready
- ✅ Track time for accuracy improvement

### DON'T:
- ❌ Skip verification steps
- ❌ Execute tasks without prerequisites
- ❌ Forget documentation updates
- ❌ Continue after failed quality gates
- ❌ Create master prompts for single atomic tasks
- ❌ Delegate to Codex without clear prompts

---

## 📊 Tracking Progress

### Master Prompts:
```bash
# Count total
ls -1 .copilot/prompts/[0-9]*.md | wc -l

# Count complete
grep -l "Status: COMPLETE" .copilot/prompts/[0-9]*.md | wc -l

# Current progress
echo "$(grep -l "Status: COMPLETE" .copilot/prompts/[0-9]*.md | wc -l) / $(ls -1 .copilot/prompts/[0-9]*.md | wc -l)"
```

### Related Codex Tasks:
```bash
# From master prompt, list related Codex tasks
grep "CODEX_" .copilot/prompts/001_20260204.md

# Check their status
grep -l "Status: COMPLETE" .copilot/prompts/CODEX_*.prompts.md
```

---

## 🔗 Related Documentation

**Core Workflow:**
- `.github/copilot.instructions.md` - Overall orchestrator instructions
- `.copilot/instructions/ORCHESTRATOR.md` - 7-phase protocol
- `rules.md` - 41 development rules
- `AGENT.md` - Agent behavior

**Task Execution:**
- `.copilot/prompts/CODEX_README.md` - Codex task guide (delegate here)
- `.copilot/CODEX_CLI_USAGE.md` - Codex command reference
- `.copilot/CODEX_WORKFLOW.md` - Delegation workflow

**Progress Tracking:**
- `.copilot/works/codex_next_priorities.md` - Task queue
- `work_reports/01_PROJECT_STATUS.md` - Current status
- `work_reports/00_FEATURE_CHECKLIST.md` - Feature tracking

---

## ✅ Master Prompt Quality Checklist

Before finalizing a master prompt:
- [ ] Objective is feature-level (not task-level)
- [ ] All Codex tasks are atomic (1-5 min, 1-3 files)
- [ ] Dependencies clearly identified
- [ ] Success criteria measurable
- [ ] 6-phase workflow defined
- [ ] Documentation plan complete
- [ ] Rollback strategy exists
- [ ] Time estimate realistic

---

## 🎯 Success Metrics

**Good Master Prompt:**
- Copilot executes without questions
- All Codex tasks complete successfully
- Documentation updated correctly
- Feature works end-to-end
- Time estimate accurate (±20%)

**Poor Master Prompt:**
- Unclear objective or scope
- Tasks not atomic enough
- Missing dependencies
- Quality gates undefined
- Documentation incomplete

---

**Created:** February 4, 2026 14:15 JST  
**Version:** 1.0  
**Purpose:** Guide Copilot in creating and executing master prompts for 77-feature migration
