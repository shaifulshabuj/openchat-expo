import { StyleSheet } from 'react-native';
import { Button, VStack, Text as NBText, Spinner } from 'native-base';

import { Text, View } from '@/components/Themed';
import { useAuth } from '../../src/hooks';

export default function TabOneScreen() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Status Test</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <VStack space={4} alignItems="center">
        {isLoading ? (
          <Spinner size="lg" />
        ) : isAuthenticated && user ? (
          <>
            <NBText fontSize="lg" bold>✅ Authenticated</NBText>
            <NBText>User: {user.username}</NBText>
            <NBText>Email: {user.email}</NBText>
            <NBText>Display Name: {user.displayName || 'Not set'}</NBText>
          </>
        ) : (
          <>
            <NBText fontSize="lg" bold>❌ Not Authenticated</NBText>
            <NBText>Please log in to continue</NBText>
          </>
        )}
        
        <Button colorScheme="primary" onPress={() => console.log('Auth Context:', { user, isAuthenticated })}>
          Log Auth State
        </Button>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
