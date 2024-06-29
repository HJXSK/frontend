// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
import {getFirestore, connectFirestoreEmulator} from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getReactNativePersistence,
  initializeAuth,
  connectAuthEmulator,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getFunctions, connectFunctionsEmulator} from 'firebase/functions';
import {connectStorageEmulator, getStorage} from 'firebase/storage';

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

// The Firestore service
export const FIRESTORE = getFirestore(FIREBASE_APP);

export const FUNCTIONS = getFunctions(FIREBASE_APP);

export const STORAGE = getStorage(FIREBASE_APP);

if (process.env.EXPO_PUBLIC_APP_ENV == 'local') {
  // Emulator for Firestore
  connectFirestoreEmulator(FIRESTORE, '127.0.0.1', 8080);
  // Emulator for Cloud Functions
  connectFunctionsEmulator(FUNCTIONS, '127.0.0.1', 5001);
  // Emulator for Storage
  connectStorageEmulator(STORAGE, '127.0.0.1', 9199);
  // Emulator for Authentication
  connectAuthEmulator(FIREBASE_AUTH, 'http://127.0.0.1:9099');
}

// Google SignIn
GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '194914393670-jig8l4659svp33h7respcqqval4ev1cl.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
  // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
