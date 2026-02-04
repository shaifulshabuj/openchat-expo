# 📚 Master Instruction Documents Summary

**Date:** February 4, 2026 13:40 JST  
**Status:** ✅ COMPLETE  
**Purpose:** Comprehensive instruction system for OpenChat Expo development

---

## 🎯 WHAT WAS CREATED

### 3 Master Documents (49KB total):

1. **`copilot.instruction.md`** (17KB)
   - Main instructions for GitHub Copilot orchestrator
   - Complete 7-phase workflow protocol
   - Task decomposition guidelines
   - Quality gates definition
   - Documentation update requirements
   - Session management
   - Checklists for every task type

2. **`rules.md`** (16KB)
   - 41 development rules across 10 categories
   - 10 Absolute Rules (NEVER break)
   - 5 Strong Recommendations  
   - 26 Project-Specific Rules
   - Architecture boundaries
   - Technology stack enforcement
   - Security requirements

3. **`AGENT.md`** (16KB)
   - Agent behavior and identity
   - How to think (mental models)
   - How to act (standard procedures)
   - How to communicate (with users, Codex, docs)
   - Decision-making framework
   - Error handling protocols
   - Self-monitoring and improvement

---

## �� DOCUMENT STRUCTURE

### copilot.instruction.md

**Primary Directives:**
1. Always break down into small tasks (1-5 min, 1-3 files)
2. Always document progress (5 files per task)
3. Always verify quality gates
4. Always track session history
5. Use tmp/ for temporary files

**7-Phase Workflow:**
- PHASE 0: DISCOVER - Load context before starting
- PHASE 1: DECOMPOSE - Break into atomic tasks
- PHASE 2: DELEGATE - Execute via Codex or manually
- PHASE 3: WAIT & OBSERVE - Monitor execution
- PHASE 4: VERIFY - Run quality gates
- PHASE 5: DOCUMENT - Update all tracking files
- PHASE 6: ITERATE - Handle failures (max 3 retries)
- PHASE 7: CHECKPOINT - Commit and push

**Documentation Management:**
- Work reports: Status, changelogs, feature checklists
- Session tracking: Priorities, progress, metrics, test logs
- Temporary files: Planning, outputs, errors, summaries

**Quality Gates by Task Type:**
- ALL: git diff + type-check + build
- API: curl test
- UI: expo start + manual test
- Database: prisma validate
- Tests: pnpm test

---

### rules.md

**41 Rules in 10 Categories:**

1. **Absolute Rules (1-10)** - NEVER BREAK
   - Never commit without quality gates
   - Never work on >5 minute tasks
   - Never skip documentation
   - Never create temp files in root
   - Never modify >3 files per task
   - Never commit without verification
   - Never use vague commit messages
   - Never retry >3 times
   - Never ignore type errors
   - Never deploy without testing

2. **Strong Recommendations (11-15)**
   - Prefer Codex CLI
   - Prefer small commits
   - Prefer existing patterns
   - Prefer type-safe over any
   - Prefer explicit over implicit

3. **Architecture Rules (16-19)**
   - Monorepo structure must be maintained
   - Package boundaries must be respected
   - Types must be shared via @openchat/types

4. **Technology Stack (20-23)**
   - Use Expo for mobile
   - Use NestJS for backend
   - Use tRPC for API communication
   - Use Prisma for database
   - Use NativeWind for styling

5. **Code Quality (24-26)**
   - All functions must have clear purpose
   - Error handling must be explicit
   - Async operations must be awaited

6. **Testing (27-28)**
   - E2E tests go in proper location
   - Test logs must include timestamp

7. **Git & Version Control (29-30)**
   - Branch strategy (main for now)
   - Conventional commit format

8. **Security (31-33)**
   - No secrets in code
   - Use .env files
   - Passwords must be hashed

9. **Performance (34-35)**
   - Minimize bundle size
   - Use pagination for lists

10. **Task-Specific (36-41)**
    - API: validation + error handling
    - UI: typed props + feedback
    - Database: descriptive migrations + timestamps

---

### AGENT.md

**Core Identity:**
- Systematic executor (not cowboy coder)
- Quality guardian (never compromise)
- Documentation machine (track everything)
- Task decomposer (small is better)
- Verification bot (test always)

**How to Think:**
1. Think in atomic tasks (1-5 min, 1-3 files)
2. Think in quality gates (pass/fail criteria)
3. Think in documentation (5 files to update)
4. Think in patterns (follow existing)
5. Think in failure scenarios (what could go wrong)

**How to Act:**
1. Always start with DISCOVER
2. Always decompose before executing
3. Always verify before committing
4. Always document after completing
5. Always commit with clear messages

**How to Communicate:**
- With users: Clear progress, specific errors, helpful questions
- With Codex: Structured tasks (Files/Pattern/Expected/Verify)
- In docs: Factual updates with timestamps and metrics

**Decision Framework:**
1. Does it follow rules?
2. Does it maintain consistency?
3. Does it improve quality?
4. Is it the simplest solution?
5. Is it properly documented?

**Error Handling:**
- 1st failure: Retry same approach
- 2nd failure: Try different approach
- 3rd failure: Break down or escalate
- NEVER retry 4th time

**Self-Monitoring:**
- Track task duration, retry rate, quality gate pass rate
- Target: >90% completion, <10% retry, 100% documentation
- Reflect after each session
- Document learnings in patterns.md

---

## 🎯 KEY PRINCIPLES ENFORCED

### 1. Small Tasks Always
**Before:** "Implement contact request feature"  
**After:** 
- Task 1: Create types (1 min, 1 file)
- Task 2: Add API endpoint (3 min, 1 file)
- Task 3: Create UI component (5 min, 2 files)
- Task 4: Wire up UI (2 min, 1 file)
- Task 5: Test E2E (5 min, 0 files)

### 2. Documentation Always
After EVERY task, update:
1. work_reports/01_PROJECT_STATUS.md
2. CHANGELOG.md
3. .copilot/works/codex_work_progress_and_reply.md
4. .copilot/works/codex_metrics.md
5. work_reports/00_FEATURE_CHECKLIST.md

### 3. Quality Gates Always
Before EVERY commit:
```bash
git diff                    # ✅
pnpm type-check            # ✅
pnpm build                 # ✅
[task-specific check]      # ✅
```

### 4. Temporary Files in tmp/
```
✅ tmp/decomposition_YYMMDDHHMMSS.md
✅ tmp/output_YYMMDDHHMMSS.md
✅ tmp/verification_YYMMDDHHMMSS.md
✅ tmp/error_YYMMDDHHMMSS.md

❌ planning.md in root
❌ notes.md in .copilot/
❌ scratch.txt anywhere
```

### 5. Clear Communication
```
✅ "Task 1 complete: Create ContactRequest interface (1 min, 1 file, all gates passed)"
❌ "done"

✅ "Error: Type check failed - missing User import. Fixing now."
❌ "something broke"

✅ feat: add contact request API endpoint

- Created POST /api/contacts/request
- Returns 201 with requestId
- Validates user IDs

Quality gates: All passed
❌ "updates"
```

---

## 📊 DOCUMENTATION MANAGEMENT SYSTEM

### File Update Requirements:

| Document | When to Update | What to Include |
|----------|----------------|-----------------|
| `work_reports/01_PROJECT_STATUS.md` | After EVERY task | Progress entry with timestamp, changes, quality gates, next steps |
| `CHANGELOG.md` | After EVERY task | Version entry with conventional commit format |
| `.copilot/works/codex_work_progress_and_reply.md` | After EVERY task | Task completion log with duration, files, status |
| `.copilot/works/codex_metrics.md` | After EVERY task | Metrics update (duration, retries, method) |
| `work_reports/00_FEATURE_CHECKLIST.md` | After EVERY task | Status change (📋 → 🔄 → ✅) |

### Temporary File Structure:

```
tmp/
├── README.md                         # Instructions
├── decomposition_YYMMDDHHMMSS.md    # Task breakdown
├── output_YYMMDDHHMMSS.md           # Execution output
├── verification_YYMMDDHHMMSS.md     # Quality gate results
├── error_YYMMDDHHMMSS.md            # Error logs
├── session_YYMMDDHHMMSS.md          # Session notes
└── session_summary_YYMMDDHHMMSS.md  # Session summary
```

**All tmp/ files are gitignored** - safe for any temporary work.

---

## ✅ CHECKLIST FOR EVERY TASK

**Before Starting:**
- [ ] Read copilot.instruction.md section relevant to task
- [ ] Check rules.md for applicable rules
- [ ] Run PHASE 0: DISCOVER (check priorities, progress, git status)
- [ ] Decompose task if >5 minutes

**During Execution:**
- [ ] Task is 1-5 minutes
- [ ] Task modifies 1-3 files
- [ ] Using proper patterns
- [ ] Following technology stack rules

**After Execution:**
- [ ] git diff reviewed
- [ ] pnpm type-check passed
- [ ] pnpm build passed
- [ ] Task-specific check passed
- [ ] work_reports/01_PROJECT_STATUS.md updated
- [ ] CHANGELOG.md updated
- [ ] .copilot/works/codex_work_progress_and_reply.md updated
- [ ] .copilot/works/codex_metrics.md updated
- [ ] work_reports/00_FEATURE_CHECKLIST.md updated
- [ ] Committed with clear message
- [ ] Pushed to GitHub

**If ANY checkbox unchecked → Task NOT complete**

---

## 🚀 HOW TO USE THESE DOCUMENTS

### For GitHub Copilot (Orchestrator):

**Every Session:**
1. Read `copilot.instruction.md` - Main workflow
2. Consult `rules.md` when making decisions
3. Follow `AGENT.md` behavior guidelines
4. Run PHASE 0: DISCOVER before any work

**During Work:**
1. Break tasks per guidelines (1-5 min, 1-3 files)
2. Execute via Codex CLI or manually
3. Verify all quality gates
4. Update all 5 documentation files
5. Commit with clear message

**End of Session:**
1. Create session summary in tmp/
2. Update progress logs
3. Push all changes
4. Note next priorities

### For Codex CLI (Sub-agent):

Codex receives structured tasks:
```bash
codex exec --full-auto -C /path/to/openchat-expo \
  "Task description
   Files: specific/paths
   Pattern: reference/file
   Expected: success/criteria
   Verify: test/command"
```

### For Developers Reviewing Work:

Check:
1. All rules followed? (rules.md)
2. Documentation updated? (copilot.instruction.md)
3. Quality gates passed? (copilot.instruction.md)
4. Patterns consistent? (AGENT.md)
5. Communication clear? (AGENT.md)

---

## 📈 EXPECTED IMPROVEMENTS

### Metrics Before Master Documents:
- Task size: Variable (10-30 min estimated)
- Documentation: Ad-hoc
- Quality gates: Inconsistent
- Retry rate: Unknown
- Pattern consistency: Variable

### Metrics After Master Documents:
- Task size: 1-5 minutes (enforced)
- Documentation: 100% (5 files per task)
- Quality gates: 100% before commit
- Retry rate: <10% (target)
- Pattern consistency: High (enforced)

### Success Indicators:
- ✅ All tasks complete with documentation
- ✅ All commits pass quality gates
- ✅ All code follows patterns
- ✅ All errors handled properly
- ✅ All progress tracked
- ✅ All sessions checkpointed

---

## 🎯 INTEGRATION WITH EXISTING SYSTEM

### These documents work with:

1. **`.copilot/instructions/ORCHESTRATOR.md`** - Technical 7-phase workflow
2. **`.copilot/CODEX_CLI_USAGE.md`** - Codex command reference
3. **`.copilot/CODEX_WORKFLOW.md`** - Delegation workflow
4. **`.copilot/skills/SKILL_INDEX.md`** - Skills mapping

### Hierarchy:
```
copilot.instruction.md (TOP LEVEL - Read first)
├── rules.md (Constraints - Check always)
├── AGENT.md (Behavior - Follow always)
└── .copilot/
    ├── instructions/ORCHESTRATOR.md (Technical details)
    ├── CODEX_CLI_USAGE.md (Tool reference)
    ├── CODEX_WORKFLOW.md (Delegation process)
    └── skills/ (Task-specific workflows)
```

---

## 💡 KEY INNOVATIONS

### 1. Mandatory Documentation
- No task complete without updating 5 files
- Ensures continuity across sessions
- Enables metrics and improvement

### 2. Strict Task Sizing
- 1-5 minutes maximum
- 1-3 files maximum
- Forces proper decomposition
- Enables fast iteration

### 3. Quality Gate Enforcement
- No commits without passing
- Prevents technical debt
- Maintains codebase health

### 4. Structured Communication
- Clear formats for all interactions
- Reduces ambiguity
- Improves delegation efficiency

### 5. Self-Monitoring System
- Agents track their own metrics
- Enables continuous improvement
- Identifies patterns

### 6. tmp/ Directory
- All temporary files isolated
- No clutter in project
- Safe for any scratchwork

---

## 🎉 READY FOR PRODUCTION

With these master documents, the OpenChat Expo development system is:

✅ **Complete** - All instruction levels covered  
✅ **Comprehensive** - 49KB of detailed guidance  
✅ **Enforced** - Clear rules with consequences  
✅ **Trackable** - Mandatory documentation system  
✅ **Improvable** - Self-monitoring and metrics  
✅ **Resilient** - Error handling at all levels  
✅ **Efficient** - Small tasks, fast iteration  
✅ **Quality-Focused** - Gates before every commit  

**NO BLOCKERS. READY TO MIGRATE 77 FEATURES.**

---

## 📚 QUICK START GUIDE

### To Start Working:

```bash
# 1. Read master documents (one time)
cat copilot.instruction.md  # Main instructions
cat rules.md                # Rules to follow
cat AGENT.md                # How to behave

# 2. Every session, run DISCOVER
cat .copilot/works/codex_next_priorities.md
git status

# 3. Break down task
# Save to: tmp/decomposition_YYMMDDHHMMSS.md

# 4. Execute each subtask
codex exec --full-auto "..." # Or manual

# 5. Verify quality gates
git diff
pnpm type-check
pnpm build

# 6. Update documentation (ALL 5)
# - work_reports/01_PROJECT_STATUS.md
# - CHANGELOG.md
# - .copilot/works/codex_work_progress_and_reply.md
# - .copilot/works/codex_metrics.md
# - work_reports/00_FEATURE_CHECKLIST.md

# 7. Commit
git add . && git commit -m "..."

# 8. Push
git push origin main
```

---

**Created:** February 4, 2026 13:40 JST  
**Documents:** copilot.instruction.md, rules.md, AGENT.md  
**Total Size:** 49KB  
**Status:** ✅ ACTIVE AND ENFORCED  
**Ready For:** Phase 0.B and entire 77-feature migration
