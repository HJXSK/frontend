import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {FIRESTORE, FUNCTIONS} from '@/firebase/firebaseConfig';
import {httpsCallable} from 'firebase/functions';
import {collection, doc, onSnapshot, orderBy, query} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {useHeaderHeight} from '@react-navigation/elements';
import {Timestamp} from 'firebase/firestore';
import {SafeAreaView} from 'react-native';
import {useTheme} from '@/themes';
import SendButton from './SendButton';
import MessageList from './MessageList';
import {AntDesign} from '@expo/vector-icons';
import {sendMessage} from '@/util/firebase';
import SlideUpPanel from '@/components/container/SlideUpPanel';
import Media from './Media';
import AudioBar from './AudioBar';
import Camera from './Camera';

export type MessageType = 'text' | 'audio' | 'image';

// Interface for the message object
export type Message = {
  content: any;
  sender_id: string;
  timestamp: Timestamp;
  type: MessageType;
};

function ChatPage(): React.JSX.Element {
  // Get the auth context
  const auth = getAuth().currentUser;
  const theme = useTheme();
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

  const [inputType, setInputType] = useState<MessageType>('text');

  // State to hold the typing status
  const [isTyping, setIsTyping] = useState(false);
  // State to hold the number of unprocessed messages
  const [buffer, setBuffer] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);

  // Get the header height to add padding to the FlatList
  const headerHeight = useHeaderHeight();

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
  const sendText = async () => {
    if (inputText === '') {
      return;
    }
    if (await sendMessage(inputText, 'text')) {
      setInputText('');
    } else {
      console.log('Failed to send message');
    }

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

  const [openMultiMedia, setOpenMultiMedia] = useState(false);

  const handleMultiMediaOpen = () => {
    setOpenMultiMedia(true);
    Keyboard.dismiss();
  };

  const handleMultiMediaClose = () => {
    setOpenMultiMedia(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.foreground}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <MessageList
          messages={messages}
          showHeader={isProcessing}
          // close the multiMedia panel when the user scrolls
          onTouchStart={handleMultiMediaClose}
        />
        <View style={styles.inputContainer}>
          {inputType === 'text' && (
            <>
              <TouchableOpacity
                style={styles.multiButton}
                onPress={() => {
                  handleMultiMediaOpen();
                }}>
                <AntDesign name="plus" size={20} color="rgba(0,0,0, 0.8)" />
              </TouchableOpacity>
              <View style={styles.textWrapper}>
                {/* TextInput */}
                <TextInput
                  multiline
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={text => {
                    setInputText(text);
                    startTyping();
                  }}
                />
                <SendButton
                  onPress={sendText}
                  disabled={inputText.length == 0}
                />
              </View>
            </>
          )}
          {/* Audio input */}
          <AudioBar inputTypeSetter={setInputType} />
        </View>
      </KeyboardAvoidingView>
      <SlideUpPanel open={openMultiMedia}>
        <Media />
        <Camera />
      </SlideUpPanel>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 0.2,
    borderColor: 'gray',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  multiButton: {
    position: 'absolute',
    left: 20,
    bottom: 15, // (minHeight - 20) / 2
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  audioButton: {
    position: 'absolute',
    right: 20,
    bottom: 15, // (minHeight - 20) / 2
  },
  textWrapper: {
    width: '80%',
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 0.2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 10,
    paddingTop: 0,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default ChatPage;
