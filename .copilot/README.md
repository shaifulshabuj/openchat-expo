# 📚 OpenChat Expo - Copilot Development System

**Last Updated:** February 4, 2026  
**Status:** ✅ Complete & Production Ready  
**Version:** 2.0 (with Codex CLI integration)

## 📖 Key Documents

### ⭐ Start Here
1. **`CODEX_CLI_USAGE.md`** - Complete Codex CLI reference (NEW!)
2. **`instructions/ORCHESTRATOR.md`** - 7-phase workflow
3. **`CODEX_WORKFLOW.md`** - Delegation & error handling
4. **`skills/SKILL_INDEX.md`** - Which skill for which task

### Quick Reference
- **CODEX_CLI_USAGE.md** - How to use Codex effectively
- **STATUS.md** - Current project status
- **WORKFLOW_DEMO_SUMMARY.md** - Validation results

## 🚀 Quick Start

### Check Context
```bash
cat .copilot/works/codex_next_priorities.md  # What's next?
git status                                    # Current state?
```

### Execute Task
```bash
# Small tasks (1-5 min, 1-3 files)
codex exec --full-auto -C /path/to/openchat-expo \
  "Task with Files:, Pattern:, Expected:, Verify:"
```

### Verify & Commit
```bash
git diff              # Review changes
pnpm build           # Build check
pnpm type-check      # Type check
git commit -m "..."  # Commit
```

## 🎯 Core Principles

1. **Small Tasks** - 1-5 min, 1-3 files, clear outcome
2. **Quality Gates** - Always verify build + types + task-specific
3. **Document** - Track progress, metrics, test logs
4. **Manual Fallback** - Works with/without Codex

## 📊 Work Tracking

- `works/codex_next_priorities.md` - Task queue
- `works/codex_work_progress_and_reply.md` - Progress log
- `works/codex_metrics.md` - Metrics
- `works/test_log/` - Test logs

## 🎓 Skills (10 total)

1. expo-mobile-development
2. expo-e2e-testing
3. nestjs-backend-development
4. trpc-integration
5. prisma-schema-management
6. socketio-realtime
7. docker-compose-local
8. eas-build-deployment
9. railway-deployment
10. spec-progress-tracking

**See `skills/SKILL_INDEX.md` for details**

---

**Ready for Phase 0.B and 77-feature migration!**
