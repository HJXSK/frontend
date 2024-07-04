import {Fontisto} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PanelItem from './PanelItem';
import {sendMessage, uploadFileAsync} from '@/util/firebase';

export default function Media(): JSX.Element {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      // https://stackoverflow.com/questions/70528896/react-native-expo-image-picker-upload-image-to-firebase-storage-v9-crash
      quality: 0.5, // as well as using uploadBytesResumable
    });

    if (!result.canceled) {
      result.assets.forEach(async asset => {
        const path = await uploadFileAsync(asset.uri, 'image');
        sendMessage(path, 'image');
      });
    }
  };

  return (
    <PanelItem
      title="Photo"
      icon={<Fontisto name="photograph" size={36} color="rgb(83,166,253)" />}
      onPress={pickImage}
    />
  );
}
