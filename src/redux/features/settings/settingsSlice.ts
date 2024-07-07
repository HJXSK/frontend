import {FIRESTORE} from '@/firebase/firebaseConfig';
import {createSelector, createSlice} from '@reduxjs/toolkit';
import {getAuth} from 'firebase/auth';
import {doc, updateDoc} from 'firebase/firestore';

export type settingState = {
  gs_settings_profanity_filter: boolean;
  gs_settings_bot_avatar: string | null;
  gs_settings_bot_name: string;
  [key: string]: any;
};

export const initialState: settingState = {
  gs_settings_profanity_filter: false,
  gs_settings_bot_avatar: null,
  gs_settings_bot_name: 'Baymax',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    toggle_ProfanityFilter: state => {
      state.gs_settings_profanity_filter = !state.gs_settings_profanity_filter;
      const auth = getAuth().currentUser!;
      const userRef = doc(FIRESTORE, 'users', auth.uid);
      console.log(
        'Updating profanity filter: ',
        state.gs_settings_profanity_filter,
      );
      updateDoc(userRef, {
        'settings.gs_settings_profanity_filter':
          state.gs_settings_profanity_filter,
      }).catch(err => {
        console.error('Error updating document: ', err);
      });
    },
    update_chatbot_settings: (state, action) => {
      let payload = {} as {[key: string]: any};
      Object.keys(action.payload).map(attribute => {
        state[attribute] = action.payload[attribute];
        payload[`settings.${attribute}`] = action.payload[attribute];
      });
      const auth = getAuth().currentUser!;
      const userRef = doc(FIRESTORE, 'users', auth.uid);
      updateDoc(userRef, payload).catch(err => {
        console.error('Error updating document: ', err);
      });
    },
    init_settings: (state, action) => {
      Object.keys(action.payload).map(attribute => {
        state[attribute] = action.payload[attribute];
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggle_ProfanityFilter, init_settings, update_chatbot_settings} =
  settingsSlice.actions;
export const selectSettings = (state: {settings: settingState}) =>
  state.settings;

// use createSelector to memoize the selector
export const selectChatbotSettings = createSelector(
  [selectSettings],
  settings => {
    return {
      gs_settings_bot_name: settings.gs_settings_bot_name,
      gs_settings_bot_avatar: settings.gs_settings_bot_avatar,
    };
  },
);

export default settingsSlice.reducer;
