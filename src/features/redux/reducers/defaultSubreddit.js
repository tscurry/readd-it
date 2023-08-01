import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchDefaultSubreddits = createAsyncThunk("default", async (_, { rejectWithValue }) => {
  try {
    const data = await fetch("https://www.reddit.com/subreddits.json?limit=100");
    const json = await data.json();
    return json;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState = {
  isLoading: false,
  error: null,
  data: {},
};

const defaultSlice = createSlice({
  name: "subreddits",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchDefaultSubreddits.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDefaultSubreddits.fulfilled, (state, action) => {
      state.data = action.payload;
      state.error = action.payload.error ? action.payload.message : null;
      state.isLoading = false;
    });
    builder.addCase(fetchDefaultSubreddits.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default defaultSlice;
