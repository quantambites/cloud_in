import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import { Stack, router } from 'expo-router';
import { useSignIn, useAuth } from '@clerk/clerk-expo';

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useSignIn();
  const { signOut } = useAuth();

  const onRequestReset = async () => {
    try {
      setErrorMessage('');
      if (!signIn) {
        setErrorMessage('Sign-in object is not available.');
        return;
      }
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || 'Failed to send reset email.');
    }
  };

  const onReset = async () => {
    try {
      setErrorMessage('');
      if (!signIn) {
        setErrorMessage('Sign-in object is not available.');
        return;
      }

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      await signOut();

      router.replace('/');
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || 'Failed to reset password');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        <Stack.Screen options={{ headerBackVisible: !successfulCreation, title: 'Reset Password' }} />
        <Text style={styles.title}>Reset Your Password</Text>

        {!successfulCreation ? (
          <>
            <TextInput
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={emailAddress}
              onChangeText={(text) => {
                setEmailAddress(text);
                if (errorMessage) setErrorMessage('');
              }}
              style={styles.input}
              keyboardType="email-address"
            />
            {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
            <TouchableOpacity style={styles.button} onPress={onRequestReset}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              placeholder="Verification Code"
              placeholderTextColor="#888"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                if (errorMessage) setErrorMessage('');
              }}
              style={styles.input}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              secureTextEntry
              style={styles.input}
            />
            {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
            <TouchableOpacity style={styles.button} onPress={onReset}>
              <Text style={styles.buttonText}>Set New Password</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#333',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default PwReset;
