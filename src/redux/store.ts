import {configureStore} from '@reduxjs/toolkit';
import settingsReducer from './features/settings/settingsSlice';
import {userProfileSlice} from './features/user/userProfileSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    user_profile: userProfileSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
