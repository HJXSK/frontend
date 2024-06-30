import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatPage from './index';
import ChatTitle from './chatTitle';

type ChatStackParamList = {
  matching: undefined;
  chat: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="matching" component={MatchingPage} /> */}
      <Stack.Screen
        name="chat"
        component={ChatPage}
        options={{
          title: 'Chat',
          headerTitle: props => <ChatTitle />,
          headerTransparent: true,
          headerBlurEffect: 'light',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
