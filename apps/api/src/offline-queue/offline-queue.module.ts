import { Module, Global } from '@nestjs/common';
import { OfflineQueueService } from './offline-queue.service';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD || undefined,
        });
      },
    },
    OfflineQueueService,
  ],
  exports: [OfflineQueueService, 'REDIS_CLIENT'],
})
export class OfflineQueueModule {}
