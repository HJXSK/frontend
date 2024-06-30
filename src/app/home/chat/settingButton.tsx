import {Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';

type settingButtonProps = {
  navigation: any;
};

const SettingButton: React.FC<settingButtonProps> = ({
  navigation,
}): JSX.Element => {
  const [isPressing, setIsPressing] = useState(false);

  return (
    <Pressable
      onPressIn={() => {
        setIsPressing(true);
      }}
      onPressOut={() => {
        setIsPressing(false);
        navigation.navigate('setting-main');
      }}>
      <Ionicons
        name="cog-outline"
        size={30}
        color={isPressing ? 'gray' : 'black'}
      />
    </Pressable>
  );
};

export default SettingButton;
