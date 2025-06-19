import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import ImageUploadGraph from '@/app/components/ImageUploadGraph';
import SupportMail from '@/app/components/SupportMail';
import { SignOutButton } from '@/app/components/SignOutButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SidebarModalProps {
  visible: boolean;
  onClose: () => void;
  uploadedCount: number;
  maxUploads: number;
}

const SidebarModal: React.FC<SidebarModalProps> = ({ visible, onClose, uploadedCount, maxUploads }) => {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false); // Hide after animation
        onClose(); // Notify parent
      });
    }
  }, [visible]);

  if (!internalVisible) return null;

  const handleClose = () => {
  Animated.timing(slideAnim, {
    toValue: -SCREEN_WIDTH,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setInternalVisible(false);
    onClose(); // Call the parent close after animation
  });
};

  return (
    <Modal transparent visible animationType="none">
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (visible) handleClose();
        }}
        style={styles.overlay}
      >
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.content}>
            <ImageUploadGraph uploadedCount={uploadedCount} maxUploads={maxUploads} />
            <View style={styles.divider} />
            <SupportMail />
            <View style={styles.divider} />
            <SignOutButton onSignedOut={handleClose} />
            <View style={styles.divider} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.6,
    backgroundColor: '#262626',
    padding: 15,
    paddingTop: 20,
    elevation: 5,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    gap: 15,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default SidebarModal;
