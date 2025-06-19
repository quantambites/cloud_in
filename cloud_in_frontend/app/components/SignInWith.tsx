
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useState , useEffect, useCallback } from 'react';
import { useSSO } from '@clerk/clerk-expo';
import googleButton from '../../assets/images/google.png';
import facebookButton from '../../assets/images/facebook.png';
import appleButton from '../../assets/images/apple.png';
import { Pressable, Image ,  Modal, ActivityIndicator, View } from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

type SignInWithProps = {
  strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook';
};

const strategyIcons = {
  oauth_google: googleButton,
  oauth_apple: appleButton,
  oauth_facebook: facebookButton,
};

export default function SignInWith({ strategy }: SignInWithProps) {
  const [loading, setLoading] = useState(false);
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          //redirectUrl: AuthSession.makeRedirectUri(),
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: 'cloudin',
            path: 'oauth/native',
          })
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
    finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
    <Pressable onPress={onPress}>
      <Image
        source={strategyIcons[strategy]}
        style={{ width: 55, height: 55 , margin: 8 , borderRadius: 8}}
        resizeMode='contain'
      />
    </Pressable>


    <Modal transparent visible={loading} animationType="fade">
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        padding: 20,
        borderRadius: 12,
      }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </View>
  </Modal>

    </>
  );
}


