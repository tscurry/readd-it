import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchRedditData = createAsyncThunk("subreddits", async () => {
  const fetchedData = await fetch("https://www.reddit.com/subreddits.json?limit=10");
  const json = await fetchedData.json();
  return json;
});

const allSubredditSlice = createSlice({
  name: "subreddits",
  initialState: {
    data: {},
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: {
    [fetchRedditData.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchRedditData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchRedditData.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  },
});

export default allSubredditSlice;
