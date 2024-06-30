import FontAwesome from '@expo/vector-icons/FontAwesome';
import ChatTitle from './chat/chatTitle';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatPage from '@/app/home/chat/index';
import SettingStack from './settings/settingStack';

const Tab = createBottomTabNavigator();

export default function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="chat"
        component={ChatPage}
        options={{
          title: 'Chat',
          headerTitle: props => <ChatTitle />,
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="comments" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
