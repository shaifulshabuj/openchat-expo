import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { registerSchema, RegisterInput } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
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
        passwordHash: hashedPassword,
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
}
