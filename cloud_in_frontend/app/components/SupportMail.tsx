import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React from 'react';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';

const userEmail = 'exampleuser@mail.com';

const SupportMail = () => {
  const handleCopymail = async () => {
    await Clipboard.setStringAsync(userEmail);
    Alert.alert('Copied', 'Email address copied to clipboard!');
  };

  return (
    <TouchableOpacity onPress={handleCopymail} style={styles.actionButton}>
        <Text style={styles.buttonText}>Support</Text>
      <Feather name="mail" size={20} color="white" />
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',       // 🔄 Side by side
    alignItems: 'center',
    gap: 15,                     // Adds spacing between icon and text
    marginVertical: 10,  
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SupportMail;
