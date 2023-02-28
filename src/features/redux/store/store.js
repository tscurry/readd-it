import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { defaultSlice, searchSlice, popularSlice, subredditSlice } from "../reducers/index";

const rootReducer = combineReducers({
  search: searchSlice.reducer,
  default: defaultSlice.reducer,
  popular: popularSlice.reducer,
  subreddits: subredditSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
