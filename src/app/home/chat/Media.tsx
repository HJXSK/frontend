import {Fontisto} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PanelItem from './PanelItem';
import {STORAGE} from '@/firebase/firebaseConfig';
import {ref, uploadBytesResumable} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
import {sendMessage} from '@/util/firebase';

export default function Media(): JSX.Element {
  const auth = getAuth().currentUser;

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
        const path = await uploadImageAsync(asset.uri);
        sendMessage('image', path);
      });
    }
  };

  async function uploadImageAsync(uri: string) {
    console.log(uri);
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        console.log('onload', xhr.response);
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    // const fileName = uuidv7();
    const fileRef = ref(STORAGE, `${auth?.uid}/images/${blob._data.name}`);
    const result = await uploadBytesResumable(fileRef, blob);
    // We're done with the blob, close and release it
    blob.close();
    return result.metadata.fullPath;
  }

  return (
    <PanelItem
      title="Media"
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
