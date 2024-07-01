import {TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type settingButtonProps = {
  navigation: any;
};

const SettingButton: React.FC<settingButtonProps> = ({
  navigation,
}): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('setting-main');
      }}>
      <Ionicons name="cog-outline" size={30} color="black" />
    </TouchableOpacity>
  );
};

export default SettingButton;
