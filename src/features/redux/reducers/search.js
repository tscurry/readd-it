import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const searchData = createAsyncThunk("search", async (query, { rejectWithValue }) => {
  try {
    const data = await fetch(`https://www.reddit.com/search.json?q=${query}&show=all`);
    const json = await data.json();
    return json;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error);
  }
});

const initialState = {
  isLoading: false,
  isSearched: false,
  searchedItem: "",
  error: null,
  data: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearched: (state, action) => {
      const { searched, query } = action.payload;
      state.isSearched = searched;
      state.searchedItem = query ? query : null;
    },
    resetState: () => initialState,
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
      state.isLoading = false;
    });
  },
});

export default searchSlice;
