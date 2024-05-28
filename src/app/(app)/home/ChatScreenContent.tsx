import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, Switch} from 'react-native';

import {FIRESTORE} from '../../../firebase/firebaseConfig'
import {getAuth} from 'firebase/auth';
import {collection, doc, getDoc, getDocs, where, query} from 'firebase/firestore'; 

function ChatScreenContent(): React.JSX.Element {
  const [messages, setMessages] = useState([]); // State to hold the chat messages
  const [inputText, setInputText] = useState(''); // State to hold the user input text
  const flatListRef = useRef(null);

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
  
  // Profanity Filter Switch
  const [switchValue, setswitchValue] = useState(false);
  
  const toggleSwitch = (value) => {
    setswitchValue(value);
  }

  // Function to handle sending a message
  const sendMessage = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, {text: inputText, isUser: true}]);
      setInputText('');
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

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
          onChangeText={setInputText}
        />
        <View style = {{flex: 0.3,}}>
          <Text>
            {switchValue ? 'Filter ON' : 'Filter OFF'}
          </Text>

          <Switch
            onValueChange={toggleSwitch}
            value={switchValue}
          />
        </View>
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
