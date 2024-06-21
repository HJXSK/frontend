import {View, Button, StyleSheet, TextInput, Text} from 'react-native';
import {Stack} from 'expo-router';
import {SettingItem, SettingSection} from '@/components/settings/item';
import Avatar from '@/components/settings/user/avatar';
import ScrollPage from '@/components/page';
import {getAuth} from 'firebase/auth';
import {FIRESTORE} from '@/firebase/firebaseConfig';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import {useEffect, useState, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {update_profile} from '@/redux/features/user/userProfileSlice';

type UserType = Record<string, any>;

// Define the UserPage component
const UserPage = () => {
  // Get the current authenticated user
  const auth = getAuth().currentUser!;
  const dispatch = useDispatch();

  // Create a reference to the user document in Firestore
  const userRef = doc(FIRESTORE, 'users', auth.uid);

  // Define state variables for the original user info and the modified user info
  const [originalUserInfo, setOriginalUserInfo] = useState<UserType>({});
  const [userInfo, setUserInfo] = useState<UserType>({});

  // Calculate the changes made to the user info and whether any changes have been made
  const [changes, isEdited] = useMemo(() => {
    const result = Object.keys(userInfo).reduce((acc, key) => {
      if (userInfo[key] !== originalUserInfo[key]) {
        acc[key] = userInfo[key];
      }
      return acc;
    }, {} as {[key: string]: any});
    const isEdited = Object.keys(result).length > 0;
    return [result, isEdited];
  }, [userInfo, originalUserInfo]);

  // Fetch the user info from Firestore when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserInfo(userSnap.data());
        setOriginalUserInfo(userSnap.data());
      } else {
        setDoc(userRef, {});
      }
    };
    fetchUser();
  }, []);

  /**
   * Save the user info to Firestore
   */
  const saveUser = async () => {
    try {
      // Update the user document in Firestore with the changes
      await updateDoc(userRef, changes);
      // Update the original user info with the modified user info
      setOriginalUserInfo(userInfo);
      // Dispatch an action to update the user profile in Redux
      dispatch(update_profile(userInfo));
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <ScrollPage>
      <Stack.Screen
        options={{
          title: 'User',
          headerRight: () => (
            <Button disabled={!isEdited} title="Done" onPress={saveUser} />
          ),
        }}
      />
      <View style={styles.avatarWrapper}>
        <Avatar width={100} height={100} />
      </View>
      <SettingSection>
        <SettingItem title="Name">
          <TextInput
            placeholder="None"
            textAlign="right"
            onChangeText={name => {
              setUserInfo({...userInfo, name});
            }}>
            {userInfo.name}
          </TextInput>
        </SettingItem>

        <SettingItem title="Email">
          <Text>{auth.email}</Text>
        </SettingItem>

        <SettingItem title="Bio" showBorder={false}>
          <TextInput
            placeholder="None"
            textAlign="right"
            onChangeText={bio => {
              setUserInfo({...userInfo, bio});
            }}>
            {userInfo.bio}
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

export default UserPage;
