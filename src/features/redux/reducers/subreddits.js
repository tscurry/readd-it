import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubreddit = createAsyncThunk("subreddits", async subreddit => {
  const data = await fetch(`https://www.reddit.com/${subreddit}.json?limit=100`);
  const json = await data.json();
  return json;
});

const subredditSlice = createSlice({
  name: "subreddits",
  initialState: {
    isLoading: false,
    isClicked: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSubreddit.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchSubreddit.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isClicked = true;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(fetchSubreddit.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default subredditSlice;
