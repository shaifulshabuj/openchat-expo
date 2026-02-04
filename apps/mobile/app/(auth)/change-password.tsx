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

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.show({
        description: 'Please fill in all fields',
        placement: 'top',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.show({
        description: 'New passwords do not match',
        placement: 'top',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.show({
        description: 'Password must be at least 8 characters',
        placement: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement change password API call
      // await trpcClient.auth.changePassword.mutate({...});

      toast.show({
        description: 'Password changed successfully!',
        placement: 'top',
        duration: 3000,
      });

      router.back();
    } catch (error: any) {
      toast.show({
        description: error.message || 'Failed to change password',
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
          Change Password
        </Heading>
        <Text color="gray.600" mb={4}>
          Enter your current password and choose a new one
        </Text>

        <FormControl>
          <FormControl.Label>Current Password</FormControl.Label>
          <Input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            size="lg"
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>New Password</FormControl.Label>
          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            size="lg"
          />
          <FormControl.HelperText>
            Minimum 8 characters
          </FormControl.HelperText>
        </FormControl>

        <FormControl>
          <FormControl.Label>Confirm New Password</FormControl.Label>
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            size="lg"
          />
        </FormControl>

        <Button
          onPress={handleChangePassword}
          isLoading={isLoading}
          size="lg"
          mt={4}
        >
          Change Password
        </Button>

        <Button variant="ghost" onPress={() => router.back()}>
          Cancel
        </Button>
      </VStack>
    </Box>
  );
}
