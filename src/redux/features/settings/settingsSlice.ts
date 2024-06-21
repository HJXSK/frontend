import {createSlice} from '@reduxjs/toolkit';

export type settingState = {
  gs_settings_profanity_filter: boolean;
};

const initialState: settingState = {
  gs_settings_profanity_filter: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    toggle_ProfanityFilter: state => {
      state.gs_settings_profanity_filter = !state.gs_settings_profanity_filter;
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggle_ProfanityFilter} = settingsSlice.actions;
export const selectSettings = (state: {settings: settingState}) =>
  state.settings;
export default settingsSlice.reducer;
