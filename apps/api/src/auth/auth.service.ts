import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TRPCError } from '@trpc/server';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { registerSchema, RegisterInput } from './dto/register.dto';
import { loginSchema, LoginInput } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    // Validate input
    const validatedInput = registerSchema.parse(input);

    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: validatedInput.email },
    });

    if (existingEmail) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already registered',
      });
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: validatedInput.username },
    });

    if (existingUsername) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username already taken',
      });
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(
      validatedInput.password,
    );

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: validatedInput.email,
        username: validatedInput.username,
        password: hashedPassword,
        displayName: validatedInput.displayName || validatedInput.username,
        status: 'OFFLINE',
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: 'Registration successful',
      user,
    };
  }

  async login(input: LoginInput) {
    // Validate input
    const validatedInput = loginSchema.parse(input);

    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedInput.identifier },
          { username: validatedInput.identifier },
        ],
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    // Validate password
    const isPasswordValid = await this.passwordService.validatePassword(
      validatedInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    // Generate access token (15 minutes)
    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    // Generate refresh token (7 days)
    const refreshToken = this.jwtService.sign(
      { userId: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    // Update user status to ONLINE
    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: 'ONLINE', lastSeen: new Date() },
    });

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        status: 'ONLINE',
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900, // 15 minutes in seconds
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'OFFLINE', lastSeen: new Date() },
    });

    return {
      success: true,
      message: 'Logout successful',
    };
  }
}
