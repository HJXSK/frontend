// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDnTIqsxBHcaH5Z6LKyrwzL58djts6cr_E',
  authDomain: 'hjxsk-hku.firebaseapp.com',
  projectId: 'hjxsk-hku',
  storageBucket: 'hjxsk-hku.appspot.com',
  messagingSenderId: '194914393670',
  appId: '1:194914393670:web:4a95acebc82edab23ab447',
  measurementId: 'G-R0F1KWCTND',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  // to prevent re-sign-in
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
