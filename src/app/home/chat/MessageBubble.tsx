import {
  ActivityIndicator,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {AudioInfo, Message} from '.';
import {getAuth} from 'firebase/auth';
import dayjs from 'dayjs';
import {MaterialIcons} from '@expo/vector-icons';
import {Image} from 'react-native';
import {useEffect, useState} from 'react';
import {downloadFileAsync} from '@/util/firebase';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {set} from 'firebase/database';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native';

type TextContentProps = {
  text: string;
  isUser: boolean;
};

type AudioContentProps = {
  audio: AudioInfo;
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
  return (
    <View style={styles.audioContentContainer}>
      <Text
        style={{
          color: isUser ? 'black' : 'white',
          minWidth: 45,
          textAlign: 'right',
        }}>
        {dayjs(audio!.duration).format('m:ss')}
      </Text>
      <MaterialIcons name="multitrack-audio" size={20} color="black" />
    </View>
  );
};

const ImageContent: React.FC<ImageContentProps> = ({image, isUser}) => {
  const [uri, setUri] = useState('');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [ratio, setRatio] = useState(0);
  const [status, setStatus] = useState('loading');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Download the image file asynchronously
    downloadFileAsync(image).then(uri => {
      // Get the size of the downloaded image
      Image.getSize(
        uri,
        (width, height) => {
          // Set the URI, status, and aspect ratio of the image
          setUri(uri);
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
                src={uri}
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
                  <Image src={uri} style={{flex: 1}} resizeMode="contain" />
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
