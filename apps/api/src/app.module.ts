import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcController } from './trpc/trpc.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { MessageModule } from './message/message.module';
import { ReactionModule } from './reaction/reaction.module';
import { MediaModule } from './media/media.module';
import { OfflineQueueModule } from './offline-queue/offline-queue.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    SocketModule,
    MessageModule,
    ReactionModule,
    MediaModule,
    OfflineQueueModule,
  ],
  controllers: [AppController, TrpcController],
  providers: [AppService],
})
export class AppModule {}
