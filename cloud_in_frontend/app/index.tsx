import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { TouchableOpacity ,StatusBar ,SafeAreaView, View, Text , Alert ,Modal , ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageList from '@/app/components/ImageList';
import { Ionicons } from '@expo/vector-icons';
import SigninPage from './auth/Sign-in';
import SidebarModal from './components/Sidebar';
import Toast from 'react-native-toast-message';
import { useNotification } from "@/context/NotificationContext";
import Constants from 'expo-constants';


export default function Page() {
  const { notification, expoPushToken, error } = useNotification();
  const { user } = useUser();
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const MAX_UPLOADS = parseInt(process.env.EXPO_PUBLIC_MAX_UPLOADS || '2');
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const API_MEDIA_URL = process.env.EXPO_PUBLIC_API_MEDIA_URL;

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/${user.emailAddresses[0].emailAddress}`)
        .then(response => response.json())
        .then(data => setUrls(data.urls || []))
        .catch(error => console.error('Error fetching URLs:', error));
    }
  }, [user]);

  const handleUpload = async () => {
    if (urls.length >= MAX_UPLOADS) {
      await fetch(`${API_BASE_URL}/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: expoPushToken,
          title: 'Upload Limit Reached',
          body: `You can only upload ${MAX_UPLOADS} images 🛑`,
        }),
      });
      return;
    }
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const formData = new FormData();
      
      formData.append('image', {
        uri: fileUri,
        name: 'upload.jpg',
        type: 'image/jpeg',
      } as any);

      if (user?.emailAddresses[0].emailAddress) {
        formData.append('email', user.emailAddresses[0].emailAddress);
      }

      const uploadResponse = await fetch(`${API_MEDIA_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await uploadResponse.json();
      if (uploadResponse.ok) {
        handleAddUrl(data.url);
        setUrls(prev => [...prev, data.url]);
         await fetch(`${API_BASE_URL}/push/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: expoPushToken,
            title: 'Upload Successful',
            body: 'Your image has been uploaded 🎉',
          }),
         });

      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      await fetch(`${API_BASE_URL}/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: expoPushToken,
          title: 'Upload Error',
          body: 'Unexpected error occurred while uploading ❌',
        }),
      });
    }finally {
    setIsLoading(false);
   }
  };

  const handleAddUrl = (url_str: string) => {
    if (!url_str.trim()) {
      Alert.alert('Error', 'URL cannot be empty.');
      return;
    }

    fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user?.emailAddresses[0].emailAddress,
        url: url_str
      })
    })
      .then(response => response.json())
      .then(data => {
        setUrls(data.urls); // setUrls(data.user.urls);***
      })
      .catch(error => console.error('Error adding URL:', error));
  };


  const handleDeleteUrl = async (urls: string[]) => {
    setIsLoading(true);
    try{
      for (const url of urls) {
      try {
        // Step 1: Delete from Cloudinary
        const cloudinaryResponse = await fetch(`${API_MEDIA_URL}/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
  
        const cloudinaryData = await cloudinaryResponse.json();
        if (!cloudinaryResponse.ok) throw new Error(cloudinaryData.error || 'Cloudinary deletion failed');
  
        // Step 2: Delete from MongoDB
        const dbResponse = await fetch(`${API_BASE_URL}/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.emailAddresses[0].emailAddress,
            url,
          }),
        });
  
        const dbData = await dbResponse.json();
        if (!dbResponse.ok) throw new Error(dbData.error || 'MongoDB deletion failed');
  
        // Update UI only if both deletions were successful
        setUrls(dbData.user.urls);
      } catch (error) {
        await fetch(`${API_BASE_URL}/push/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: expoPushToken,
            title: 'Delete Failed',
            body: 'Something went wrong while deleting ❌',
          }),
        });
      }
    }
    }finally {
    setIsLoading(false);
   }
  };
  
  

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <SignedIn>
          <View style={{
            flex: 0.25,
            backgroundColor: '#121212',
            paddingHorizontal: 16,
            justifyContent: 'flex-start',
            paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 25 : 35,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Ionicons name="person-circle" size={40} color='white' style={{ marginRight: 10 }} />
                <View>
                  <Text style={{ color: '#aaa', fontSize: 14 }}>Hello</Text>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                  {(user?.emailAddresses?.[0]?.emailAddress ?? '').length > 20
                    ? user?.emailAddresses?.[0]?.emailAddress.slice(0, 20) + '...'
                    : user?.emailAddresses?.[0]?.emailAddress}
                  </Text>
                </View>
              </TouchableOpacity>

            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 72,
              marginBottom: 10,
              marginTop: 45,
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 35 }}>
                  {urls.length}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 14 }}>
                  uploads
                </Text>
              </View>
            
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 35 }}>
                  {MAX_UPLOADS}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 14 }}>
                  limit
                </Text>
              </View>
            </View>

          </View>

          <View style={{ flex: 0.75 }}>
            <ImageList
              key={urls.length.toString()}
              urls={urls}
              handleDeleteUrl={(url) => handleDeleteUrl([url])}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
            {selectedImages.length === 0 && (
              <TouchableOpacity
                onPress={handleUpload}
                style={{
                  position: 'absolute',
                  bottom: 24,
                  right: 24,
                  backgroundColor: '#1e88e5',
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 6,
                  zIndex: 10,
                }}
              >
                <Ionicons name="add" size={32} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </SignedIn>

        <SignedOut>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
             <SigninPage />
          </SafeAreaView>
        </SignedOut>
      </View>
      <SidebarModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  uploadedCount={urls.length}
  maxUploads={MAX_UPLOADS}
/>


  <Modal transparent visible={isLoading} animationType="fade">
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

