import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { defaultSlice, searchSlice, popularSlice, subredditSlice } from "../reducers/index";

const rootReducer = combineReducers({
  search: searchSlice.reducer,
  default: defaultSlice.reducer,
  popular: popularSlice.reducer,
  subreddits: subredditSlice.reducer,
});

const persistConfig = {
  key: "persist-key",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PURGE, REGISTER, REHYDRATE, PERSIST],
        immutableStateInvariant: []
      },
    }),
});

export const persistor = persistStore(store);
