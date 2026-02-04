import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // Mock email sending - log to console
    this.logger.log(`
═══════════════════════════════════════════════════════
📧 EMAIL VERIFICATION
═══════════════════════════════════════════════════════
To: ${email}
Subject: Verify your OpenChat account

Hello!

Your verification code is: ${token}

This code will expire in 24 hours.

To verify your email, use this code in the app or click:
http://localhost:3000/verify-email?token=${token}

Thanks,
OpenChat Team
═══════════════════════════════════════════════════════
    `);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // Mock email sending - log to console
    this.logger.log(`
═══════════════════════════════════════════════════════
🔐 PASSWORD RESET
═══════════════════════════════════════════════════════
To: ${email}
Subject: Reset your OpenChat password

Hello!

Your password reset token is: ${token}

This token will expire in 1 hour.

To reset your password, use this token in the app or click:
http://localhost:3000/reset-password?token=${token}

If you didn't request this, please ignore this email.

Thanks,
OpenChat Team
═══════════════════════════════════════════════════════
    `);
  }
}
