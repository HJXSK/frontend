import {FIRESTORE} from '@/firebase/firebaseConfig';
import {update_profile} from '@/redux/features/user/userProfileSlice';
import {router} from 'expo-router';
import {getAuth} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';

const InitPage: React.FC = (): JSX.Element => {
  const auth = getAuth().currentUser!;
  const dispatch = useDispatch();

  const initializeUser = async () => {
    const userRef = doc(FIRESTORE, 'users', auth.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      dispatch(update_profile(userSnap.data()));
    }
    console.log('User initialized');
  };
  const initializeStore = async () => {
    initializeUser();
  };

  useEffect(() => {
    initializeStore();
    router.replace('/home');
  }, []);

  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

export default InitPage;
