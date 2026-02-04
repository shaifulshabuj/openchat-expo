# 🚂 Railway Deployment Skill

## Purpose
Deploy NestJS backend to Railway.

## Prerequisites
- Railway CLI: `npm install -g @railway/cli`

## Workflow

### Deploy
```bash
cd apps/api
railway login
railway init
railway up
```

### Check Status
```bash
railway logs
railway status
```

## Quality Gates
- ✅ Deployment succeeds
- ✅ Health endpoint responds
