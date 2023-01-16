import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { defaultSlice, searchSlice, popularSlice, subredditSlice } from "../reducers/index";

const rootReducer = combineReducers({
  search: searchSlice.reducer,
  default: defaultSlice.reducer,
  popular: popularSlice.reducer,
  subreddits: subredditSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["defaultSlice", "searchSlice", "popularSlice", "subredditSlice"],
  version: 2,
  purge: ['defaultSlice', 'popularSlice', 'subredditSlice']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
