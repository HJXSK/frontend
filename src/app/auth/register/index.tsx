import {Stack} from 'expo-router';
import {View, Text} from 'react-native';

function RegisterScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Stack.Screen options={{title: 'Sign Up'}} />
      <Text>KIKI</Text>
    </View>
  );
}

export default RegisterScreen;
