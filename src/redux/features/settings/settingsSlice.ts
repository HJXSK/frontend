import {createSlice} from '@reduxjs/toolkit';

export type settingState = {
  gs_settings_profanity_filter: boolean;
  gs_settings_bot_avatar: string | undefined;
  gs_settings_bot_name: string;
  [key: string]: any;
};

const initialState: settingState = {
  gs_settings_profanity_filter: false,
  gs_settings_bot_avatar: undefined,
  gs_settings_bot_name: 'Baymax',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    toggle_ProfanityFilter: state => {
      state.gs_settings_profanity_filter = !state.gs_settings_profanity_filter;
    },
    update_bot_avatar: (state, action) => {
      state.gs_settings_bot_avatar = action.payload;
    },
    init_settings: (state, action) => {
      Object.keys(action.payload).map(attribute => {
        const gs_attribute = 'gs_settings_' + attribute;
        if (gs_attribute in state) {
          state[gs_attribute] = action.payload[attribute];
        }
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggle_ProfanityFilter, init_settings} = settingsSlice.actions;
export const selectSettings = (state: {settings: settingState}) =>
  state.settings;
export default settingsSlice.reducer;
