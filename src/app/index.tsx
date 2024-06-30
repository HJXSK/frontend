/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {ThemeProvider} from '../themes';
import {Provider} from 'react-redux';
import {store} from '@/redux/store';
import {FIREBASE_AUTH} from '@/firebase/firebaseConfig';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInPage from './auth/sign-in';
import SignUpPage from './auth/register';
import Home from './home/homeTab';
import InitPage from './init';

const Stack = createNativeStackNavigator<AppStackParamList>();

export type AppStackParamList = {
  'sign-in': undefined;
  'sign-up': undefined;
  home: undefined;
  init: undefined;
};

function App(): React.JSX.Element {
  const [signedIn, setSignedIn] = useState(false);
  FIREBASE_AUTH.onAuthStateChanged(user => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  return (
    <NavigationContainer>
      <Provider store={store}>
        <ThemeProvider>
          <Stack.Navigator>
            {signedIn ? (
              <>
                <Stack.Screen
                  name="init"
                  component={InitPage}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="home"
                  component={Home}
                  options={{headerShown: false}}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="sign-in"
                  component={SignInPage}
                  options={{headerShown: false, title: 'Sign In'}}
                />
                <Stack.Screen
                  name="sign-up"
                  component={SignUpPage}
                  options={{title: 'Sign Up'}}
                />
              </>
            )}
          </Stack.Navigator>
        </ThemeProvider>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
