import {StyleSheet, Text, View} from 'react-native';
import type {AudioInfo, Message} from '.';
import {getAuth} from 'firebase/auth';
import dayjs from 'dayjs';
import {MaterialIcons} from '@expo/vector-icons';

type TextContentProps = {
  text: string;
  isUser: boolean;
};

type AudioContentProps = {
  audio: AudioInfo;
  isUser: boolean;
};

const TextContent: React.FC<TextContentProps> = ({text, isUser}) => {
  return <Text style={{color: isUser ? 'black' : 'white'}}>{text}</Text>;
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

// Custom message bubble component
const MessageBubble = ({message}: {message: Message}) => {
  const auth = getAuth().currentUser!;
  const isUser = message.sender_id === auth.uid;

  const displayContent = () => {
    if (message.type === 'text') {
      return (
        //! fix me
        <TextContent text={message.content || message.text} isUser={isUser} />
      );
    } else if (message.type === 'audio') {
      return <AudioContent audio={message.content} isUser={isUser} />;
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
          paddingHorizontal: 10,
          paddingVertical: 5,
          backgroundColor: isUser ? '#B2DFFC' : '#007AFF',
          borderColor: isUser ? '#B2DFFC' : '#007AFF',
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
  },
});

export default MessageBubble;
