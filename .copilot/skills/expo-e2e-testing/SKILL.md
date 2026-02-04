# 🧪 Expo E2E Testing Skill

## Purpose
End-to-end testing using Maestro for user flow validation.

## Prerequisites
- Maestro: `curl -Ls "https://get.maestro.mobile.dev" | bash`

## Workflow

### Run Tests
```bash
cd apps/mobile
maestro test .maestro/
```

### Example Flow
```yaml
# .maestro/login.yaml
appId: com.openchat.expo
---
- launchApp
- tapOn: "Login"
- inputText: "test@example.com"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "Chats"
```

## Quality Gates
- ✅ Tests pass on iOS/Android
- ✅ Logs saved to test_log/
- ✅ No flaky tests
