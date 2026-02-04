import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, VStack, Heading } from 'native-base';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { trpcClient } from '@/utils/trpc';

export default function TabTwoScreen() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const result = await trpcClient.health.query();
      setHealthStatus(result);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ error: 'Failed to connect to API' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two - API Test</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <VStack space={4} alignItems="center">
        <Button onPress={checkHealth} isLoading={loading}>
          Test tRPC Health Check
        </Button>
        
        {healthStatus && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              {JSON.stringify(healthStatus, null, 2)}
            </Text>
          </View>
        )}
      </VStack>
      
      <EditScreenInfo path="app/(tabs)/two.tsx" />
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
  statusBox: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
