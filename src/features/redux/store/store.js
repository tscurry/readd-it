import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import subredditSlice from "../reducers/redditSlice";
import searchSlice from "../reducers/searchSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  subreddits: subredditSlice.reducer,
  search: searchSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);