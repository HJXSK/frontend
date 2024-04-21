/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from '../themes';
import {AuthProvider} from '../contexts/authContext';

import {Redirect, Slot, Stack} from 'expo-router';

import LoginScreen from './auth/login';
import RegisterScreen from './auth/register';
import {Button} from 'react-native';

function RootLayout(): React.JSX.Element {
  const [auth, setAuth] = useState<Boolean>(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default RootLayout;
