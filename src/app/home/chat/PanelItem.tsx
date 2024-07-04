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
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(59,59,59,0.1)',
  },
});
