import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar , View, Image, StyleSheet, TouchableOpacity, Alert, Text , Modal , ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

export default function FullImageScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const API_MEDIA_URL = process.env.EXPO_PUBLIC_API_MEDIA_URL;


  const handleShare = async () => {
    try {
      const fileUri = `${FileSystem.cacheDirectory}shared-image.jpg`;

      // Download image to cache directory
      await FileSystem.downloadAsync(url as string, fileUri);

      // Share the downloaded image
      await Sharing.shareAsync(fileUri);
    } catch (error: any) {
      console.error('Share error:', error.message);
      Alert.alert('Error', 'Something went wrong while sharing the image.');
    }
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Storage permission is required to download images.');
        return;
      }

      const fileName = (url as string).split('/').pop();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(url as string, fileUri);

      if (downloadResult.status === 200) {
        await MediaLibrary.createAssetAsync(fileUri);
        Toast.show({
          type: 'success',
          text1: 'Download Complete',
          text2: 'Image saved to gallery 📸',
        });
      } else {
        Alert.alert('Error', `Download failed with status code: ${downloadResult.status}`);
      }
    } catch (error: any) {
      console.error('Download error:', error.message);
      Alert.alert('Error', 'Something went wrong during the download process.');
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
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

      Toast.show({
      type: 'success',
      text1: 'Image Deleted',
      text2: 'The image was removed successfully 🗑️',
    });

    // Slight delay for toast visibility (optional)
    setTimeout(() => {
      router.replace('/');
    }, 800);
    } catch (error) {
      Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: 'Something went wrong while deleting.',
        });
    }finally {
    setIsLoading(false);
  }

  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
  
      <Image source={{ uri: url as string }} style={styles.image} />
  
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
          <Ionicons name="download-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color="red" />
          <Text style={[styles.buttonText, { color: 'red' }]}>Delete</Text>
        </TouchableOpacity>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  actionButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 4,
    color: 'white',
    fontSize: 12,
  },
});
