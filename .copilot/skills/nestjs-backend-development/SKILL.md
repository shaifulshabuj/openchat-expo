# 🖥️ NestJS Backend Development Skill

## Purpose
Guide NestJS API development with modules, services, controllers, and guards.

## Prerequisites
- Node.js 20+ installed
- pnpm installed
- PostgreSQL running

## Workflow

### 1. Start Development
```bash
cd apps/api
pnpm run dev              # Development with watch
pnpm run build            # Production build
pnpm run test             # Run tests
```

### 2. Create Module
```bash
nest g module chats
nest g service chats
nest g controller chats
```

### 3. Example Service
```typescript
@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.chat.findMany({
      where: { participants: { some: { id: userId } } },
    })
  }
}
```

## Quality Gates
- ✅ Build succeeds
- ✅ Tests pass
- ✅ API responds

## Common Issues
- Port in use: Change PORT in .env
- Prisma outdated: `prisma generate`
