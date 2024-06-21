/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ThemeProvider} from '../themes';
import {Provider} from 'react-redux';
import {store} from '@/redux/store';
import {Slot} from 'expo-router';
import {FIREBASE_AUTH} from '@/firebase/firebaseConfig';
import {router} from 'expo-router';

function RootLayout(): React.JSX.Element {
  FIREBASE_AUTH.onAuthStateChanged(user => {
    if (user) {
      router.replace('/init');
    } else {
      router.replace('/auth/sign-in');
    }
  });

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </Provider>
  );
}

export default RootLayout;
