import {useState} from 'react';
import PanelItem from './PanelItem';
import * as ImagePicker from 'expo-image-picker';
import {Fontisto} from '@expo/vector-icons';

export default function Camera(): JSX.Element {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImage = async () => {
    if (!status!.granted) {
      await requestPermission();
    }
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        result.assets.forEach(asset => {
          console.log(asset.uri);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PanelItem
      title="Camera"
      icon={
        <Fontisto
          name="photograph"
          size={36}
          color="rgb(83,166,253)"
          onPress={pickImage}
        />
      }
    />
  );
}
