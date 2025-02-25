import {Text, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectSettings,
  toggle_ProfanityFilter,
} from '@/redux/features/settings/settingsSlice';
import {FontAwesome} from '@expo/vector-icons';
import {useTheme} from '@/themes';
import {getAuth, signOut} from 'firebase/auth';
import User from './user';
import ScrollPage from '@/components/page';
import {SettingItem, SettingSection} from '@/components/settings/item';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '@/app';
import ChatBotAvatar from '@/components/chatbot/ChatBotAvatar';

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

type MainSettingsProps = NativeStackScreenProps<
  AppStackParamList,
  'setting-main'
>;

const MainSettingsPage: React.FC<MainSettingsProps> = ({
  navigation,
}): JSX.Element => {
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
      <User navigation={navigation} />

      <SettingSection>
        <SettingItem
          title="Chatbot"
          showBorder={false}
          onPress={() => navigation.navigate('setting-chatbot')}
          category="category"
          before={<ChatBotAvatar />}
        />
      </SettingSection>

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

export default MainSettingsPage;
