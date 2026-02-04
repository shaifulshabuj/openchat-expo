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
  IconButton,
  Icon,
  Pressable,
  ScrollView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!identifier) {
      newErrors.identifier = 'Email or username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password);

      toast.show({
        description: 'Login successful! Welcome back.',
        placement: 'top',
      });

      // Navigate to home screen
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Show error message
      const errorMessage = error.message || 'Invalid credentials. Please try again.';
      toast.show({
        description: errorMessage,
        placement: 'top',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <ScrollView flex={1} bg="white">
      <Box safeArea flex={1}>
        <VStack space={4} px={6} py={8}>
          <Heading size="xl" mb={2}>
            Welcome Back
          </Heading>
          <Text color="gray.600" mb={4}>
            Sign in to continue to OpenChat
          </Text>

          {/* Identifier Input (Email or Username) */}
          <FormControl isInvalid={!!errors.identifier}>
            <FormControl.Label>Email or Username</FormControl.Label>
            <Input
              placeholder="Enter email or username"
              value={identifier}
              onChangeText={(value) => {
                setIdentifier(value);
                if (errors.identifier) {
                  setErrors((prev) => ({ ...prev, identifier: undefined }));
                }
              }}
              autoCapitalize="none"
              autoComplete="username"
              size="lg"
            />
            {errors.identifier && (
              <FormControl.ErrorMessage>
                {errors.identifier}
              </FormControl.ErrorMessage>
            )}
            <FormControl.HelperText>
              You can use either your email or username
            </FormControl.HelperText>
          </FormControl>

          {/* Password Input with Toggle */}
          <FormControl isInvalid={!!errors.password}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              placeholder="Enter password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              type={showPassword ? 'text' : 'password'}
              autoCapitalize="none"
              autoComplete="password"
              size="lg"
              InputRightElement={
                <IconButton
                  icon={
                    <Icon
                      as={MaterialIcons}
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size="sm"
                      color="gray.400"
                    />
                  }
                  onPress={() => setShowPassword(!showPassword)}
                  mr={1}
                />
              }
            />
            {errors.password && (
              <FormControl.ErrorMessage>
                {errors.password}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          {/* Remember Me & Forgot Password */}
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Checkbox
              value="remember"
              isChecked={rememberMe}
              onChange={setRememberMe}
            >
              <Text fontSize="sm">Remember me</Text>
            </Checkbox>

            <Pressable onPress={handleForgotPassword}>
              <Text color="blue.600" fontSize="sm" fontWeight="medium">
                Forgot Password?
              </Text>
            </Pressable>
          </Box>

          {/* Login Button */}
          <Button
            onPress={handleLogin}
            isLoading={isLoading}
            isDisabled={isLoading}
            size="lg"
            mt={4}
          >
            Sign In
          </Button>

          {/* Divider */}
          <Box flexDirection="row" alignItems="center" my={4}>
            <Box flex={1} height="1px" bg="gray.300" />
            <Text px={3} color="gray.500" fontSize="sm">
              OR
            </Text>
            <Box flex={1} height="1px" bg="gray.300" />
          </Box>

          {/* Register Link */}
          <Pressable onPress={handleRegister}>
            <Text textAlign="center" color="gray.600">
              Don't have an account?{' '}
              <Text color="blue.600" fontWeight="medium">
                Sign Up
              </Text>
            </Text>
          </Pressable>

          {/* Test Credentials (Development Only - Remove for Production) */}
          {__DEV__ && (
            <Box mt={8} p={4} bg="gray.100" borderRadius="md">
              <Text fontSize="xs" color="gray.600" fontWeight="bold" mb={2}>
                Test Credentials:
              </Text>
              <Text fontSize="xs" color="gray.600">
                Email: test@example.com
              </Text>
              <Text fontSize="xs" color="gray.600">
                Username: testuser
              </Text>
              <Text fontSize="xs" color="gray.600">
                Password: Password123!
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </ScrollView>
  );
}
