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
import {useHeaderHeight} from '@react-navigation/elements';
import {Timestamp} from 'firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/themes';
import SendButton from './SendButton';
import AudioBar from './AudioBar';
import MessageList from './MessageList';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

// Interface for the message object
export type Message = {
  content: string;
  sender_id: string;
  timestamp: Timestamp;
  type: 'text' | 'audio' | 'image';
};

type Chat = {
  num_raw: number;
  is_processing: boolean;
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

  const [inputType, setInputType] = useState<'text' | 'audio' | 'image'>(
    'text',
  );

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
      content: inputText,
      sender_id: uid,
      timestamp: Timestamp.now(),
      type: 'text',
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

  // State to hold path of the audio recording
  const [audio, setAudio] = useState<string | null>();
  // State to indicate if the audio recording should be cancelled
  const [cancel, setCancel] = useState<boolean>(false);

  // Shared value for the offset of the pan gesture
  const offset = useSharedValue<number>(0);

  // Shared value for the pressing state of the long press gesture
  const isPressing = useSharedValue(0);

  // SideEffect that sends the audio to the server when the audio state changes
  useEffect(() => {
    if (audio && !cancel) {
      console.log('sending audio', audio);
    }
    setCancel(false);
  }, [audio]);

  // Gesture detections including pan and long press for audio input
  const pan = Gesture.Pan()
    .onChange(event => {
      if (event.translationX > 0) {
        return;
      }
      if (event.translationX < -150) {
        console.log('cancel');
        runOnJS(setCancel)(true);
        runOnJS(setInputType)('text');
        return;
      }
      offset.value = event.translationX;
    })
    .onFinalize(event => {
      offset.value = withSpring(0);
    });

  const longPress = Gesture.LongPress()
    .minDuration(200)
    .shouldCancelWhenOutside(false)
    .maxDistance(3000)
    .onBegin(() => {
      isPressing.value = 0.5;
    })
    .onStart(() => {
      runOnJS(setInputType)('audio');
    })
    .onEnd(() => {
      runOnJS(setInputType)('text');
    })
    .onFinalize(() => {
      isPressing.value = 1;
    });

  // The composed gesture that is used for the audio input
  const compose = Gesture.Simultaneous(longPress, pan);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.foreground}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <MessageList messages={messages} showHeader={isProcessing} />

        <View style={styles.inputContainer}>
          {inputType === 'audio' ? (
            <AudioBar animatedStyles={animatedStyles} audioSetter={setAudio} />
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                }}>
                <AntDesign name="plus" size={20} color="rgba(0,0,0, 0.8)" />
              </View>
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
                  onPress={sendMessage}
                  disabled={inputText.length == 0}
                />
              </View>
            </>
          )}
          {/* Audio input */}
          <GestureDetector gesture={compose}>
            <Animated.View
              style={{
                flex: 1,
                opacity: isPressing,
              }}>
              <FontAwesome5
                name="microphone"
                size={20}
                color="rgba(0,0,0, 0.4)"
              />
            </Animated.View>
          </GestureDetector>
          {/* <AudioButton /> */}
        </View>
      </KeyboardAvoidingView>
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
    gap: 10,
    height: 50,
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 10,
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
