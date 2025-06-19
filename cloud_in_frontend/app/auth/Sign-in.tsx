import { useSignIn  } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import SignInWith from '../components/SignInWith';

export default function SigninPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
     if (!isLoaded) return;

    setLoading(true)
    try {
      setErrorMessage('');
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        setErrorMessage('Sign-in not completed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || 'Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#888"
          onChangeText={(text) => {
            setEmailAddress(text);
            if (errorMessage) setErrorMessage('');
          }}
          style={styles.input}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={(text) => {
            setPassword(text);
            if (errorMessage) setErrorMessage('');
          }}
          style={styles.input}
        />

        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Link href="/auth/Reset-pass" asChild>
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity onPress={onSignInPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.linkRow}>
          <Text style={styles.text}>Don't have an account?</Text>
          <Link href="/auth/Sign-up">
            <Text style={styles.link}> Sign up</Text>
          </Link>
        </View>

        {/* Divider with "or" in the center */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Text below divider */}
        <Text style={styles.signInWithText}>Sign in with</Text>

        {/* OAuth buttons centered with spacing */}
        <View style={styles.oauthContainer}>
          <View style={styles.oauthButton}>
            <SignInWith strategy="oauth_google" />
          </View>
          <View style={styles.oauthButton}>
            <SignInWith strategy="oauth_facebook" />
          </View>
          <View style={styles.oauthButton}>
            <SignInWith strategy="oauth_apple" />
          </View>
        </View>
      </View>


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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#aaa',
  },
  link: {
    color: '#1e88e5',
    fontWeight: '600',
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  forgotText: {
    color: '#bbb',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 35,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  orText: {
    color: '#aaa',
    marginHorizontal: 10,
    fontSize: 14,
  },
  signInWithText: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 8,
    fontSize: 14,
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 24,
  },
  oauthButton: {
    marginHorizontal: 4,
  },
});
