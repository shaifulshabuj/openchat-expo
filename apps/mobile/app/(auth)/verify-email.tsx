import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Heading,
  useToast,
} from 'native-base';
import { useRouter } from 'expo-router';
import { trpcClient } from '../../utils/trpc';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast.show({
        description: 'Please enter a valid 6-digit code',
        placement: 'top',
      });
      return;
    }

    if (!email) {
      toast.show({
        description: 'Please enter your email address',
        placement: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await trpcClient.auth.verifyEmail.mutate({
        email,
        token: code, // API expects 'token' not 'code'
      });

      if (result.success) {
        toast.show({
          description: 'Email verified successfully! You can now login.',
          placement: 'top',
          duration: 3000,
        });
        router.push('/(auth)/login');
      } else {
        toast.show({
          description: result.message || 'Verification failed',
          placement: 'top',
        });
      }
    } catch (error: any) {
      toast.show({
        description: error.message || 'Verification failed. Please try again.',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.show({
        description: 'Please enter your email address',
        placement: 'top',
      });
      return;
    }

    setIsResending(true);
    try {
      const result = await trpcClient.auth.resendVerification.mutate({ email });

      if (result.success) {
        toast.show({
          description: 'Verification code resent! Check your email.',
          placement: 'top',
        });
      } else {
        toast.show({
          description: result.message || 'Failed to resend code',
          placement: 'top',
        });
      }
    } catch (error: any) {
      toast.show({
        description: error.message || 'Failed to resend code',
        placement: 'top',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <VStack space={4} px={6} py={8}>
        <Heading size="xl" mb={2}>
          Verify Your Email
        </Heading>
        <Text color="gray.600" mb={4}>
          We've sent a 6-digit code to your email. Please enter it below.
        </Text>

        <Input
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          size="lg"
          mb={2}
        />

        <Input
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          size="lg"
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
        />

        <Button
          onPress={handleVerify}
          isLoading={isLoading}
          isDisabled={isLoading || isResending}
          size="lg"
          mt={4}
        >
          Verify Email
        </Button>

        <Button
          variant="link"
          mt={2}
          onPress={handleResendCode}
          isLoading={isResending}
          isDisabled={isResending || isLoading}
        >
          Resend Code
        </Button>

        <Button variant="ghost" onPress={() => router.back()}>
          Back to Registration
        </Button>
      </VStack>
    </Box>
  );
}
