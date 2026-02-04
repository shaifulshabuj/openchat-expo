import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { HStack, Box } from 'native-base';

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, 133);
    const anim3 = createAnimation(dot3, 266);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const animatedStyle = (value: Animated.Value) => ({
    opacity: value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <HStack space={1} alignItems="center" py={2} px={3}>
      <Animated.View style={animatedStyle(dot1)}>
        <Box w={2} h={2} bg="gray.400" borderRadius="full" />
      </Animated.View>
      <Animated.View style={animatedStyle(dot2)}>
        <Box w={2} h={2} bg="gray.400" borderRadius="full" />
      </Animated.View>
      <Animated.View style={animatedStyle(dot3)}>
        <Box w={2} h={2} bg="gray.400" borderRadius="full" />
      </Animated.View>
    </HStack>
  );
}
