import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcController } from './trpc/trpc.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { MessageModule } from './message/message.module';
import { ReactionModule } from './reaction/reaction.module';

@Module({
  imports: [PrismaModule, AuthModule, SocketModule, MessageModule, ReactionModule],
  controllers: [AppController, TrpcController],
  providers: [AppService],
})
export class AppModule {}
