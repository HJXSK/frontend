import {View, Button, StyleSheet, TextInput, Text} from 'react-native';
import {SettingItem, SettingSection} from '@/components/settings/item';
import Avatar from '@/components/settings/avatar';
import ScrollPage from '@/components/page';
import {useState, useMemo, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUserProfile,
  update_profile,
} from '@/redux/features/user/userProfileSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '@/app';

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
        console.log('Key: ', key, newUserInfo[key], userProfile[key]);
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

      dispatch(update_profile(changes));
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <ScrollPage>
      <View style={styles.avatarWrapper}>
        <Avatar width={100} height={100} />
      </View>
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
