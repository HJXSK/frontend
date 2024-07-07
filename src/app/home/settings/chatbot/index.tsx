import {Button, TextInput} from 'react-native';
import {SettingItem, SettingSection} from '@/components/settings/item';
import ScrollPage from '@/components/page';
import {useState, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '@/app';
import * as ImagePicker from 'expo-image-picker';
import {uploadFileAsync} from '@/util/firebase';
import ChatBotAvatar from '@/components/chatbot/ChatBotAvatar';
import {
  selectChatbotSettings,
  update_chatbot_settings,
} from '@/redux/features/settings/settingsSlice';
import useChanges from '@/hooks/useChanges';

type UserType = Record<string, any>;

type ChatbotSettingPageProps = NativeStackScreenProps<
  AppStackParamList,
  'setting-chatbot'
>;

// Define the UserPage component
const ChatBotSettingPage: React.FC<ChatbotSettingPageProps> = ({
  navigation,
}): JSX.Element => {
  // Get the current authenticated user
  const dispatch = useDispatch();

  // Define state variables for the original user info and the modified user info
  const chatBotSettings = useSelector(selectChatbotSettings);
  const [newChatbotSettings, setNewChatbotSettings, changes, isEdited] =
    useChanges(chatBotSettings);
  const [image, setImage] = useState<string | null>(null);

  /**
   * Save the user info to Firestore
   */
  const save = async () => {
    try {
      // Dispatch an action to update the user profile in Redux
      if (changes.gs_settings_bot_avatar) {
        const path = await uploadFileAsync(
          changes.gs_settings_bot_avatar,
          'image',
        );
        changes.gs_settings_bot_avatar = path;
        setNewChatbotSettings({
          ...newChatbotSettings,
          gs_settings_bot_avatar: path,
        });
      }
      dispatch(update_chatbot_settings(changes));
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const updateAvatar = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      // https://stackoverflow.com/questions/70528896/react-native-expo-image-picker-upload-image-to-firebase-storage-v9-crash
      quality: 0.5, // as well as using uploadBytesResumable
    });

    if (!result.canceled) {
      result.assets.forEach(async asset => {
        setImage(asset.uri);
        setNewChatbotSettings({
          ...newChatbotSettings,
          gs_settings_bot_avatar: asset.uri,
        });
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button disabled={!isEdited} title="Done" onPress={save} />
      ),
    });
  }, [changes]);

  return (
    <ScrollPage>
      <SettingSection>
        <SettingItem title="Avatar" onPress={updateAvatar}>
          <ChatBotAvatar src={image} />
        </SettingItem>

        <SettingItem title="Name" showBorder={false}>
          <TextInput
            placeholder="None"
            textAlign="right"
            onChangeText={gs_settings_bot_name => {
              console.log(gs_settings_bot_name);
              setNewChatbotSettings({
                ...newChatbotSettings,
                gs_settings_bot_name,
              });
            }}>
            {chatBotSettings.gs_settings_bot_name}
          </TextInput>
        </SettingItem>
      </SettingSection>
    </ScrollPage>
  );
};

export default ChatBotSettingPage;
