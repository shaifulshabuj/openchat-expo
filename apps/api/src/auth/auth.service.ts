import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TRPCError } from '@trpc/server';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { EmailService } from './email.service';
import { registerSchema, RegisterInput } from './dto/register.dto';
import { loginSchema, LoginInput } from './dto/login.dto';
import { verifyEmailSchema, resendVerificationSchema, VerifyEmailInput, ResendVerificationInput } from './dto/verification.dto';
import { requestPasswordResetSchema, resetPasswordSchema, RequestPasswordResetInput, ResetPasswordInput } from './dto/password-reset.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  private generate6DigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

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

    // Generate email verification token
    const verificationToken = this.generate6DigitCode();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours expiry

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: validatedInput.email,
        username: validatedInput.username,
        password: hashedPassword,
        displayName: validatedInput.displayName || validatedInput.username,
        status: 'OFFLINE',
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
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

  async verifyEmail(input: VerifyEmailInput) {
    const validatedInput = verifyEmailSchema.parse(input);

    const user = await this.prisma.user.findUnique({
      where: { email: validatedInput.email },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email already verified',
      };
    }

    if (!user.emailVerificationToken) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No verification token found. Please request a new one.',
      });
    }

    if (user.emailVerificationToken !== validatedInput.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid verification token',
      });
    }

    if (user.emailVerificationTokenExpiry && user.emailVerificationTokenExpiry < new Date()) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Verification token has expired. Please request a new one.',
      });
    }

    // Mark email as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  async resendVerification(input: ResendVerificationInput) {
    const validatedInput = resendVerificationSchema.parse(input);

    const user = await this.prisma.user.findUnique({
      where: { email: validatedInput.email },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email already verified',
      };
    }

    // Generate new verification token
    const verificationToken = this.generate6DigitCode();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    };
  }

  async requestPasswordReset(input: RequestPasswordResetInput) {
    const validatedInput = requestPasswordResetSchema.parse(input);

    const user = await this.prisma.user.findUnique({
      where: { email: validatedInput.email },
    });

    if (!user) {
      // Don't reveal if email exists
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate password reset token
    const resetToken = this.generateToken(32);
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // 1 hour expiry

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: tokenExpiry,
      },
    });

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(input: ResetPasswordInput) {
    const validatedInput = resetPasswordSchema.parse(input);

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: validatedInput.token,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired reset token',
      });
    }

    if (user.passwordResetTokenExpiry && user.passwordResetTokenExpiry < new Date()) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Reset token has expired. Please request a new one.',
      });
    }

    // Hash new password
    const hashedPassword = await this.passwordService.hashPassword(
      validatedInput.newPassword,
    );

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    };
  }
}
