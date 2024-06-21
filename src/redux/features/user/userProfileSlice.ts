import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '@/redux/store';

type userProfile = {
  gs_user_name: string | undefined;
  gs_user_email: string | undefined;
  gs_user_bio: string | undefined;
};

const initialState: userProfile = {
  gs_user_name: undefined,
  gs_user_email: undefined,
  gs_user_bio: undefined,
};

export const userProfileSlice = createSlice({
  name: 'user_profile',
  initialState: initialState,
  reducers: {
    update_profile: (state, actions) => {
      state.gs_user_bio = actions.payload.bio;
      state.gs_user_name = actions.payload.name;
      state.gs_user_email = actions.payload.email;
    },
  },
});

// Action creators are generated for each case reducer function
export const {update_profile} = userProfileSlice.actions;
export const selectUserProfile = (state: RootState) => state.user_profile;

export default userProfileSlice.reducer;
