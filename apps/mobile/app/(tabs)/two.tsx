import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Input,
  Button,
  Heading,
  useToast,
  FormControl,
  IconButton,
  Icon,
  AlertDialog,
  ScrollView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { trpcClient } from '../../utils/trpc';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const cancelRef = React.useRef(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await trpcClient.auth.updateProfile.mutate({
        userId: user.id,
        profile: {
          displayName: displayName || undefined,
          bio: bio || undefined,
          avatar: avatar || undefined,
        },
      });

      toast.show({
        description: 'Profile updated successfully!',
        placement: 'top',
      });

      setIsEditing(false);
      // Refresh user data
      await refreshUser();
    } catch (error: any) {
      toast.show({
        description: error.message || 'Failed to update profile',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.show({
        description: 'Logged out successfully',
        placement: 'top',
      });
      router.replace('/(auth)/login');
    } catch (error: any) {
      toast.show({
        description: error.message || 'Logout failed',
        placement: 'top',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (!deletePassword) {
      toast.show({
        description: 'Please enter your password',
        placement: 'top',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await trpcClient.auth.deleteAccount.mutate({
        userId: user.id,
        password: deletePassword,
      });

      toast.show({
        description: 'Account deleted successfully',
        placement: 'top',
      });

      setShowDeleteDialog(false);
      await logout();
      router.replace('/(auth)/register');
    } catch (error: any) {
      toast.show({
        description: error.message || 'Failed to delete account',
        placement: 'top',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <Box flex={1} bg="white" safeArea justifyContent="center" alignItems="center">
        <Text>Please login to view your profile</Text>
        <Button mt={4} onPress={() => router.push('/(auth)/login')}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <ScrollView flex={1} bg="white">
      <Box safeArea flex={1}>
        <VStack space={4} px={6} py={8}>
          {/* Header with Edit Button */}
          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="xl">Profile</Heading>
            {!isEditing && (
              <IconButton
                icon={<Icon as={MaterialIcons} name="edit" size="md" />}
                onPress={() => setIsEditing(true)}
              />
            )}
          </HStack>

          {/* Avatar */}
          <Box alignSelf="center" mb={4}>
            <Avatar
              size="2xl"
              source={avatar ? { uri: avatar } : undefined}
              bg="blue.500"
            >
              {user.username[0].toUpperCase()}
            </Avatar>
          </Box>

          {isEditing ? (
            <>
              {/* Edit Mode */}
              <FormControl>
                <FormControl.Label>Display Name</FormControl.Label>
                <Input
                  placeholder="Your display name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Bio</FormControl.Label>
                <Input
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  size="lg"
                />
                <FormControl.HelperText>
                  Maximum 500 characters
                </FormControl.HelperText>
              </FormControl>

              <FormControl>
                <FormControl.Label>Avatar URL</FormControl.Label>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  value={avatar}
                  onChangeText={setAvatar}
                  size="lg"
                />
                <FormControl.HelperText>
                  Enter a URL for your profile picture
                </FormControl.HelperText>
              </FormControl>

              <Button
                onPress={handleSaveProfile}
                isLoading={isLoading}
                size="lg"
                mt={2}
              >
                Save Changes
              </Button>

              <Button
                variant="ghost"
                onPress={() => {
                  setIsEditing(false);
                  // Reset to original values
                  setDisplayName(user.displayName || '');
                  setBio(user.bio || '');
                  setAvatar(user.avatar || '');
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {/* View Mode */}
              <VStack space={3}>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Display Name
                  </Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {user.displayName || 'Not set'}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Username
                  </Text>
                  <Text fontSize="lg">@{user.username}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Email
                  </Text>
                  <Text fontSize="lg">{user.email}</Text>
                </Box>

                {user.bio && (
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Bio
                    </Text>
                    <Text fontSize="md">{user.bio}</Text>
                  </Box>
                )}

                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Status
                  </Text>
                  <Text fontSize="lg">
                    {user.emailVerified ? '✅ Verified' : '⚠️ Not Verified'}
                  </Text>
                </Box>
              </VStack>

              {/* Action Buttons */}
              <VStack space={3} mt={6}>
                <Button
                  variant="outline"
                  leftIcon={<Icon as={MaterialIcons} name="lock" />}
                  onPress={() => router.push('/(auth)/change-password')}
                >
                  Change Password
                </Button>

                <Button
                  onPress={handleLogout}
                  leftIcon={<Icon as={MaterialIcons} name="logout" />}
                >
                  Logout
                </Button>

                <Button
                  variant="outline"
                  colorScheme="danger"
                  leftIcon={<Icon as={MaterialIcons} name="delete-forever" />}
                  onPress={() => setShowDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </VStack>
            </>
          )}
        </VStack>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Delete Account</AlertDialog.Header>
            <AlertDialog.Body>
              <VStack space={4}>
                <Text>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                <FormControl>
                  <FormControl.Label>Enter your password to confirm</FormControl.Label>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={deletePassword}
                    onChangeText={setDeletePassword}
                  />
                </FormControl>
              </VStack>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={() => {
                    setShowDeleteDialog(false);
                    setDeletePassword('');
                  }}
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="danger"
                  onPress={handleDeleteAccount}
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                >
                  Delete
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Box>
    </ScrollView>
  );
}
