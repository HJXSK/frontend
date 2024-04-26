import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreenContent from './ChatScreenContent';
import { getAuth, signOut } from "firebase/auth";

const Tab = createBottomTabNavigator();

function HomeScreen(): React.JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
    </View>
  );
}

function ChatScreen(): React.JSX.Element {
  return <ChatScreenContent />;
}

function UploadScreen(): React.JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Upload</Text>
    </View>
  );
}

function App({ navigation }): React.JSX.Element {
  const logout = () => {
    // Perform logout logic here
    console.log('Logged out');
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 10 }}>
            <Text style={{ color: '#007AFF' }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
      tabBarOptions={{
        activeTintColor: '#007AFF',
        style: { backgroundColor: 'white' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
    </Tab.Navigator>
  );
}

export default App;