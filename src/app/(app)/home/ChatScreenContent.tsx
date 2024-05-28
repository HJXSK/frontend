import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {FIRESTORE, FUNCTIONS} from '@/firebase/firebaseConfig';
import {httpsCallable} from 'firebase/functions';
import {collection, doc, increment, runTransaction} from 'firebase/firestore';
import {useAuth} from '@/contexts/authContext';

// Interface for the message object
type Message = {
  text: string;
  sender_id: string;
  timestamp: Date;
  // isUser: boolean;
};

type Chat = {
  num_raw: number;
  is_processing: boolean;
};


import {getAuth} from 'firebase/auth';
import {collection, doc, getDoc, getDocs, where, query} from 'firebase/firestore'; 

function ChatScreenContent(): React.JSX.Element {
  // Get the auth context
  const [auth] = useAuth();

  //
  const requestLLM = httpsCallable(FUNCTIONS, 'requestLLM');

  // State to hold the chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State to hold the user input text
  const [inputText, setInputText] = useState('');

  // State to hold the typing status
  const [isTyping, setIsTyping] = useState(false);
  // State to hold the number of unprocessed messages
  const [buffer, setBuffer] = useState(0);

  const flatListRef = useRef(null);
  // A reference to the timeout for trigger LLM.
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // clears timeout when component unmounts
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current!);
  }, []);

  // Run this effect whenever use stops typing or a message is sent.
  useEffect(() => {
    // Check if the user is not typing and there is a buffer
    if (!isTyping && buffer > 0) {
      requestLLM()
        .then(result => {
          console.log(result.data);
        })
        .catch(e => {
          console.log(e);
        });
      setBuffer(0);
    }
  }, [isTyping, buffer]);


  // Function to fetch chat history
  useEffect(() => {
    // Fetch the current user details
    const fetchCurrentUser = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        const uid = user.uid;

        console.log(`User email is ${email}, uid is ${uid}`);
        fetchUserChats(uid);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchUserChats = async (uid) => {
    try {
      const chatRef = doc(collection(FIRESTORE, "chats"), uid);
      const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
          console.log("Document data:", chatDoc.data());
          const msgRef = query(collection(FIRESTORE, "chats", uid, "messages"), where("sender_id", "==", uid));
          const querySnapshot = await getDocs(msgRef);
          querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
          });
        } else {
          console.log("There is no chat history yet.");
        }
    } catch (error) {
      console.log(error); 
    }

    console.log(chats);
  };


  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  // Function to handle sending a message
  const sendMessage = async () => {
    const uid = auth!.uid;

    const newChat: Chat = {
      num_raw: 1,
      is_processing: false,
    };

    const newMessage: Message = {
      text: inputText,
      sender_id: uid,
      timestamp: new Date(),
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
    startTyping(5000);
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
  const MessageBubble = ({message, isUser}) => (
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
          backgroundColor: isUser ? '#B2DFFC' : '#007AFF',
          borderRadius: 20, // Set a higher value for a rounded container
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 1, // Add border width
          borderColor: isUser ? '#B2DFFC' : '#007AFF', // Set border color based on bubble background color
        }}>
        <Text style={{color: isUser ? 'black' : 'white'}}>{message}</Text>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <View style={{flex: 1, marginVertical: 10, backgroundColor: '#E4F2FD'}}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <MessageBubble message={item.text} isUser={item.isUser} />
          )}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 10,
            paddingBottom: 10,
          }} // Add top and bottom padding
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({animated: true})
          }
          onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
        />
      </View>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            padding: 10,
            marginRight: 10, // Add right margin to match the message bubble
          }}
          placeholder="Type your message"
          value={inputText}
          onChangeText={text => {
            setInputText(text);
            startTyping();
          }}
        />
        <TouchableOpacity
          style={{backgroundColor: '#007AFF', borderRadius: 5, padding: 10}}
          onPress={sendMessage}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChatScreenContent;
