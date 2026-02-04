# 📁 .github Directory - GitHub Configuration

This directory contains GitHub-specific configuration files and instructions for the OpenChat Expo project.

## 📚 Contents

### **copilot.instructions.md** ⭐ (17KB)
Main instruction document for GitHub Copilot orchestrator.

**Purpose:**
- Defines 7-phase workflow protocol
- Task decomposition guidelines (1-5 min, 1-3 files)
- Quality gates for all task types
- Documentation update requirements (5 files per task)
- Session management protocols

**Why here:**
GitHub Copilot automatically discovers instruction files in the `.github/` directory. No additional configuration needed!

**Quick Start:**
```bash
# Read at start of every session
cat .github/copilot.instructions.md

# Also read
cat rules.md  # 41 development rules
cat AGENT.md  # Agent behavior guidelines
```

---

### **workflows/** (GitHub Actions)
CI/CD pipeline configuration.

**Files:**
- `ci.yml` - Continuous Integration workflow
  - Runs on push and PR
  - Type checks, builds, tests
  - Multi-OS (Ubuntu, macOS, Windows)

---

### **skills/** (Future)
GitHub Copilot skills for specialized tasks.

**Planned:**
- Code review skills
- Documentation generation
- Test generation

---

## 🎯 Master Documents Hierarchy

```
.github/copilot.instructions.md (TOP LEVEL - Read first)
├── ../rules.md (Constraints - Check always)
├── ../AGENT.md (Behavior - Follow always)
└── ../.copilot/
    ├── instructions/ORCHESTRATOR.md (Technical 7-phase workflow)
    ├── CODEX_CLI_USAGE.md (Codex command reference)
    ├── CODEX_WORKFLOW.md (Delegation process)
    └── skills/ (10 task-specific workflows)
```

---

## 🚀 How GitHub Copilot Uses This

When you work in the openchat-expo repository:

1. **Automatic Discovery:**
   - GitHub Copilot reads `.github/copilot.instructions.md`
   - No manual configuration needed
   - Instructions apply to all development sessions

2. **Consistent Behavior:**
   - All agents follow same workflow
   - Quality gates enforced
   - Documentation mandatory

3. **Integration:**
   - Works with Codex CLI sub-agent
   - Follows 41 rules from `rules.md`
   - Behavior defined in `AGENT.md`

---

## 📖 Quick Reference

### Every Session:
```bash
# 1. Read instructions
cat .github/copilot.instructions.md

# 2. Check priorities
cat .copilot/works/codex_next_priorities.md

# 3. Check git status
git status

# 4. Start work following 7-phase workflow
```

### Every Task:
1. Break into 1-5 min pieces (1-3 files)
2. Execute via Codex or manually
3. Verify quality gates
4. Update 5 documentation files
5. Commit with clear message

---

## 🎯 Key Principles

From `copilot.instructions.md`:

1. **Small Tasks Always** (1-5 min, 1-3 files max)
2. **Documentation Always** (5 files per task)
3. **Quality Gates Always** (before every commit)
4. **Temporary Files in tmp/** (not in project root)
5. **Clear Communication** (structured updates)

---

**For complete details, see:**
- `.github/copilot.instructions.md` - Main instructions
- `../rules.md` - 41 development rules
- `../AGENT.md` - Agent behavior
- `../MASTER_DOCUMENTS_SUMMARY.md` - Complete overview
