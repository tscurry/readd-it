import { configureStore } from "@reduxjs/toolkit";
import allSubredditSlice from "../reducers/redditSlice";

export const store = configureStore({
  reducer: {
    subreddits: allSubredditSlice.reducer,
  },
});
