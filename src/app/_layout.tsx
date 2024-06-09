/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ThemeProvider} from '../themes';
import {AuthProvider} from '../contexts/authContext';
import {Provider} from 'react-redux';
import {store} from '@/redux/store';
import {Slot} from 'expo-router';
function RootLayout(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default RootLayout;
