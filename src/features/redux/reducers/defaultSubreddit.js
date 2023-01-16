import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchDefaultSubreddits = createAsyncThunk("default", async () => {
  const data = await fetch(`https://www.reddit.com/subreddits.json?limit=100`);
  const json = await data.json();
  return json;
});

const defaultSlice = createSlice({
  name: "subreddits",
  initialState: {
    isLoading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDefaultSubreddits.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchDefaultSubreddits.fulfilled, (state, action) => {
      state.data = action.payload;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(fetchDefaultSubreddits.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default defaultSlice;
