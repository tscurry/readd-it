import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const searchData = createAsyncThunk("search", async query => {
  const data = await fetch(`https://www.reddit.com/search.json?q=${query}`);
  const json = await data.json();
  return json;
});

const searchSlice = createSlice({
  name: "search",
  initialState: {
    isLoading: false,
    isSearched: false,
    error: null,
    data: [],
  },
  reducers: {
    setSearched: (state, action) => {
      state.isSearched = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(searchData.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(searchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isSearched = false;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(searchData.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default searchSlice;
