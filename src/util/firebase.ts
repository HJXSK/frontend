import {Chat, Message} from '@/app/home/chat';
import {FIRESTORE} from '@/firebase/firebaseConfig';
import {collection, doc, increment, runTransaction} from 'firebase/firestore';

async function sendMessage(uid: string, newMessage: Message) {
  try {
    await runTransaction(FIRESTORE, async transaction => {
      // Get the chat document reference
      const chatRef = doc(collection(FIRESTORE, 'chats'), uid);
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
}

export {sendMessage};
