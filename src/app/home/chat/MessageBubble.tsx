import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {Message} from '.';
import {getAuth} from 'firebase/auth';
import dayjs from 'dayjs';
import {MaterialIcons} from '@expo/vector-icons';
import {Image} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {downloadFileAsync} from '@/util/firebase';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native';
import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';

type TextContentProps = {
  text: string;
  isUser: boolean;
};

type AudioContentProps = {
  audio: string;
  isUser: boolean;
};

type ImageContentProps = {
  image: string;
  isUser: boolean;
};

const TextContent: React.FC<TextContentProps> = ({text, isUser}) => {
  return (
    <Text style={{color: isUser ? 'black' : 'white', margin: 10}}>{text}</Text>
  );
};

const AudioContent: React.FC<AudioContentProps> = ({audio, isUser}) => {
  // State to store the duration of the audio, only be set when the audio is loaded
  const [duration, setDuration] = useState<number | undefined>();
  // State to store the audio sound object, only be set when the audio is loaded
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  // Reference to the status of the audio playback
  const statusRef = useRef<AVPlaybackStatusSuccess | null>();

  // Function to update the status of the audio playback
  const updateStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // Update your UI for the unloaded state
      if (status.error) {
        console.log(
          `Encountered a fatal error during playback: ${status.error}`,
        );
      }
    } else {
      statusRef.current = status as AVPlaybackStatusSuccess;
    }
  };

  useEffect(() => {
    // Download the audio file asynchronously
    downloadFileAsync(audio)
      .then(async ({url}) => {
        // Create a sound object with the downloaded audio file
        const {sound, status} = await Audio.Sound.createAsync(
          {uri: url},
          undefined,
          updateStatus,
        );
        setSound(sound);
        setDuration((status as AVPlaybackStatusSuccess).durationMillis);
      })
      .catch(e => {
        console.error(e);
      });
    return () => {
      // Unload the sound when the component is unmounted
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (!sound) {
      return;
    }
    if (statusRef.current!.isPlaying) {
      await sound.stopAsync();
    } else {
      await sound.playFromPositionAsync(0);
    }
  };

  return (
    <TouchableOpacity style={styles.audioContentContainer} onPress={playSound}>
      <>
        <Text
          style={{
            color: isUser ? 'black' : 'white',
            minWidth: 45,
            textAlign: 'right',
          }}>
          {dayjs(duration).format('m:ss')}
        </Text>
        <MaterialIcons name="multitrack-audio" size={20} color="black" />
      </>
    </TouchableOpacity>
  );
};

const ImageContent: React.FC<ImageContentProps> = ({image, isUser}) => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [ratio, setRatio] = useState(0);
  const [status, setStatus] = useState('loading');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Download the image file asynchronously
    downloadFileAsync(image).then(data => {
      const url = data.url;
      // Get the size of the downloaded image
      Image.getSize(
        url,
        (width, height) => {
          // Set the URI, status, and aspect ratio of the image
          setUrl(url);
          setStatus('loaded');
          setRatio(width / height);
          // Adjust the width or height based on the aspect ratio
          if (width > height) {
            setWidth(Math.min(width, 250));
          } else {
            setHeight(Math.min(height, 250));
          }
        },
        error => {
          // Set the status to error if there is an error loading the image
          setStatus('error');
        },
      );
    });
  }, [image]);

  const display = () => {
    switch (status) {
      case 'loading':
        return <ActivityIndicator size="small" color={'black'} />;
      case 'error':
        return (
          <MaterialCommunityIcons
            name="image-broken"
            style={{margin: 5}}
            size={24}
            color="black"
          />
        );
      default:
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                setOpen(true);
              }}>
              <Image
                src={url}
                style={{
                  flex: 1,
                  width: width,
                  height: height,
                  aspectRatio: ratio,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Modal animationType="fade" visible={open}>
              <SafeAreaView style={{flex: 1}}>
                <Pressable
                  style={{flex: 1}}
                  onPress={() => {
                    setOpen(false);
                  }}>
                  <Image src={url} style={{flex: 1}} resizeMode="contain" />
                </Pressable>
              </SafeAreaView>
            </Modal>
          </>
        );
    }
  };

  return (
    <View
      style={{borderRadius: 10, margin: status == 'loading' ? 10 : 0, flex: 1}}>
      {display()}
    </View>
  );
};

// Custom message bubble component
const MessageBubble = ({message}: {message: Message}) => {
  const auth = getAuth().currentUser!;
  const isUser = message.sender_id === auth.uid;

  // Display the content based on the message type
  const displayContent = () => {
    if (message.type === 'text') {
      return <TextContent text={message.content} isUser={isUser} />;
    } else if (message.type === 'audio') {
      return <AudioContent audio={message.content} isUser={isUser} />;
    } else if (message.type === 'image') {
      return <ImageContent image={message.content} isUser={isUser} />;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 10,
        marginRight: isUser ? 10 : 50, // Add right margin for user message bubble, increase value to create space
        marginLeft: isUser ? 50 : 10, // Add left margin for other message bubbles, increase value to create space
      }}>
      <View
        style={{
          borderRadius: 20, // Set a higher value for a rounded container
          overflow: 'hidden',
          backgroundColor: isUser ? '#B2DFFC' : '#007AFF',
        }}>
        {displayContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    margin: 5,
  },
});

export default MessageBubble;
