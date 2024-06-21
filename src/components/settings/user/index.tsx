import {View, Text, StyleSheet} from 'react-native';
import Avatar from './avatar';
import {router} from 'expo-router';
import {useSelector} from 'react-redux';
import {selectUserProfile} from '@/redux/features/user/userProfileSlice';
import {SettingItemRaw, SettingSection} from '../item';

const User: React.FC = () => {
  const userProfile = useSelector(selectUserProfile);
  return (
    <SettingSection>
      <SettingItemRaw
        category="category"
        showBorder={false}
        onPress={() => router.push('/home/(tabs)/settings/user')}
        before={<Avatar />}>
        <View style={styles.content}>
          <Text style={styles.name}>{userProfile.gs_user_name}</Text>
          <Text style={[styles.bio]}>{userProfile.gs_user_bio}</Text>
        </View>
      </SettingItemRaw>
    </SettingSection>
  );
};

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
