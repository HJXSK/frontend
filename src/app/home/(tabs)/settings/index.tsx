import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectSettings,
  toggle_ProfanityFilter,
} from '@/redux/features/settings/settingsSlice';
import {RootState} from '@/redux/store';
import {FontAwesome} from '@expo/vector-icons';
import {UnknownAction} from '@reduxjs/toolkit';
import {useTheme} from '@/themes';
import {getAuth, signOut} from 'firebase/auth';
import User from '@/components/settings/user';
import {Stack} from 'expo-router';
import ScrollPage from '@/components/page';
import {SettingItem, SettingSection} from '@/components/settings/item';

const styles = StyleSheet.create({
  signOutButtonContainer: {
    backgroundColor: 'white',
    padding: 7,
  },
  signOutButtonText: {
    textAlign: 'center',
    fontSize: 18,
  },
});

const Settings: React.FC = (): JSX.Element => {
  // Get the current theme
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get the authentication instance
  const auth = getAuth();

  // Function to handle sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const settings = useSelector(selectSettings);

  return (
    <ScrollPage>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
      />
      <User />
      <SettingSection>
        <SettingItem
          title="Profanity Filter"
          showBorder={false}
          before={
            <FontAwesome
              name="exclamation-circle"
              size={25}
              color={'#EE4B2B'}
            />
          }>
          <Switch
            onChange={() => {
              dispatch(toggle_ProfanityFilter());
            }}
            value={settings.gs_settings_profanity_filter}
          />
        </SettingItem>
      </SettingSection>

      <SettingSection>
        <TouchableOpacity
          style={styles.signOutButtonContainer}
          onPress={handleSignOut}>
          <Text
            style={[styles.signOutButtonText, {color: theme.colors.danger}]}>
            Sign out
          </Text>
        </TouchableOpacity>
      </SettingSection>
    </ScrollPage>
  );
};

export default Settings;
