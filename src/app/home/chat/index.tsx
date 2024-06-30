import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {FIRESTORE, FUNCTIONS} from '@/firebase/firebaseConfig';
import {httpsCallable} from 'firebase/functions';
import {
  collection,
  doc,
  increment,
  runTransaction,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import TypingBubble from '@/components/container/typingBubble';
import {useHeaderHeight} from '@react-navigation/elements';
import dayjs from 'dayjs';
import {Timestamp} from 'firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';

// Interface for the message object
type Message = {
  text: string;
  sender_id: string;
  timestamp: Timestamp;
  // isUser: boolean;
};

type Chat = {
  num_raw: number;
  is_processing: boolean;
};

function ChatPage(): React.JSX.Element {
  // Get the auth context
  const auth = getAuth().currentUser;

  //
  const requestLLM = httpsCallable(FUNCTIONS, 'requestLLM');

  // The profanity filter setting
  const gs_settings_profanity_filter = useSelector(
    (state: RootState) => state.settings.gs_settings_profanity_filter,
  );

  // State to hold the chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State to hold the user input text
  const [inputText, setInputText] = useState('');

  // State to hold the typing status
  const [isTyping, setIsTyping] = useState(false);
  // State to hold the number of unprocessed messages
  const [buffer, setBuffer] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);

  // Get the header height to add padding to the FlatList
  const headerHeight = useHeaderHeight();

  const flatListRef = useRef<FlatList>(null);
  // A reference to the timeout for trigger LLM.
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // clears timeout when component unmounts
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current!);
  }, []);

  // Set up a listener for new messages when the component mounts
  useEffect(() => {
    // Get the user ID from the auth context
    const uid = auth!.uid;
    // Define a function to unsubscribe from the messages snapshot listener
    let unSubMessages = () => {};
    let unSubChat = () => {};
    try {
      // Create a reference to the messages collection for the current user
      const chatRef = doc(FIRESTORE, 'chats', uid);
      unSubChat = onSnapshot(chatRef, snapshot => {
        setIsProcessing(snapshot.data()?.is_processing);
      });

      const messagesRef = collection(FIRESTORE, 'chats', uid, 'messages');
      // Create a query to order the messages by timestamp in ascending order
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));
      // Subscribe to the messages snapshot and update the messages state
      unSubMessages = onSnapshot(messagesQuery, snapshot => {
        let temp: Message[] = [];
        snapshot.forEach(doc => {
          temp.push({...doc.data()} as Message);
        });
        setMessages(temp);
      });
    } catch (error) {
      console.log(error);
    }
    // Return the unsubscribe function to clean up the listener when the component unmounts
    return () => {
      unSubMessages();
      unSubChat();
    };
  }, []);

  // Run this effect whenever use stops typing or a message is sent.
  useEffect(() => {
    // Check if the user is not typing and there is a buffer
    if (!isTyping && buffer > 0) {
      requestLLM({profanity_filter: gs_settings_profanity_filter})
        .then(result => {
          console.log(result.data);
        })
        .catch(e => {
          console.log(e);
        });
      setBuffer(0);
    }
  }, [isTyping, buffer]);

  // Function to handle sending a message
  const sendMessage = async () => {
    if (inputText === '') {
      return;
    }
    const uid = auth!.uid;

    const newChat: Chat = {
      num_raw: 1,
      is_processing: false,
    };

    const newMessage: Message = {
      text: inputText,
      sender_id: uid,
      timestamp: Timestamp.now(),
    };

    try {
      await runTransaction(FIRESTORE, async transaction => {
        // Get the chat document reference
        const chatRef = doc(collection(FIRESTORE, 'chats'), uid);
        // Get the chat document
        const chatDoc = await transaction.get(chatRef);
        if (!chatDoc.exists()) {
          transaction.set(chatRef, newChat);
        } else {
          transaction.update(chatRef, {num_raw: increment(1)});
        }
        // Add the new message to the messages collection
        const newMessageRef = doc(collection(chatRef, 'messages'));
        transaction.set(newMessageRef, newMessage);
      });
      setInputText('');
    } catch (e) {
      console.log(e);
      return false;
    }

    console.log('Message sent');
    // prolong the typing status assuming the user may
    // continue typing in 5secs after sending
    // !WARNING: order matters. startTyping must be called before setBuffer
    startTyping(2500);
    setBuffer(previous => previous + 1);
  };

  /**
   * Starts the typing recording and sets the isTyping state to true.
   * Automatically sets isTyping to false after the specified delay.
   *
   * @param delay - The delay in milliseconds before setting isTyping to false. Default value is 3000.
   */
  const startTyping = (delay: number = 3000) => {
    setIsTyping(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log('isTyping set to false');
      setIsTyping(false);
    }, delay);
  };

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
          ...styles.BubbleMessage,
          backgroundColor: isUser ? '#B2DFFC' : '#007AFF',
          borderColor: isUser ? '#B2DFFC' : '#007AFF',
        }}>
        <Text style={{color: isUser ? 'black' : 'white'}}>{message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            style={{
              flex: 1,
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
                    message={item.text}
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
            ListHeaderComponent={isProcessing ? <TypingBubble /> : null}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          <TextInput
            multiline
            style={styles.inputField}
            value={inputText}
            onChangeText={text => {
              setInputText(text);
              startTyping();
            }}
            onSubmitEditing={sendMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputField: {
    flex: 1,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  BubbleMessage: {
    borderRadius: 20, // Set a higher value for a rounded container
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ChatPage;
