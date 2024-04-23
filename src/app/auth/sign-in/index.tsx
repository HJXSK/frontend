import {Stack, router} from 'expo-router';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useState} from 'react';
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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import Divider from './divider';
import {useTheme} from '../../../themes';
import {useAuth} from '../../../contexts/authContext';
import {FIREBASE_AUTH} from '../../../firebase/firebaseConfig';

type FormData = {
  email: string;
  password: string;
};

function SignInScreen(): React.JSX.Element {
  // state that indicates if the user is logging in.
  const [loading, setLoading] = useState<boolean>(false);
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

  /**
   * Sign in with email / password
   * @param data
   */
  const emailSignIn = async (data: FormData) => {
    setLoading(true);
    await signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        setAuth(user);
      })
      .catch(error => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        Alert.alert('Invalid credential');
      });
    setLoading(false);
  };

  /**
   * Sign in with Google Account
   */
  const googleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn()
      .then(user => {
        setAuth(user);
      })
      .catch(error => {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
          // some other error happened
        }
      });
  };

  const resetPassword = async () => {
    // TODO:
  };

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
        onPress={handleSubmit(emailSignIn)}
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
            <Text style={{textAlign: 'center', color: 'white'}}>Sign in</Text>
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

      <Divider style={{width: '60%'}}>
        <Text style={{color: theme.colors.secondary}}>or</Text>
      </Divider>

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={googleSignIn}
        disabled={loading}
      />
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
