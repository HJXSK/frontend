/**
 * @format
 */

/** For integration to Expo: https://docs.expo.dev/guides/adopting-prebuild/#migrate-native-customizations
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
 */

import {registerRootComponent} from 'expo';
import App from './src/app/index';
// import LoginScreen from './src/app/auth/login';

registerRootComponent(App);

//! This is file is useless after package.json is configured with main specified: https://docs.expo.dev/router/installation/#setup-entry-point
