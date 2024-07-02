import {useTheme} from '@/themes';
import {FlatList, Text, View} from 'react-native';
import MessageBubble from './MessageBubble';
import {getAuth} from 'firebase/auth';
import {useRef} from 'react';
import TypingBubble from '@/components/container/typingBubble';
import dayjs from 'dayjs';
import {Message} from './';

type MessageListProps = {
  messages: Message[];
  showHeader: boolean;
};

const MessageList: React.FC<MessageListProps> = ({messages, showHeader}) => {
  const auth = getAuth().currentUser;
  const flatListRef = useRef<FlatList>(null);

  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
      }}>
      <FlatList
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        keyboardDismissMode="on-drag"
        // to correct the scroll position
        scrollIndicatorInsets={{
          top: -25,
          left: 0,
          bottom: 40,
          right: 0,
        }}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        // important for the FlatList to start from the bottom to achieve scroll to latest
        inverted
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          const thisTimestamp = dayjs.unix(item.timestamp.seconds);
          // display the timestamp if the message is the first in the list or if the previous message was sent more than 2 minutes ago
          return (
            <>
              <MessageBubble
                message={item.content || item.text} //! fix me
                isUser={item.sender_id == auth!.uid}
              />
              {(index == messages.length - 1 ||
                thisTimestamp.diff(
                  dayjs.unix(messages[index + 1].timestamp.seconds),
                  'minute',
                ) > 2) && (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 10,
                    color: 'gray',
                    margin: 10,
                    marginTop: index == messages.length - 1 ? 50 : 10,
                  }}>
                  {thisTimestamp.format('MMM D, YYYY [at] h:mm A')}
                </Text>
              )}
            </>
          );
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 10,
        }} // Add top and bottom padding
        onContentSizeChange={() =>
          flatListRef.current!.scrollToOffset({offset: 0, animated: true})
        }
        onLayout={() =>
          flatListRef.current!.scrollToOffset({offset: 0, animated: true})
        }
        ListHeaderComponent={showHeader ? <TypingBubble /> : null}
      />
    </View>
  );
};

export default MessageList;
