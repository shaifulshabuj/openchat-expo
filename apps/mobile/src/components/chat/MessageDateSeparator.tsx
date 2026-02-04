import React from 'react';
import { Box, Text, HStack } from 'native-base';
import { format, isToday, isYesterday } from 'date-fns';

type MessageDateSeparatorProps = {
  date: Date;
};

export default function MessageDateSeparator({ date }: MessageDateSeparatorProps) {
  const getDateLabel = () => {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMM d, yyyy');
  };

  return (
    <HStack justifyContent="center" my={3}>
      <Box bg="gray.200" px={3} py={1} borderRadius="full">
        <Text fontSize="xs" color="gray.600" fontWeight="500">
          {getDateLabel()}
        </Text>
      </Box>
    </HStack>
  );
}
