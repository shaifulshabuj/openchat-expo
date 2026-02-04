import React from 'react';
import { HStack, Avatar, VStack, Text, IconButton, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type ChatHeaderProps = {
  name: string;
  avatar?: string;
  isOnline?: boolean;
  onMorePress?: () => void;
};

export default function ChatHeader({ name, avatar, isOnline = false, onMorePress }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <HStack
      bg="white"
      px={4}
      py={3}
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="gray.200"
      safeAreaTop
    >
      <HStack space={3} alignItems="center" flex={1}>
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back" size="lg" color="gray.700" />}
          onPress={() => router.back()}
          _pressed={{ bg: 'gray.100' }}
          borderRadius="full"
        />

        <Pressable onPress={() => {}} flex={1}>
          <HStack space={3} alignItems="center">
            <Avatar
              size="md"
              source={avatar ? { uri: avatar } : undefined}
              bg="primary.500"
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <VStack flex={1}>
              <Text fontSize="md" fontWeight="600" color="gray.800" numberOfLines={1}>
                {name}
              </Text>
              <Text fontSize="xs" color={isOnline ? 'green.500' : 'gray.500'}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </VStack>
          </HStack>
        </Pressable>
      </HStack>

      <IconButton
        icon={<Icon as={MaterialIcons} name="more-vert" size="lg" color="gray.700" />}
        onPress={onMorePress}
        _pressed={{ bg: 'gray.100' }}
        borderRadius="full"
      />
    </HStack>
  );
}
