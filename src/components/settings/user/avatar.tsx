import {Image, StyleSheet} from 'react-native';

type AvatarProps = {
  width?: number;
  height?: number;
};

const Avatar: React.FC<AvatarProps> = ({
  width = 60,
  height = 60,
}): JSX.Element => {
  return (
    <Image
      alt=""
      source={{
        uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
      }}
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
