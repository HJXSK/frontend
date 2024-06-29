import {StyleSheet, Text, View} from 'react-native';
import Avatar from '../settings/user/avatar';
import {selectSettings} from '@/redux/features/settings/settingsSlice';
import {useSelector} from 'react-redux';
import {STORAGE} from '@/firebase/firebaseConfig';
import {getDownloadURL, ref} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
import {useEffect, useState} from 'react';

const ChatTitle: React.FC = (): JSX.Element => {
  const settings = useSelector(selectSettings);
  const auth = getAuth().currentUser!;
  const avatarRef = ref(
    STORAGE,
    `${auth.uid}/images/${settings.gs_settings_bot_avatar}`,
  );
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (!settings.gs_settings_bot_avatar) {
      return;
    }
    getDownloadURL(avatarRef)
      .then(url => {
        setAvatar(url);
      })
      .catch(err => {
        console.error('ERROR', err);
      });
  }, [settings.gs_settings_bot_avatar]);

  return (
    <View style={[styles.headerContainer]}>
      <Avatar width={30} height={30} src={avatar} />
      <Text style={styles.name}>{settings.gs_settings_bot_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    gap: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ChatTitle;
