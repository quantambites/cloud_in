import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionBarProps {
  selectedImages: string[];
  handleShareMultiple: (urls: string[]) => void;
  handleDownloadMultiple: (urls: string[]) => void;
  handleDeleteMultiple: (urls: string[]) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  selectedImages,
  handleShareMultiple,
  handleDownloadMultiple,
  handleDeleteMultiple,
}) => {
  return (
    <View style={styles.actionBar}>
      <TouchableOpacity onPress={() => handleShareMultiple(selectedImages)} style={styles.actionButton}>
        <Ionicons name="share-social-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDownloadMultiple(selectedImages)} style={styles.actionButton}>
        <Ionicons name="download-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDeleteMultiple(selectedImages)} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={24} color="red" />
        <Text style={[styles.buttonText, { color: 'red' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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

export default ActionBar;
