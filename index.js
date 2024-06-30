/**
 * @format
 */

/** For integration to Expo: https://docs.expo.dev/guides/adopting-prebuild/#migrate-native-customizations
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
 */

import {registerRootComponent} from 'expo';
import App from './src/app/';
// import LoginScreen from './src/app/auth/login';

registerRootComponent(App);
