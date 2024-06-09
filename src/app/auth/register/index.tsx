import {Stack, router} from 'expo-router';
import {getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
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

import {useTheme} from '../../../themes';
import {FIREBASE_AUTH} from '../../../firebase/firebaseConfig';

type FormData = {
  email: string;
  password: string;
  confirmpw: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
function SignUpScreen(): React.JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmpw: '',
    },
  });

  const pwd = watch('password');

  const theme = useTheme();
  const auth = getAuth();

  const onSignUpPressed = async (data: FormData) => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password);
      const user = userCredential.user;
      await sendEmailVerification(user); // Send verification email

      console.log("Verification email sent successfully");
      Alert.alert(
        'Sign up success',
        'A verification email has been sent to your email address.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/sign-in'), // Navigate to the login screen
          },
        ]
      );
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      
      //Validate if email is in use
      if (errorCode === 'auth/email-already-in-use') {
        Alert.alert(
          'Email already in use',
          'The provided email address is already associated with an existing account.',
        );
      } else {
        Alert.alert('Sign up error', errorMessage);
      }
    }

    setLoading(false);
  };


  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Stack.Screen options={{headerShown: true, title: 'Sign Up'}} />
      <Text style={{
        margin: 20,
        fontSize:15,
      }} >Welcome! Please fill in your information.</Text>
      
      <View style = {styles.inputContainer}>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {value: EMAIL_REGEX, message: 'Email is invalid',
            },
          }}
          render={({field: {onChange, onBlur, value},fieldState: {error}}) => (
            <>
                <TextInput
                  placeholder={'Email'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={[
                    styles.inputField,
                    {backgroundColor: theme.colors.foreground},
                  ]}
                />
              {error && (
                <Text style = {{alignSelf: 'stretch', borderLeftWidth: 45, color: 'red' }}>{error.message || 'Error'}</Text>
              )}
            </>
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: 'Password is required',
            pattern: {
              value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
              message:'Password requirement: includes Uppercase, Lowercase, Number and 8 or more characters.'
            },
          }}
          render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
            <>
                <TextInput
                  placeholder={'password'}
                  onBlur={onBlur}
                  secureTextEntry={true}
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={[
                    styles.inputField,
                    {backgroundColor: theme.colors.foreground},
                  ]}
                />
              {error && (
                <Text style = {{alignSelf: 'stretch', borderLeftWidth: 45, color: 'red' }}>{error.message || 'Error'}</Text>
              )}
            </>
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{
            required: 'Confirm password is required',
            validate: value => value === pwd || 'Password does not match',
          }}
          render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
            <>
                <TextInput
                  placeholder={'Confirm password'}
                  onBlur={onBlur}
                  secureTextEntry={true}
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={[
                    styles.inputField,
                    {backgroundColor: theme.colors.foreground},
                  ]}
                />
              {error && (
              <Text style = {{alignSelf: 'stretch', borderLeftWidth: 45, color: 'red' }}>{error.message || 'Error'}</Text>
              )}
            </>
          )}
          name="confirmpw"
        />
        {/* SignUp Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSignUpPressed)}
          style={[
            styles.signupButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: 0.4,
            },
          ]}
          activeOpacity={0.8}>
          <View>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.foreground} />
            ) : (
              <Text style={{textAlign: 'center', color: 'white'}}>Sign Up</Text>
           )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
  },
  inputField: {
    flexDirection: 'column',
    padding: 15,
    borderRadius: 8,
    rowGap: 10,
    width: '80%',
  },
  container: {
    flex: 1,
    gap: 10,
    alignItems: 'stretch',
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: 15,
    width: '30%',
    borderRadius: 8,
  },
});

export default SignUpScreen;
