import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Stack } from "expo-router";
import { tokenCache } from '@/cache'
import { Slot } from 'expo-router'
import Toast from 'react-native-toast-message';
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as SplashScreen from "expo-splash-screen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
  }

  return (
     <NotificationProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>

      <Toast />
    </NotificationProvider>
  )
}
