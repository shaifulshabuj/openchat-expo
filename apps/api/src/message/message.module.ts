import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
