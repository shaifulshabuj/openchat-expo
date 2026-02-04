import React, { useState, useEffect } from 'react';
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
  HStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { BiometricService } from '../../src/lib/biometric';
import { storage } from '../../src/lib/storage';

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

  // Biometric state
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('');

  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const status = await BiometricService.getBiometricStatus();
    setBiometricAvailable(status.available);
    setBiometricType(status.message);

    if (status.available) {
      const enabled = await BiometricService.isBiometricLoginEnabled();
      setBiometricEnabled(enabled);
    }
  };

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

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      // Authenticate using biometrics
      const result = await BiometricService.authenticate('Login to OpenChat');

      if (!result.success) {
        toast.show({
          description: result.error || 'Biometric authentication failed',
          placement: 'top',
        });
        setIsLoading(false);
        return;
      }

      // Get stored user credentials
      const storedUser = await storage.getUser();
      if (!storedUser || !storedUser.email) {
        toast.show({
          description: 'No saved credentials found. Please login with password first.',
          placement: 'top',
        });
        setIsLoading(false);
        return;
      }

      // For biometric login, we need the stored token (already handled by AuthContext)
      // Just navigate to home if user is already authenticated
      toast.show({
        description: 'Login successful! Welcome back.',
        placement: 'top',
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Biometric login error:', error);
      toast.show({
        description: error.message || 'Biometric login failed',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
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

          {/* Biometric Login Button */}
          {biometricAvailable && biometricEnabled && (
            <Button
              variant="outline"
              onPress={handleBiometricLogin}
              isLoading={isLoading}
              isDisabled={isLoading}
              size="lg"
              leftIcon={<Icon as={MaterialIcons} name="fingerprint" />}
            >
              Sign In with Biometrics
            </Button>
          )}

          {/* Biometric Setup Info */}
          {biometricAvailable && !biometricEnabled && (
            <Box p={3} bg="blue.50" borderRadius="md">
              <HStack space={2} alignItems="center">
                <Icon as={MaterialIcons} name="info" color="blue.600" />
                <Text fontSize="sm" color="blue.700" flex={1}>
                  Enable biometric login in your profile after signing in
                </Text>
              </HStack>
            </Box>
          )}

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
