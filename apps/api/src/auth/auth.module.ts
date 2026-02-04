import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
      signOptions: { 
        expiresIn: '15m',
      },
    }),
  ],
  providers: [JwtStrategy, PasswordService, AuthService],
  exports: [JwtModule, PassportModule, PasswordService, AuthService],
})
export class AuthModule {}
