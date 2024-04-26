import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';

function ChatScreenContent(): React.JSX.Element {
  const [messages, setMessages] = useState([]); // State to hold the chat messages
  const [inputText, setInputText] = useState(''); // State to hold the user input text
  const flatListRef = useRef(null);

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
