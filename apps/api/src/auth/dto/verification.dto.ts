import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  token: z.string().min(6, 'Token must be at least 6 characters'),
});

export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
