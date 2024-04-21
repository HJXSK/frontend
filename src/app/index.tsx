import LoginScreen from './auth/login';
import {Redirect} from 'expo-router';
import {useAuth} from '../contexts/authContext';

function App() {
  const [auth, _] = useAuth();
  return !auth ? <LoginScreen /> : <Redirect href="auth/register" />;
}

export default App;
