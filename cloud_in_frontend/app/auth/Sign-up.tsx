import * as React from 'react';
import { StatusBar, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms and Conditions.');
      return;
    }

    try {
      setErrorMessage('');
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || 'Sign-up failed.');
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        setErrorMessage('Verification not complete. Try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || 'Verification failed.');
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#888"
          onChangeText={setCode}
          style={styles.input}
        />
        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>
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
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword(text);
            if (errorMessage) setErrorMessage('');
          }}
          style={styles.input}
        />
        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        <View style={styles.checkboxContainer}>
  <TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)} style={styles.checkbox}>
    <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxChecked]}>
      {agreedToTerms && <Text style={styles.checkboxTick}></Text>}
    </View>
    <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
  </TouchableOpacity>
</View>
        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.linkRow}>
          <Text style={styles.text}>Already have an account?</Text>
          <Link href="/auth/Sign-in">
            <Text style={styles.link}> Sign in</Text>
          </Link>
        </View>
      </View>
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
  checkboxContainer: {
    marginBottom: 8,
    marginTop: 4,  
    marginLeft: 5,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  checkboxChecked: {
    backgroundColor: '#1e88e5',
    borderColor: '#1e88e5',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 14,
  },
  checkboxLabel: {
    color: '#aaa',
  },
});
