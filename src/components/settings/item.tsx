import {View, StyleSheet, Pressable, Text} from 'react-native';
import {FontAwesome6} from '@expo/vector-icons';

type ItemType = 'item' | 'category';

type ItemProps = {
  title: string;
  icon?: JSX.Element;
  onPress?: () => void;
  onToggle?: () => void;
  children: React.ReactNode;
  showBorder?: boolean;
  category?: ItemType;
};

const SettingItem: React.FC<ItemProps> = ({
  title,
  icon,
  onPress,
  children,
  category = 'item',
  showBorder = true,
}): JSX.Element => {
  return (
    <Pressable
      disabled={!onPress}
      style={({pressed}) => [
        styles.item,
        {
          backgroundColor: pressed ? '#EDEDED' : 'white',
        },
      ]}>
      <View style={styles.icon}>{icon}</View>
      <View
        style={[
          styles.contentWrapper,
          showBorder && {borderBottomWidth: 0.5, borderColor: 'lightgray'},
        ]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.content}>{children}</View>
        {category === 'category' && (
          <View style={styles.category}>
            <FontAwesome6 name="angle-right" size={24} color="lightgray" />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 30,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'flex-end',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
  },
  icon: {
    margin: 10,
    justifyContent: 'center',
  },
  category: {
    // marginLeft: 'auto',
    marginRight: 10,
    justifyContent: 'center',
  },
});

const SettingSection = ({children}: {children: React.ReactNode}) => {
  return <View style={styles.section}>{children}</View>;
};

export {SettingItem, SettingSection};
