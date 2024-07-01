import {useTheme} from '@/themes';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

type SendButtonProps = TouchableOpacityProps;

const SendButton: React.FC<SendButtonProps> = (props): JSX.Element => {
  const theme = useTheme();

  return (
    <TouchableOpacity {...props} activeOpacity={0.3} disabled={props.disabled}>
      <MaterialCommunityIcons
        name="arrow-up-circle"
        size={theme.sizes.sm}
        style={{opacity: props.disabled ? 0.1 : 1}}
        color={theme.colors.primary}
      />
    </TouchableOpacity>
  );
};

export default SendButton;
