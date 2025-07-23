// email crop and style
// loader and logo
import { useNotification } from "@/context/NotificationContext";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import ActionBar from './ActionBar';

interface Props {
  urls: string[];
  handleDeleteUrl: (url: string) => void;
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageList: React.FC<Props> = ({ urls, handleDeleteUrl, selectedImages, setSelectedImages }) => {
  const { notification, expoPushToken, error } = useNotification();
  const router = useRouter();
  const params = useLocalSearchParams();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const toggleSelectImage = (url: string) => {
    if (selectedImages.includes(url)) {
      const updated = selectedImages.filter(item => item !== url);
      setSelectedImages(updated);
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };


  const handleDownload = async (url: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Storage permission is required to download images.');
        return;
      }

      const fileName = url.split('/').pop();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

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

 const handleShareMultiple = async (urls: string[]) => {
  try {
    // Step 1: Download each image to a temporary local file
    const downloadedFiles = await Promise.all(
      urls.map(async (url, index) => {
        const fileUri = `${FileSystem.cacheDirectory}shared-image-${index}.jpg`;
        await FileSystem.downloadAsync(url, fileUri);
        return fileUri;
      })
    );

    // Step 2: Use Sharing API for each file
    for (const file of downloadedFiles) {
      await Sharing.shareAsync(file);
    }
  } catch (error: any) {
    console.error('Share error:', error.message);
    Alert.alert('Error', 'Something went wrong while sharing the images.');
  }
};



  const handleDownloadMultiple = async (urls: string[]) => {
    for (const url of urls) {
      await handleDownload(url);
    }
    setSelectedImages([]);
    
  };

 const handleDeleteMultiple = async (urls: string[]) => {
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        await handleDeleteUrl(url);
        return true; // Success
      } catch (error) {
        console.error(`Failed to delete ${url}`, error);
        return false; // Failure
      }
    })
  );

  setSelectedImages([]);

  const failedCount = results.filter(success => !success).length;

  if (failedCount === 0) {
    await fetch(`${API_BASE_URL}/push/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: expoPushToken,
      title: 'Images Deleted',
      body: `${urls.length} image(s) removed successfully 🗑️`,
    }),
  });
  } else {
    await fetch(`${API_BASE_URL}/push/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: expoPushToken,
      title: 'Partial Deletion',
      body: `${failedCount} image(s) could not be deleted ❌`,
    }),
  });
  }
};

  return (
    <View style={{ flex: 1, position: 'relative' }}> 
      
    <View >
      
      <FlatList
        data={urls}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.touchable}
              onLongPress={() => toggleSelectImage(item)}
              delayLongPress={300}
              onPress={() => {
                if (selectedImages.length === 0) {
                  router.push({
                    pathname: '/full_image/[url]',
                    params: {
                      url: item
                    },
                  });
                  // Prepare deletion flag just in case
                  setSelectedImages([item]);
                } else {
                  toggleSelectImage(item);
                }
              }}
            >
              <Image source={{ uri: item }} style={styles.image} />
              {selectedImages.includes(item) && (
                <View style={styles.selectedOverlay}>
                  <View style={styles.selectedCircle} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
      </View>{selectedImages.length > 0 && (
      <ActionBar
        selectedImages={selectedImages}
        handleShareMultiple={handleShareMultiple}
        handleDownloadMultiple={handleDownloadMultiple}
        handleDeleteMultiple={handleDeleteMultiple}
      />
    )}
      
  </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  list: {
    paddingBottom: 50, // Enough space for ActionBar
  },
  imageContainer: {
    width: '50%',

    padding: 2,
    borderRadius: 5,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
  },
  selectedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1e88e5',
  },
});

export default ImageList;



/*
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Image,
  Button,
  FlatList,
  StyleSheet,
  Share,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


interface Props {
  urls: string[];
  handleDeleteUrl: (url: string) => void;
}

const ImageList: React.FC<Props> = ({ urls, handleDeleteUrl }) => {

  const handleShare = async (url: string) => {
    try {
      await Share.share({
        message: `Check out this image: ${url}`,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Something went wrong while sharing.');
    }
  };
  
  const handleDownload = async (url: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Storage permission is required.');
        return;
      }

      if (!FileSystem.documentDirectory) {
        console.error('No document directory');
        Alert.alert('Error', 'Unable to access file system.');
        return;
      }

      const fileName = url.split('/').pop();
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      if (downloadResult.status === 200) {
        await MediaLibrary.createAssetAsync(fileUri);
        Alert.alert('Success', 'Image saved to gallery!');
      } else {
        Alert.alert('Error', 'Download failed.');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Something went wrong during download.');
    }
  };

  return (
    <View >
      <FlatList
        data={urls}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={[styles.list, { paddingBottom: 500, minHeight: '100%' }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Link
                href={{
                  pathname: '/full_image/[url]',
                  params: { url: item },
                }}>
                <Image source={{ uri: item }} style={styles.image} />
              </Link>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button}>
                  <Button title="Share" onPress={() => handleShare(item)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Button title="Download" onPress={() => handleDownload(item)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Button
                    title="Delete"
                    color="red"
                    onPress={() => handleDeleteUrl(item)}
                  />
                  
                </TouchableOpacity>
              </View>
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
    justifyContent: 'center',
  },
  imageContainer: {
    width: '60%',
    margin: 1,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  button: {
    marginVertical: 2,
    marginHorizontal: 2,
    flexBasis: '50%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default ImageList;




*/