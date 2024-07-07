import {useCallback, useState} from 'react';
import Avatar from '../settings/avatar';
import {useFocusEffect} from '@react-navigation/native';
import {downloadFileAsync} from '@/util/firebase';
import {useSelector} from 'react-redux';
import {selectSettings} from '@/redux/features/settings/settingsSlice';

export default function ChatBotAvatar({src}: {src?: string | null}) {
  const settings = useSelector(selectSettings);
  // Define state variable to store the image URL
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Use the useFocusEffect hook to execute the callback when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      // Check if the userProfile has a gs_user_avatar
      if (!src && settings.gs_settings_bot_avatar) {
        // Download the file asynchronously and set the image URL
        downloadFileAsync(settings.gs_settings_bot_avatar).then(({url}) =>
          setImageURL(url),
        );
      }
    }, [settings.gs_settings_bot_avatar, src]),
  );

  return (
    <Avatar
      width={30}
      height={30}
      src={src || imageURL}
      source={require('../../assets/default_bot_avatar.png')}
    />
  );
}
