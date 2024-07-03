import {StyleSheet, Text, View} from 'react-native';
import {Fontisto} from '@expo/vector-icons';
import {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function Media(): JSX.Element {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      allowsMultipleSelection: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
        <Fontisto name="photograph" size={36} color="rgb(83,166,253)" />
      </TouchableOpacity>
      <Text>Media</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(59,59,59,0.1)',
  },
});
