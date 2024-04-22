import {router} from 'expo-router';
import {User} from 'firebase/auth';
import {ReactNode, createContext, useContext, useEffect, useState} from 'react';

type AuthType = [auth: User | null, setAuth: any | null];

const AuthContext = createContext<AuthType>([null, null]);

/**
 * A hook function that allows to access authentication status
 * @returns auth / setAuth hooks
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({children}: {children: ReactNode}) {
  const [auth, setAuth] = useState<User | null>(null);

  useEffect(() => {
    if (auth) {
      router.replace('/(app)/home');
    } else {
      router.replace('/auth/sign-in');
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}
