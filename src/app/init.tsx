import {FIRESTORE} from '@/firebase/firebaseConfig';
import {init_settings} from '@/redux/features/settings/settingsSlice';
import {
  init_profile,
  userProfile,
} from '@/redux/features/user/userProfileSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getAuth} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppStackParamList} from '.';
import {initialState as defaultSettings} from '@/redux/features/settings/settingsSlice';

type InitPageProps = NativeStackScreenProps<AppStackParamList, 'init'>;

const InitPage: React.FC<InitPageProps> = ({navigation}): JSX.Element => {
  const auth = getAuth().currentUser!;
  const dispatch = useDispatch();

  const initializeUser = async () => {
    const userRef = doc(FIRESTORE, 'users', auth.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      dispatch(init_profile(data));
      console.log('User profile synced successfully');
      dispatch(init_settings(data.settings));
      console.log('Settings synced successfully');
    } else {
      console.log('User profile not found, creating new profile');
      const defaultUserProfile: userProfile = {
        gs_user_name: auth.displayName,
        gs_user_email: auth.email,
        gs_user_bio: '',
        gs_user_avatar: auth.photoURL,
      };
      await setDoc(userRef, {
        ...defaultUserProfile,
        settings: {
          ...defaultSettings,
        },
      });
      // Sync the user profile
      dispatch(init_profile(defaultUserProfile));
    }
  };

  const initializeStore = async () => {
    await initializeUser();
    console.log('Synchronization completed');
  };

  useEffect(() => {
    initializeStore();
    navigation.replace('home');
  }, []);

  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

export default InitPage;
