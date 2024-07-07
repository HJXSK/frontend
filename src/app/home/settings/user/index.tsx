import {Button, StyleSheet, TextInput, Text} from 'react-native';
import {SettingItem, SettingSection} from '@/components/settings/item';
import Avatar from '@/components/settings/avatar';
import ScrollPage from '@/components/page';
import {useState, useMemo, useLayoutEffect, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUserProfile,
  update_profile,
} from '@/redux/features/user/userProfileSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '@/app';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import {downloadFileAsync, uploadFileAsync} from '@/util/firebase';

type UserType = Record<string, any>;

type UserSettingPageProps = NativeStackScreenProps<
  AppStackParamList,
  'setting-user'
>;

// Define the UserPage component
const UserSettingPage: React.FC<UserSettingPageProps> = ({
  navigation,
}): JSX.Element => {
  // Get the current authenticated user
  const dispatch = useDispatch();

  // Define state variables for the original user info and the modified user info
  const userProfile = useSelector(selectUserProfile);
  const [newUserInfo, setNewUserInfo] = useState<UserType>(userProfile);
  // const [isEdited, setIsEdited] = useState(false);

  // Calculate the changes made to the user info and whether any changes have been made
  const [changes, isEdited] = useMemo(() => {
    const result = Object.keys(newUserInfo).reduce((acc, key) => {
      if (newUserInfo[key] !== userProfile[key]) {
        acc[key] = newUserInfo[key];
      }
      return acc;
    }, {} as {[key: string]: any});
    const isEdited = Object.keys(result).length > 0;
    return [result, isEdited];
  }, [newUserInfo, userProfile]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button disabled={!isEdited} title="Done" onPress={saveUser} />
      ),
    });
  }, [changes]);

  /**
   * Save the user info to Firestore
   */
  const saveUser = async () => {
    try {
      // Dispatch an action to update the user profile in Redux
      if (changes.gs_user_avatar) {
        const path = await uploadFileAsync(changes.gs_user_avatar, 'image');
        changes.gs_user_avatar = path;
        setNewUserInfo({...newUserInfo, gs_user_avatar: path});
      }
      dispatch(update_profile(changes));
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  useEffect(() => {
    downloadFileAsync(userProfile.gs_user_avatar!).then(({url}) => {
      setImage(url);
    });
  }, [userProfile.gs_user_avatar]);

  const [image, setImage] = useState<string | null>();

  const updateAvatar = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      // https://stackoverflow.com/questions/70528896/react-native-expo-image-picker-upload-image-to-firebase-storage-v9-crash
      quality: 0.5, // as well as using uploadBytesResumable
    });

    if (!result.canceled) {
      result.assets.forEach(async asset => {
        setImage(asset.uri);
        setNewUserInfo({...newUserInfo, gs_user_avatar: asset.uri});
      });
    }
  };

  return (
    <ScrollPage>
      <TouchableOpacity style={styles.avatarWrapper} onPress={updateAvatar}>
        <Avatar width={100} height={100} src={image} />
      </TouchableOpacity>
      <SettingSection>
        <SettingItem title="Name">
          <TextInput
            placeholder="None"
            textAlign="right"
            onChangeText={gs_user_name => {
              console.log(newUserInfo);
              setNewUserInfo({...newUserInfo, gs_user_name});
            }}>
            {newUserInfo.gs_user_name}
          </TextInput>
        </SettingItem>

        <SettingItem title="Email">
          <Text>{userProfile.gs_user_email}</Text>
        </SettingItem>

        <SettingItem title="Bio" showBorder={false}>
          <TextInput
            placeholder="None"
            textAlign="right"
            onChangeText={gs_user_bio => {
              setNewUserInfo({...newUserInfo, gs_user_bio});
            }}>
            {newUserInfo.gs_user_bio}
          </TextInput>
        </SettingItem>
      </SettingSection>
    </ScrollPage>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: 'center',
  },

  container: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
});

export default UserSettingPage;
