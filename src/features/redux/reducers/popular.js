import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const popularData = createAsyncThunk("popular", async (_, { rejectWithValue }) => {
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
      state.data = action.payload;
    });
    builder.addCase(popularData.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default popularSlice;
