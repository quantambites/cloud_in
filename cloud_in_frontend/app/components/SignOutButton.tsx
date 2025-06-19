import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons';

interface SignOutButtonProps {
  onSignedOut?: () => void | Promise<void>;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ onSignedOut }) => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      if (onSignedOut) await onSignedOut();
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.actionButton}>
        <Text style={styles.buttonText}>Logout</Text>
        <Feather name="log-out" size={22} color="red"  />
        
    </TouchableOpacity>
  )
}




const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',       // 🔄 Side by side
    alignItems: 'center',
    gap: 18,                     // Adds spacing between icon and text
    marginVertical: 10,  
  },
  buttonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SignOutButton 



