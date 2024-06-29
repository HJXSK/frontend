import {Tabs} from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import ChatTitle from '@/components/chat/chatTitle';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="chat/index"
        options={{
          title: 'Chat',
          headerTitle: props => <ChatTitle />,
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="comments" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
