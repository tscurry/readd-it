import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const subredditData = createAsyncThunk('subreddits', async () => {
  const data = await fetch ('https://www.reddit.com/subreddits.json?limit=100');
  const json = await data.json();
  return json;
})

const subredditSlice = createSlice({
  name: "subreddits",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(subredditData.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(subredditData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    });
    builder.addCase(subredditData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default subredditSlice;
