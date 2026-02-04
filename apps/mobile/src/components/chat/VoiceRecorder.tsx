import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { IconButton, Modal, VStack, HStack, Text, Button, Icon, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete, 
  disabled = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Waveform animation values
  const waveformValues = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Microphone permission is required to record voice messages.');
      return false;
    }
    return true;
  };

  const startWaveformAnimation = () => {
    waveformValues.forEach((value, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(value, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: 300 + Math.random() * 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          if (isRecording) animate();
        });
      };
      setTimeout(animate, index * 50);
    });
  };

  const handleStartRecording = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setShowModal(true);
      setDuration(0);

      // Start duration timer
      durationInterval.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Start waveform animation
      startWaveformAnimation();
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        onRecordingComplete(uri, duration);
      }

      setRecording(null);
      setShowModal(false);
      setDuration(0);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const handleCancelRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    setIsRecording(false);
    setShowModal(false);
    setDuration(0);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <IconButton
        icon={<Icon as={MaterialIcons} name="mic" size="md" color="gray.600" />}
        onPress={handleStartRecording}
        isDisabled={disabled}
        variant="ghost"
        size="sm"
      />

      <Modal isOpen={showModal} onClose={handleCancelRecording}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Recording Voice Message</Modal.Header>
          <Modal.Body>
            <VStack space={4} alignItems="center">
              <Text fontSize="2xl" fontWeight="bold">
                {formatDuration(duration)}
              </Text>

              {/* Waveform visualization */}
              <HStack space={1} alignItems="center" height={100}>
                {waveformValues.map((value, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      height: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 80],
                      }),
                      width: 4,
                      backgroundColor: '#3b82f6',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </HStack>

              <HStack space={4}>
                <Button
                  variant="ghost"
                  colorScheme="danger"
                  onPress={handleCancelRecording}
                  startIcon={<Icon as={MaterialIcons} name="close" />}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="primary"
                  onPress={handleStopRecording}
                  startIcon={<Icon as={MaterialIcons} name="stop" />}
                >
                  Stop & Send
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};
