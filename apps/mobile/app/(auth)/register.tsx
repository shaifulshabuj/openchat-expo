import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Checkbox,
  Heading,
  useToast,
  FormControl,
  WarningOutlineIcon,
  Pressable,
  ScrollView,
} from 'native-base';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { z } from 'zod';

// Validation schema
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = registerSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleRegister = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check terms agreement
    if (!agreedToTerms) {
      toast.show({
        description: 'Please agree to the Terms & Conditions',
        placement: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.email, formData.username, formData.password);
      
      toast.show({
        description: 'Registration successful! Please check your email to verify your account.',
        duration: 5000,
        placement: 'top',
      });

      // Navigate to email verification screen
      router.push('/(auth)/verify-email');
    } catch (error: any) {
      toast.show({
        description: error.message || 'Registration failed. Please try again.',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView flex={1} bg="white">
      <Box safeArea>
        <VStack space={4} px={6} py={8}>
          <Heading size="xl" mb={2}>
            Create Account
          </Heading>
          <Text color="gray.600" mb={4}>
            Sign up to get started with OpenChat
          </Text>

          {/* Email Input */}
          <FormControl isInvalid={!!errors.email}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              placeholder="you@example.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              size="lg"
            />
            {errors.email && (
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.email}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          {/* Username Input */}
          <FormControl isInvalid={!!errors.username}>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              placeholder="username"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              autoCapitalize="none"
              autoComplete="username"
              size="lg"
            />
            {errors.username && (
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.username}
              </FormControl.ErrorMessage>
            )}
            <FormControl.HelperText>
              3-20 characters, letters, numbers, and underscores only
            </FormControl.HelperText>
          </FormControl>

          {/* Password Input */}
          <FormControl isInvalid={!!errors.password}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              type="password"
              autoCapitalize="none"
              autoComplete="password-new"
              size="lg"
            />
            {errors.password && (
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.password}
              </FormControl.ErrorMessage>
            )}
            <FormControl.HelperText>
              Minimum 8 characters
            </FormControl.HelperText>
          </FormControl>

          {/* Confirm Password Input */}
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              type="password"
              autoCapitalize="none"
              size="lg"
            />
            {errors.confirmPassword && (
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.confirmPassword}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          {/* Terms & Conditions */}
          <Checkbox
            value="terms"
            isChecked={agreedToTerms}
            onChange={setAgreedToTerms}
            mt={2}
          >
            <Text fontSize="sm">
              I agree to the{' '}
              <Text color="blue.600" fontWeight="medium">
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text color="blue.600" fontWeight="medium">
                Privacy Policy
              </Text>
            </Text>
          </Checkbox>

          {/* Register Button */}
          <Button
            onPress={handleRegister}
            isLoading={isLoading}
            isDisabled={isLoading}
            size="lg"
            mt={4}
          >
            Create Account
          </Button>

          {/* Login Link */}
          <Pressable onPress={() => router.push('/(auth)/login')} mt={4}>
            <Text textAlign="center" color="gray.600">
              Already have an account?{' '}
              <Text color="blue.600" fontWeight="medium">
                Login
              </Text>
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </ScrollView>
  );
}
