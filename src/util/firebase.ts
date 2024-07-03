import {Message, MessageType} from '@/app/home/chat';
import {FIRESTORE} from '@/firebase/firebaseConfig';
import {getAuth} from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  increment,
  runTransaction,
} from 'firebase/firestore';

export type Chat = {
  num_raw: number;
  is_processing: boolean;
};

async function sendMessage(type: MessageType, content: any) {
  const auth = getAuth().currentUser;
  const newMessage: Message = {
    content: content,
    sender_id: auth!.uid,
    timestamp: Timestamp.now(),
    type: type,
  };

  try {
    await runTransaction(FIRESTORE, async transaction => {
      // Get the chat document reference
      const chatRef = doc(collection(FIRESTORE, 'chats'), auth!.uid);
      // Get the chat document
      const chatDoc = await transaction.get(chatRef);
      if (!chatDoc.exists()) {
        const newChat: Chat = {
          num_raw: 1,
          is_processing: false,
        };
        transaction.set(chatRef, newChat);
      } else {
        transaction.update(chatRef, {num_raw: increment(1)});
      }
      // Add the new message to the messages collection
      const newMessageRef = doc(collection(chatRef, 'messages'));
      transaction.set(newMessageRef, newMessage);
    });
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}

export {sendMessage};
