import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {signInWithEmailAndPassword} from 'firebase/auth';

import {useTheme} from '../../../themes';
import {FIREBASE_AUTH} from '../../../firebase/firebaseConfig';
import {useAuth} from '../../../contexts/authContext';
import {Stack, router} from 'expo-router';
import {useState} from 'react';

type FormData = {
  email: string;
  password: string;
};

function SignInScreen(): React.JSX.Element {
  // state that indicates if the user is logging in.
  const [loading, setLoading] = useState<Boolean>(false);
  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Global Contexts
  const theme = useTheme();
  const [_, setAuth] = useAuth();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        setAuth(user);
        // router.replace('/(app)/home');
      })
      .catch(error => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        Alert.alert('Invalid credential');
      });
    setLoading(false);
  };

  const resetPassword = async () => {};

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Stack.Screen options={{headerShown: false, title: 'Login'}} />
      <Text style={{margin: 100}}>LOGO</Text>
      {/* Email */}
      <Controller
        control={control}
        rules={{
          required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
            message: 'Invalid Email',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder={'Email'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            style={[
              styles.inputField,
              {backgroundColor: theme.colors.foreground},
            ]}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder={'password'}
            onBlur={onBlur}
            secureTextEntry={true}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            style={[
              styles.inputField,
              {backgroundColor: theme.colors.foreground},
            ]}
          />
        )}
        name="password"
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        style={[
          styles.loginButton,
          {
            backgroundColor: theme.colors.primary,
            opacity: isValid ? 1 : 0.4,
          },
        ]}
        activeOpacity={0.8}>
        <View>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.foreground} />
          ) : (
            <Text style={{textAlign: 'center', color: 'white'}}>Login</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.miscContainer}>
        <TouchableOpacity onPress={resetPassword}>
          <Text style={[styles.miscButton, {color: theme.colors.primary}]}>
            Forget password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push('auth/register');
          }}>
          <Text style={[styles.miscButton, {color: theme.colors.primary}]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    flexDirection: 'column',
    padding: 15,
    borderRadius: 8,
    rowGap: 10,
    width: '80%',
  },
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 15,
    width: '80%',
    borderRadius: 8,
  },

  miscContainer: {
    flexDirection: 'row',
    borderColor: 'black',
    width: '80%',
    justifyContent: 'space-between',
  },

  miscButton: {
    fontSize: 15,
  },
});

export default SignInScreen;
