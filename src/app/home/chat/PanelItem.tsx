import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

type PanelItemProps = TouchableOpacityProps & {
  title: string;
  icon: React.ReactNode;
};
export default function PanelItem(props: PanelItemProps): JSX.Element {
  return (
    <View style={styles.rootContainer}>
      <TouchableOpacity style={styles.iconContainer} {...props}>
        {props.icon}
      </TouchableOpacity>
      <Text>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(59,59,59,0.1)',
  },
});
