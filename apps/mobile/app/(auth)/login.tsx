import React from 'react';
import { Box, VStack, Heading, Text, Button } from 'native-base';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <Box flex={1} bg="white" safeArea>
      <VStack space={4} px={6} py={8}>
        <Heading size="xl" mb={2}>
          Login
        </Heading>
        <Text color="gray.600" mb={4}>
          Login screen will be implemented in Task 24
        </Text>

        <Button onPress={() => router.push('/(auth)/register')}>
          Go to Register
        </Button>

        <Button variant="ghost" onPress={() => router.push('/(tabs)')}>
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
}
