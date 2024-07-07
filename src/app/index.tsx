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
import ChatPage from './home/chat';
import InitPage from './init';
import ChatTitle from './home/chat/chatTitle';
import SettingButton from './home/chat/SettingButton';
import MainSettingPage from './home/settings/main';
import UserSettingPage from './home/settings/user';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ChatBotSettingPage from './home/settings/chatbot';

const Stack = createNativeStackNavigator<AppStackParamList>();

export type AppStackParamList = {
  'sign-in': undefined;
  'sign-up': undefined;
  'setting-main': undefined;
  'setting-user': undefined;
  'setting-chatbot': undefined;
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
          <GestureHandlerRootView style={{flex: 1}}>
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
                    component={ChatPage}
                    options={({navigation, route}) => ({
                      title: 'Chat',
                      headerTitle: () => <ChatTitle navigation={navigation} />,
                      headerRight: () => (
                        <SettingButton navigation={navigation} />
                      ),
                      headerTransparent: true,
                      headerBlurEffect: 'light',
                    })}
                  />
                  <Stack.Screen
                    name="setting-main"
                    component={MainSettingPage}
                    options={{title: 'Settings'}}
                  />
                  <Stack.Screen
                    name="setting-user"
                    component={UserSettingPage}
                    options={{title: 'User'}}
                  />
                  <Stack.Screen
                    name="setting-chatbot"
                    component={ChatBotSettingPage}
                    options={{title: 'Chatbot'}}
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
          </GestureHandlerRootView>
        </ThemeProvider>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
