import {child} from 'firebase/database';
import React, {ReactNode} from 'react';
import {View, Text, StyleProp, ViewStyle, StyleSheet} from 'react-native';
import {useTheme} from '../../../themes';

type DividerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Divider({children, style}: DividerProps): React.JSX.Element {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.line, {backgroundColor: theme.colors.secondary}]} />
      {children}
      <Text style={[styles.line, {backgroundColor: theme.colors.secondary}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
  },
  line: {
    height: 1,
    flex: 1,
  },
});

export default Divider;
