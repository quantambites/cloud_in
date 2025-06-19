// app/oauth/native.tsx

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function OAuthNativeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Optionally redirect to homepage or dashboard
    router.replace('/');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
