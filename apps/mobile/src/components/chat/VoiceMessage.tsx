import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { HStack, VStack, IconButton, Icon, Slider, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface VoiceMessageProps {
  audioUrl: string;
  duration?: number;
}

export const VoiceMessage: React.FC<VoiceMessageProps> = ({ audioUrl, duration = 0 }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration * 1000); // Convert to ms

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadSound = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sound:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setTotalDuration(status.durationMillis || totalDuration);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) {
      await loadSound();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <HStack space={2} alignItems="center" width={250}>
      <IconButton
        icon={
          isLoading ? (
            <Icon as={MaterialIcons} name="hourglass-empty" size="md" />
          ) : isPlaying ? (
            <Icon as={MaterialIcons} name="pause" size="md" />
          ) : (
            <Icon as={MaterialIcons} name="play-arrow" size="md" />
          )
        }
        onPress={handlePlayPause}
        isDisabled={isLoading}
        variant="ghost"
        size="sm"
        borderRadius="full"
      />

      <VStack flex={1} space={1}>
        <Slider
          value={position}
          minValue={0}
          maxValue={totalDuration}
          onChange={handleSeek}
          size="sm"
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>

        <HStack justifyContent="space-between">
          <Text fontSize="xs" color="gray.600">
            {formatTime(position)}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {formatTime(totalDuration)}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};
