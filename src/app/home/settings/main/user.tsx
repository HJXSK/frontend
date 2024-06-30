import {View, Text, StyleSheet} from 'react-native';
import Avatar from '@/components/settings/avatar';
import {useSelector} from 'react-redux';
import {selectUserProfile} from '@/redux/features/user/userProfileSlice';
import {SettingItemRaw, SettingSection} from '@components/settings/item';

type UserProps = {
  navigation: any;
};

function User({navigation}: UserProps): JSX.Element {
  const userProfile = useSelector(selectUserProfile);

  return (
    <SettingSection>
      <SettingItemRaw
        category="category"
        showBorder={false}
        onPress={() => navigation.navigate('setting-user')}
        before={<Avatar />}>
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
