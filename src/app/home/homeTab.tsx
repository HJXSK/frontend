import FontAwesome from '@expo/vector-icons/FontAwesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingStack from './settings/settingStack';
import chatStack from './chat/chatStack';

const Tab = createBottomTabNavigator();

export default function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="chat-stack"
        component={chatStack}
        options={{
          headerShown: false,
          title: 'Chat',
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="comments" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="setting-stack"
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
