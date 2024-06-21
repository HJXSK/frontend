import {View, StyleSheet, Pressable, Text} from 'react-native';
import {FontAwesome6} from '@expo/vector-icons';

type ItemType = 'item' | 'category';

type RawItemProps = {
  before?: JSX.Element;
  onPress?: () => void;
  onToggle?: () => void;
  children: React.ReactNode;
  showBorder?: boolean;
  category?: ItemType;
};

type ItemProps = RawItemProps & {title: string};

const SettingItem: React.FC<ItemProps> = ({
  title,
  before,
  onPress,
  children,
  category,
  showBorder = true,
}): JSX.Element => {
  return (
    <SettingItemRaw
      onPress={onPress}
      before={before}
      showBorder={showBorder}
      category={category}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </SettingItemRaw>
  );
};

const SettingItemRaw: React.FC<RawItemProps> = ({
  onPress,
  children,
  before,
  showBorder = true,
  category = 'item',
}): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({pressed}) => [
        styles.item,
        {
          backgroundColor: pressed ? '#EDEDED' : 'white',
        },
      ]}>
      <View style={styles.before}>{before}</View>

      <View
        style={[
          styles.mainWrapper,
          showBorder && {borderBottomWidth: 0.5, borderColor: 'lightgray'},
        ]}>
        <View style={styles.contentWrapper}>{children}</View>
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
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
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
  titleWrapper: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  before: {
    margin: 10,
    justifyContent: 'center',
  },
  category: {
    marginRight: 10,
    justifyContent: 'center',
  },
});

const SettingSection = ({children}: {children: React.ReactNode}) => {
  return <View style={styles.section}>{children}</View>;
};

export {SettingItem, SettingSection, SettingItemRaw};
