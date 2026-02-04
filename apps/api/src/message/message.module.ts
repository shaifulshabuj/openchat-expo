import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';
import { OfflineQueueModule } from '../offline-queue/offline-queue.module';

@Module({
  imports: [PrismaModule, SocketModule, OfflineQueueModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
