import {Image, StyleSheet, ImageSourcePropType} from 'react-native';

type AvatarProps = {
  width?: number;
  height?: number;
  src?: string | null;
  source?: ImageSourcePropType;
};

const Avatar: React.FC<AvatarProps> = ({
  width = 60,
  height = 60,
  src = null,
  source,
}): JSX.Element => {
  return (
    <Image
      alt=""
      src={src || undefined}
      source={source || require('../../assets/default_avatar.png')}
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
