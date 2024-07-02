import {Text, View} from 'react-native';

// Custom message bubble component
const MessageBubble = ({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) => (
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
      <Text style={{color: isUser ? 'black' : 'white'}}>{message}</Text>
    </View>
  </View>
);

export default MessageBubble;
