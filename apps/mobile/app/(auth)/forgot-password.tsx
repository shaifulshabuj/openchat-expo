import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  FormControl,
} from 'native-base';
import { useRouter } from 'expo-router';
import { trpcClient } from '../../utils/trpc';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const toast = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await trpcClient.auth.requestPasswordReset.mutate({ email });

      if (result.success) {
        toast.show({
          description: 'Password reset instructions sent! Check your email.',
          placement: 'top',
          duration: 5000,
        });

        // Navigate back to login
        router.back();
      } else {
        toast.show({
          description: result.message || 'Failed to send reset email',
          placement: 'top',
        });
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.show({
        description: error.message || 'Failed to send reset email. Please try again.',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <VStack space={4} px={6} py={8}>
        <Heading size="xl" mb={2}>
          Forgot Password?
        </Heading>
        <Text color="gray.600" mb={4}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <FormControl isInvalid={!!error}>
          <FormControl.Label>Email Address</FormControl.Label>
          <Input
            placeholder="you@example.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            size="lg"
          />
          {error && (
            <FormControl.ErrorMessage>
              {error}
            </FormControl.ErrorMessage>
          )}
        </FormControl>

        <Button
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={isLoading}
          size="lg"
          mt={4}
        >
          Send Reset Link
        </Button>

        <Button
          variant="ghost"
          onPress={() => router.back()}
          isDisabled={isLoading}
        >
          Back to Login
        </Button>
      </VStack>
    </Box>
  );
}
