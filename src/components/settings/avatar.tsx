import {Image, StyleSheet} from 'react-native';

type AvatarProps = {
  width?: number;
  height?: number;
  src?: string | null;
};

const Avatar: React.FC<AvatarProps> = ({
  width = 60,
  height = 60,
  src = null,
}): JSX.Element => {
  const source = src ? {uri: src} : require('../../assets/default_avatar.png');

  return (
    <Image
      alt=""
      source={source}
      style={[styles.profileAvatar, {width: width, height: height}]}
    />
  );
};

const styles = StyleSheet.create({
  profileAvatar: {
    borderRadius: 50,
  },
});

export default Avatar;
