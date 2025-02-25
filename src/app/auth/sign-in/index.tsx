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
  SafeAreaView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import Divider from './divider';
import {useTheme} from '../../../themes';
import {FIREBASE_AUTH} from '../../../firebase/firebaseConfig';

import {AppStackParamList} from '@/app';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image} from 'react-native';

type FormData = {
  email: string;
  password: string;
};

type SignInPageProps = NativeStackScreenProps<AppStackParamList, 'sign-in'>;

function SignInPage({navigation}: SignInPageProps): React.JSX.Element {
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
        console.log('user logged in');
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
        console.log('User googled signed in');
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

  // const signInAsGuest = async () => {
  //   setLoading(true);

  //   try {
  //     // Perform the guest sign-in logic here
  //     // For example, you can create a guest account with a unique identifier and sign in using that account
  //     const guestEmail = 'hjxskhku@gmail.com'; // Generate a unique guest email
  //     const guestPassword = 'Hjxskhku5!Capstone'; // Set a temporary password for the guest account

  //     // Sign in with the generated guest credentials
  //     await signInWithEmailAndPassword(
  //       FIREBASE_AUTH,
  //       guestEmail,
  //       guestPassword,
  //     );
  //     setLoading(false);

  //     // Handle the successful sign-in as a guest
  //     // You can navigate to the "Guest Home View" page or perform any other actions here
  //     router.push('Guest Home View'); // Replace 'Guest Home View' with the actual route name for the guest home page
  //   } catch (error) {
  //     setLoading(false);
  //     Alert.alert('Error', 'Failed to sign in as a guest');
  //   }
  // };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View
        style={{
          margin: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{width: 60, height: 60}}
          resizeMode="contain"
        />

        <Text style={{fontSize: 50, fontWeight: '500'}}>Sandwich</Text>
      </View>
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

      {/* Sign in as Guest */}
      {/* <TouchableOpacity
        onPress={handleSubmit(signInAsGuest)}
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
            <Text style={{textAlign: 'center', color: 'white'}}>
              Sign in as Guest
            </Text>
          )}
        </View>
      </TouchableOpacity> */}

      <View style={styles.miscContainer}>
        <TouchableOpacity onPress={resetPassword}>
          <Text style={[styles.miscButton, {color: theme.colors.primary}]}>
            Forget password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('sign-up');
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
    </SafeAreaView>
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

export default SignInPage;
