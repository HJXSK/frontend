import {FIRESTORE} from '@/firebase/firebaseConfig';
import {init_settings} from '@/redux/features/settings/settingsSlice';
import {update_profile} from '@/redux/features/user/userProfileSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getAuth} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppStackParamList} from '.';

type InitPageProps = NativeStackScreenProps<AppStackParamList, 'init'>;

const InitPage: React.FC<InitPageProps> = ({navigation}): JSX.Element => {
  const auth = getAuth().currentUser!;
  const dispatch = useDispatch();

  const initializeUser = async () => {
    const userRef = doc(FIRESTORE, 'users', auth.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      dispatch(update_profile(data));
      console.log('User initialized: Synced with Firestore');
      dispatch(init_settings(data.settings));
      console.log('User Settings initialized: Synced with Firestore');
    }
  };
  const initializeStore = async () => {
    initializeUser();
  };

  useEffect(() => {
    initializeStore();
    navigation.navigate('home');
  }, []);

  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

export default InitPage;
