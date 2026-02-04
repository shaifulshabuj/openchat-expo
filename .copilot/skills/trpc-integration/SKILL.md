# 🔗 tRPC Integration Skill

## Purpose
Setup end-to-end type-safe API calls between NestJS and Expo.

## Workflow

### Backend Router
```typescript
export const chatsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chat.findMany()
  }),
})
```

### Frontend Usage
```typescript
const { data } = trpc.chats.list.useQuery()
```

## Quality Gates
- ✅ Types auto-complete in frontend
- ✅ API calls work end-to-end
