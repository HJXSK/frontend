import {configureStore} from '@reduxjs/toolkit';
import settingsReducer, {settingState} from './features/settings/settingsSlice';
import userProfileReducer from './features/user/userProfileSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    user_profile: userProfileReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
