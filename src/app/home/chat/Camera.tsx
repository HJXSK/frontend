import PanelItem from './PanelItem';
import * as ImagePicker from 'expo-image-picker';
import {FontAwesome} from '@expo/vector-icons';
import {sendMessage, uploadFileAsync} from '@/util/firebase';

export default function Camera(): JSX.Element {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const takeImage = async () => {
    if (!status!.granted) {
      await requestPermission();
    }
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        result.assets.forEach(async asset => {
          const fullPath = await uploadFileAsync(asset.uri, 'image');
          sendMessage(fullPath, 'image');
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
        <FontAwesome name="camera-retro" size={36} color="rgb(83,166,253)" />
      }
      onPress={takeImage}
    />
  );
}
