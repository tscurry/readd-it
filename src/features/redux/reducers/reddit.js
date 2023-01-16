import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubreddit = createAsyncThunk("subreddits", async subreddit => {
  const data = await fetch(`https://www.reddit.com/${subreddit}`);
  const json = await data.json();
  return json;
});

export const popularData = createAsyncThunk("popular", async () => {
  const data = await fetch("https://www.reddit.com/r/popular.json");
  const json = await data.json();
  return json;
});

export const searchData = createAsyncThunk("search", async query => {
  const data = await fetch(`https://www.reddit.com/search.json?q=${query}`);
  const json = await data.json();
  return json;
});

const redditSlice = createSlice({
  name: "reddit",
  initialState: {
    popular: {
      isLoading: false,
      error: null,
      data: [],
    },
    search: {
      isLoading: false,
      error: null,
      data: [],
    },
    subreddit: {
      isLoading: false,
      error: null,
      data: [],
    },
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSubreddit.pending, state => {
      state.subreddit.isLoading = true;
    });
    builder.addCase(fetchSubreddit.fulfilled, (state, action) => {
      state.subreddit.data = action.payload;
      state.subreddit.isLoading = false;
    });
    builder.addCase(fetchSubreddit.rejected, (state, action) => {
      state.subreddit.error = action.payload;
    });
    builder.addCase(searchData.pending, state => {
      state.search.isLoading = true;
    });
    builder.addCase(searchData.fulfilled, (state, action) => {
      state.search.data = action.payload;
      state.search.isLoading = false;
    });
    builder.addCase(searchData.rejected, (state, action) => {
      state.search.error = action.payload;
    });
    builder.addCase(popularData.pending, state => {
      state.popular.isLoading = true;
    });
    builder.addCase(popularData.fulfilled, (state, action) => {
      state.popular.isLoading = false;
      state.popular.data = action.payload;
    });
    builder.addCase(popularData.rejected, (state, action) => {
      state.popular.error = action.payload;
    });
  },
});

export default redditSlice;
