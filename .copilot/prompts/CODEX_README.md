# 📋 Codex CLI Task Prompts Guide

This guide is for **Codex CLI** to execute atomic development tasks with clear instructions, quality gates, and verification steps.

---

## 🎯 Purpose

Codex CLI task prompts provide:
- **Clear instructions** for Codex CLI or manual execution
- **Quality gates** to verify completion
- **File references** for context
- **Expected outcomes** for validation
- **Documentation requirements** for tracking

---

## 📁 File Naming Convention

```
CODEX_<Task Serial>_YYYYMMDD.prompts.md
```

**Examples:**
- `CODEX_001_20260204.prompts.md` - Task 1 created on Feb 4, 2026
- `CODEX_002_20260205.prompts.md` - Task 2 created on Feb 5, 2026
- `CODEX_010_20260210.prompts.md` - Task 10 created on Feb 10, 2026

**Rules:**
- Prefix: `CODEX_` (always, identifies Codex CLI tasks)
- Task Serial: 3-digit zero-padded number (001, 002, ..., 999)
- Date: YYYYMMDD format (year-month-day)
- Extension: `.prompts.md` (always)

---

## 📝 Prompt Template

Each Codex task prompt MUST include these sections:

```markdown
# Task XXX: [Task Title]

**Date:** YYYY-MM-DD HH:MM JST  
**Phase:** [Phase name]  
**Estimated Time:** [X minutes]  
**Complexity:** [Simple/Moderate/Complex]  
**Files to Modify:** [1-3 files max]

---

## 🎯 Objective

[Clear 1-2 sentence description of what needs to be accomplished]

---

## 📋 Context

**Current State:**
- [What exists now]

**Desired State:**
- [What should exist after]

**Why This Task:**
- [Rationale and dependencies]

---

## 🔧 Implementation Steps

### Step 1: [Action]
**Command/Action:**
\```bash
# Commands to run
\```

**Expected Output:**
\```
Expected result
\```

**Verify:**
- [ ] Check 1
- [ ] Check 2

### Step 2: [Action]
[Repeat for each step]

---

## ✅ Quality Gates

**Standard Gates (ALL tasks):**
- [ ] `git diff` shows only intended changes
- [ ] `pnpm type-check` passes
- [ ] `pnpm build` succeeds
- [ ] No console errors

**Task-Specific Gates:**
- [ ] [Specific check for this task]
- [ ] [Another specific check]

---

## 📚 Files to Reference

**Read these for context:**
- `path/to/file1.ts` - [Why to read this]
- `path/to/file2.ts` - [Why to read this]

**Follow patterns from:**
- `path/to/example.ts` - [Pattern to follow]

---

## 📝 Documentation Updates Required

After completing this task, update:
1. `.copilot/works/codex_work_progress_and_reply.md`
2. `work_reports/01_PROJECT_STATUS.md`
3. `work_reports/00_FEATURE_CHECKLIST.md`
4. `.copilot/works/codex_metrics.md`
5. `CHANGELOG.md`

---

## �� Success Criteria

Task is complete when:
- [ ] All implementation steps done
- [ ] All quality gates pass
- [ ] All documentation updated
- [ ] Changes committed with clear message
- [ ] Verification completed

---

## 🚨 Rollback Plan

If task fails:
1. [Rollback step 1]
2. [Rollback step 2]
3. [How to restore previous state]

---

**Status:** [NOT STARTED / IN PROGRESS / COMPLETE / BLOCKED]  
**Assignee:** [Codex CLI / Manual]  
**Blocking Issues:** [None / Description]
\```

---

## 🎯 Integration with Workflow

### Codex CLI Execution (Primary):
```bash
# Execute Codex task prompt
codex exec --full-auto -C /path/to/openchat-expo "$(cat .copilot/prompts/CODEX_XXX_YYYYMMDD.prompts.md)"
```

### Manual Fallback:
If Codex CLI fails or is unavailable:
1. Read prompt file completely
2. Follow steps in order
3. Run quality gates after each step
4. Update documentation
5. Commit changes

### Called by GitHub Copilot:
When Copilot delegates tasks to Codex:
- Copilot reads this guide (CODEX_README.md)
- Copilot creates/updates Codex prompts following this template
- Copilot executes via `codex exec` command or manual fallback
- Copilot verifies results against quality gates
- Copilot updates all required documentation

---

## 📁 Directory Structure

```
.copilot/prompts/
├── README.md (Copilot master prompts guide)
├── CODEX_README.md (this file - Codex CLI tasks guide)
│
├── Master Prompts (for Copilot orchestration):
│   ├── 001_20260204.md (Phase 0.B: Scaffolding)
│   ├── 002_20260207.md (Phase 1: Auth System)
│   └── ...
│
└── Codex Tasks (atomic, 1-5 min each):
    ├── CODEX_001_20260204.prompts.md (Init Expo)
    ├── CODEX_002_20260204.prompts.md (NativeBase)
    ├── CODEX_003_20260205.prompts.md (NativeWind)
    └── ...
```

**Two Prompt Types:**
1. **CODEX_*.prompts.md** - Atomic tasks for Codex CLI execution (1-5 min, 1-3 files)
2. **XXX_YYYYMMDD.md** - Master prompts for Copilot orchestration (delegates to Codex tasks)

---

## 📊 Task Types & Sizing

### Simple Tasks (1-2 min, 1 file)
**Examples:**
- Type definitions
- Configuration files
- Simple utilities

**Template Adjustments:**
- Fewer implementation steps
- Basic quality gates
- Quick verification

### Moderate Tasks (3-5 min, 2-3 files)
**Examples:**
- API endpoints
- UI components
- Database migrations

**Template Adjustments:**
- Standard implementation steps
- Full quality gates
- Platform testing

### Complex Tasks (5 min, 3 files MAX)
**Examples:**
- Feature integrations
- Real-time connections
- Native integrations

**Template Adjustments:**
- Detailed implementation steps
- Extended quality gates
- Comprehensive testing

**⚠️ RULE:** If task takes >5 min, BREAK IT DOWN into smaller tasks

---

## 🎓 Best Practices

### DO:
- ✅ Keep prompts atomic (1-3 files max)
- ✅ Include all quality gates
- ✅ Reference existing patterns
- ✅ Document expected outcomes
- ✅ Plan rollback strategy
- ✅ Update all 5 documentation files

### DON'T:
- ❌ Create prompts for >5 min tasks
- ❌ Skip quality gates
- ❌ Forget documentation updates
- ❌ Use vague instructions
- ❌ Ignore dependencies
- ❌ Commit without verification

---

## 📊 Tracking Progress

**View all Codex tasks:**
```bash
ls -1 .copilot/prompts/CODEX_*.prompts.md | wc -l
```

**Count completed:**
```bash
grep -l "Status: COMPLETE" .copilot/prompts/CODEX_*.prompts.md | wc -l
```

**Find blocked tasks:**
```bash
grep -l "Status: BLOCKED" .copilot/prompts/CODEX_*.prompts.md
```

**Next task to execute:**
```bash
grep -l "Status: NOT STARTED" .copilot/prompts/CODEX_*.prompts.md | head -1
```

---

## 🔗 Related Documentation

**For Copilot Orchestration:**
- `.copilot/prompts/README.md` - Master prompts guide (Copilot reads this to delegate)
- `.github/copilot.instructions.md` - Overall orchestrator instructions
- `.copilot/instructions/ORCHESTRATOR.md` - 7-phase protocol

**For Codex Execution:**
- `.copilot/CODEX_CLI_USAGE.md` - Complete Codex command reference
- `.copilot/CODEX_WORKFLOW.md` - Delegation workflow
- `rules.md` - 41 development rules
- `AGENT.md` - Agent behavior guidelines

**For Progress Tracking:**
- `.copilot/works/codex_next_priorities.md` - Task queue
- `work_reports/01_PROJECT_STATUS.md` - Current status
- `work_reports/00_FEATURE_CHECKLIST.md` - Feature tracking

---

## ✅ Codex Prompt Quality Checklist

Before creating a Codex prompt, ensure:
- [ ] Task is atomic (1-3 files, 1-5 min)
- [ ] Objective is clear and measurable
- [ ] Implementation steps are detailed
- [ ] Quality gates are defined
- [ ] Documentation updates listed
- [ ] Success criteria are clear
- [ ] Rollback plan is provided
- [ ] File references are accurate
- [ ] Dependencies are noted

---

## 🎯 Success Metrics

**Good Codex Prompt Indicators:**
- Codex/human can execute without questions
- Quality gates catch all issues
- Documentation updates are clear
- Rollback plan works if needed
- Task completes in estimated time

**Poor Codex Prompt Indicators:**
- Vague instructions require clarification
- Missing quality gates allow bugs
- Documentation updates forgotten
- No rollback plan causes issues
- Task takes much longer than estimated

---

**Created:** February 4, 2026 14:20 JST  
**Last Updated:** February 4, 2026 14:20 JST  
**Version:** 1.0  
**Purpose:** Guide for Codex CLI to execute atomic development tasks
