/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ThemeProvider} from '../themes';
import {AuthProvider} from '../contexts/authContext';

import {Slot} from 'expo-router';

function RootLayout(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default RootLayout;
