import React from 'react';
import { View, Text } from 'react-native';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';

interface Props {
  uploadedCount: number;
  maxUploads?: number;
}

const ImageUploadGraph: React.FC<Props> = ({ uploadedCount, maxUploads = 50 }) => {
  const progress = (uploadedCount / maxUploads) * 100;

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <View style={{ position: 'relative' }}>
        <CircularProgressBase
          value={progress}
          radius={60}
          duration={1000}
          activeStrokeColor="#1e88e5" // Bright blue for dark mode
          inActiveStrokeColor="#585757" // Dim gray for background stroke
          maxValue={100}
        />
        <View
          style={{
            position: 'absolute',
            transform: [{ translateX: 40 }, { translateY: 45 }],
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
            {uploadedCount}/{maxUploads}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ImageUploadGraph;
