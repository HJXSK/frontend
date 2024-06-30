import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainSettingPage from './main';
import UserSettingPage from './user';

const Stack = createNativeStackNavigator<SettingStackParamList>();

export type SettingStackParamList = {
  main: undefined;
  user: undefined;
};

const SettingStack: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="main"
        component={MainSettingPage}
        options={{title: 'Settings'}}
      />
      <Stack.Screen
        name="user"
        component={UserSettingPage}
        options={{title: 'User'}}
      />
    </Stack.Navigator>
  );
};

export default SettingStack;
