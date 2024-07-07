import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {selectSettings} from '@/redux/features/settings/settingsSlice';
import {useSelector} from 'react-redux';
import ChatBotAvatar from '@/components/chatbot/ChatBotAvatar';

type ChatTitleProps = {
  navigation: any;
};
const ChatTitle: React.FC<ChatTitleProps> = ({navigation}): JSX.Element => {
  const settings = useSelector(selectSettings);

  return (
    <View style={[styles.headerContainer]}>
      <TouchableOpacity
        style={{backgroundColor: 'transparent'}}
        onPress={() => {
          navigation.navigate('setting-chatbot');
        }}>
        <ChatBotAvatar />
      </TouchableOpacity>
      <Text style={styles.name}>{settings.gs_settings_bot_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    gap: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ChatTitle;
