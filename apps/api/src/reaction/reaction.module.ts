import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}
