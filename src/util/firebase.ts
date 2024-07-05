import {Message, MessageType} from '@/app/home/chat';
import {FIRESTORE, STORAGE} from '@/firebase/firebaseConfig';
import {getAuth} from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  increment,
  runTransaction,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getMetadata,
  ref,
  updateMetadata,
  uploadBytesResumable,
} from 'firebase/storage';

export type Chat = {
  num_raw: number;
  is_processing: boolean;
};

async function sendMessage(content: any, type: MessageType) {
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

/**
 * Uploads a file asynchronously to Firebase storage.
 * @param type - The type of the file (e.g., image, video, etc.).
 * @param uri - The URI of the file to be uploaded.
 * @returns The full path of the uploaded file in Firebase storage.
 */
async function uploadFileAsync(uri: string, type: string, metadata?: any) {
  const auth = getAuth().currentUser;

  // Fetch the file as a blob
  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  // Create a reference to the file in Firebase storage
  const fileRef = ref(STORAGE, `${auth?.uid}/${type}s/${blob._data.name}`);
  // Upload the file to Firebase storage
  const result = await uploadBytesResumable(fileRef, blob);
  // We're done with the blob, close and release it
  blob.close();
  if (metadata) {
    console.log(metadata);
    await updateMetadata(fileRef, {customMetadata: metadata}).catch(e => {
      console.log(e);
    });
  }

  return result.metadata.fullPath;
}

async function downloadFileAsync(uri: string, metadata?: boolean) {
  const fileRef = ref(STORAGE, uri);
  const url = await getDownloadURL(fileRef);
  if (metadata) {
    const fileMetadata = await getMetadata(fileRef);
    return {url, metadata: fileMetadata};
  }
  return {url};
}

export {sendMessage, uploadFileAsync, downloadFileAsync};
