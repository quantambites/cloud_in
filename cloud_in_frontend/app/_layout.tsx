import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Stack } from "expo-router";
import { tokenCache } from '@/cache'
import { Slot } from 'expo-router'
import Toast from 'react-native-toast-message';



export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
  }

  return (
    <>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>

      <Toast />
    </>
  )
}
