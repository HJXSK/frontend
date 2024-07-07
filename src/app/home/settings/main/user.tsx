import {View, Text, StyleSheet} from 'react-native';
import Avatar from '@/components/settings/avatar';
import {useSelector} from 'react-redux';
import {selectUserProfile} from '@/redux/features/user/userProfileSlice';
import {SettingItemRaw, SettingSection} from '@components/settings/item';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {downloadFileAsync} from '@/util/firebase';

type UserProps = {
  navigation: any;
};

function User({navigation}: UserProps): JSX.Element {
  const userProfile = useSelector(selectUserProfile);
  // Define state variable to store the image URL
  const [image, setImage] = useState<string | null>(null);

  // Use the useFocusEffect hook to execute the callback when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      // Check if the userProfile has a gs_user_avatar
      if (userProfile.gs_user_avatar) {
        // Download the file asynchronously and set the image URL
        downloadFileAsync(userProfile.gs_user_avatar).then(({url}) =>
          setImage(url),
        );
      }
    }, [image]),
  );

  return (
    <SettingSection>
      <SettingItemRaw
        category="category"
        showBorder={false}
        onPress={() => navigation.navigate('setting-user')}
        before={<Avatar src={image} />}>
        <View style={styles.content}>
          <Text style={styles.name}>{userProfile.gs_user_name}</Text>
          <Text style={[styles.bio]}>{userProfile.gs_user_bio}</Text>
        </View>
      </SettingItemRaw>
    </SettingSection>
  );
}

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 25,
  },
  bio: {
    fontSize: 15,
    color: 'gray',
  },
});

export default User;
