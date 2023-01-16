import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const popularData = createAsyncThunk("popular", async () => {
  const data = await fetch("https://www.reddit.com/r/popular.json?limit=100");
  const json = await data.json();
  return json;
});

const popularSlice = createSlice({
  name: "popular",
  initialState: {
    isLoading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(popularData.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(popularData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload;
    });
    builder.addCase(popularData.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default popularSlice;
