import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export interface SessionData {
  userId: string;
  sessionId: string;
  deviceInfo?: string;
  ipAddress?: string;
  loginTime: Date;
  lastActivity: Date;
}

@Injectable()
export class SessionService implements OnModuleDestroy {
  private readonly logger = new Logger(SessionService.name);
  private redis: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl);
    
    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async createSession(data: SessionData): Promise<void> {
    const key = `session:${data.userId}:${data.sessionId}`;
    const ttl = 7 * 24 * 60 * 60; // 7 days in seconds
    
    await this.redis.setex(
      key,
      ttl,
      JSON.stringify(data),
    );
    
    this.logger.log(`Session created for user ${data.userId}`);
  }

  async getActiveSessions(userId: string): Promise<SessionData[]> {
    const pattern = `session:${userId}:*`;
    const keys = await this.redis.keys(pattern);
    const sessions: SessionData[] = [];
    
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        sessions.push(JSON.parse(data));
      }
    }
    
    // Sort by last activity (most recent first)
    return sessions.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  }

  async getSession(userId: string, sessionId: string): Promise<SessionData | null> {
    const key = `session:${userId}:${sessionId}`;
    const data = await this.redis.get(key);
    
    return data ? JSON.parse(data) : null;
  }

  async updateActivity(userId: string, sessionId: string): Promise<void> {
    const key = `session:${userId}:${sessionId}`;
    const data = await this.redis.get(key);
    
    if (data) {
      const session = JSON.parse(data) as SessionData;
      session.lastActivity = new Date();
      
      const ttl = 7 * 24 * 60 * 60; // Reset TTL to 7 days
      await this.redis.setex(key, ttl, JSON.stringify(session));
    }
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const key = `session:${userId}:${sessionId}`;
    const result = await this.redis.del(key);
    
    this.logger.log(`Session ${sessionId} revoked for user ${userId}`);
    return result > 0;
  }

  async revokeAllSessions(userId: string): Promise<number> {
    const pattern = `session:${userId}:*`;
    const keys = await this.redis.keys(pattern);
    
    if (keys.length > 0) {
      const result = await this.redis.del(...keys);
      this.logger.log(`${result} sessions revoked for user ${userId}`);
      return result;
    }
    
    return 0;
  }

  async cleanupExpiredSessions(): Promise<void> {
    // Redis automatically removes expired keys, so this is just for logging
    this.logger.log('Redis automatically cleans up expired sessions via TTL');
  }
}
