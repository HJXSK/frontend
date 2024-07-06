import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '@/redux/store';
import {doc, updateDoc} from 'firebase/firestore';
import {FIRESTORE} from '@/firebase/firebaseConfig';
import {getAuth} from 'firebase/auth';

export type userProfile = {
  gs_user_name: string | null;
  gs_user_email: string | null;
  gs_user_bio: string | null;
  gs_user_avatar: string | null;
  [key: string]: string | null;
};

const initialState: userProfile = {
  gs_user_name: null,
  gs_user_email: null,
  gs_user_bio: null,
  gs_user_avatar: null,
};

export const userProfileSlice = createSlice({
  name: 'user_profile',
  initialState: initialState,
  reducers: {
    update_profile: (state, actions) => {
      // call init_profile to update the user profile
      // look actions.payload for the user profile
      Object.keys(actions.payload).forEach(key => {
        state[key] = actions.payload[key];
      });
      const auth = getAuth().currentUser!;
      const userRef = doc(FIRESTORE, 'users', auth.uid);
      updateDoc(userRef, actions.payload).catch(err => {
        console.error('Error updating document: ', err);
      });
    },
    init_profile: (state, actions) => {
      console.log('init_profile', actions.payload);
      for (const key in actions.payload) {
        state[key] = actions.payload[key];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {update_profile, init_profile} = userProfileSlice.actions;
export const selectUserProfile = (state: RootState) => state.user_profile;

export default userProfileSlice.reducer;
