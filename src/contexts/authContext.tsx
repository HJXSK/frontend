import {ReactNode, createContext, useContext, useState} from 'react';

const AuthContext = createContext<any>([]);

/**
 * A hook function that allows to access authentication status
 * @returns auth / setAuth hooks
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({children}: {children: ReactNode}) {
  const [auth, setAuth] = useState<Boolean>(false);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}
