import React, {ReactNode, useContext, useState} from 'react';

type Theme = {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
  };
};

const LightTheme: Theme = {
  colors: {
    background: '#F5F5F5',
    foreground: 'white',
    primary: '#147efb',
    secondary: 'lightgray',
    // success: palette.green,
    // danger: palette.red,
    // failure: palette.red,
  },
};

const DarkTheme: Theme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    foreground: '#F5F5F5',
    background: 'black',
  },
};

const ThemeContext = React.createContext<Theme>(LightTheme);

/**
 * A hook function that allows to access theme
 * @returns value of current theme
 */
export const useTheme = () => {
  return useContext(ThemeContext);
};

export function ThemeProvider({children}: {children: ReactNode}) {
  const [darkMode, _] = useState<boolean>(false); // Default theme is 'light'
  return (
    <ThemeContext.Provider value={darkMode ? DarkTheme : LightTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
