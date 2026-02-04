import React from 'react';
import { Box, HStack, VStack, Skeleton } from 'native-base';

type ConversationListSkeletonProps = {
  count?: number;
};

export default function ConversationListSkeleton({
  count = 5,
}: ConversationListSkeletonProps) {
  return (
    <VStack space={4}>
      {Array.from({ length: count }).map((_, index) => (
        <HStack key={index} space={3} alignItems="center">
          {/* Avatar skeleton */}
          <Skeleton size="12" rounded="full" />

          {/* Content skeleton */}
          <VStack flex={1} space={2}>
            <Skeleton h="4" w="60%" rounded="md" />
            <Skeleton h="3" w="80%" rounded="md" />
          </VStack>

          {/* Badge skeleton */}
          <Skeleton size="6" rounded="full" />
        </HStack>
      ))}
    </VStack>
  );
}
