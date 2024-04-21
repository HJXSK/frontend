import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useTheme} from '../../../themes';

type FormData = {
  credential: string;
  password: string;
};

function LoginScreen(): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      credential: '',
      password: '',
    },
  });

  const theme = useTheme();

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={{margin: 100}}>LOGO</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder={'Username or Email'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[
              styles.inputField,
              {backgroundColor: theme.colors.foreground},
            ]}
          />
        )}
        name="credential"
      />

      {/* {errors.username && <Text>This is required.</Text>} */}

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
            style={[
              styles.inputField,
              {backgroundColor: theme.colors.foreground},
            ]}
          />
        )}
        name="password"
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[styles.loginButton, {backgroundColor: theme.colors.primary}]}
        activeOpacity={0.8}>
        <View>
          <Text style={{textAlign: 'center', color: 'white'}}>Login</Text>
        </View>
      </TouchableOpacity>
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
});

export default LoginScreen;
