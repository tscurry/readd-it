import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const popularData = createAsyncThunk("popular", async (after, { rejectWithValue }) => {
  try {
    const data = await fetch(`https://www.reddit.com/r/popular.json?limit=100`);
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

const popularSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(popularData.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(popularData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error ? action.payload.message : null;
      state.after = action.payload.data.after;
      state.data = action.payload;
    });
  },
});

export default popularSlice;
