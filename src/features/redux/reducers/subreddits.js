import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubreddit = createAsyncThunk("subreddits", async (subreddit, { rejectWithValue }) => {
  try {
    const data = await fetch(`https://www.reddit.com/${subreddit}.json?show=all`);
    const json = await data.json();
    return json;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getComments = createAsyncThunk("getComments", async (params, { rejectWithValue }) => {
  let { subText, id, limit } = params;
  try {
    const data = await fetch(`https://www.reddit.com/${subText}/comments/${id}.json?limit=${limit}`);
    const json = await data.json();
    return json[1].data.children;
  } catch (error) {
    console.log(rejectWithValue(error));
    return rejectWithValue(error);
  }
});

const initialState = {
  isLoading: false,
  error: null,
  isClicked: false,
  data: {},
  commentsLoading: false,
  commentsError: null,
  postComments: {},
  toggleId: "",
  selectedSubreddit: "",
  limit: 10,
};

const subredditSlice = createSlice({
  name: "subreddits",
  initialState,
  reducers: {
    setIsClicked: (state, action) => {
      state.isClicked = action.payload;
    },
    setSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
    },
    toggleId: (state, action) => {
      if (state.toggleId !== action.payload) {
        state.toggleId = action.payload;
      } else {
        state.toggleId = "";
      }
    },
    increaseLimit: (state, action) => {
      state.limit = state.limit + action.payload;
    },
    resetLimit: (state, action) => {
      state.limit = action.payload;
    },
    resetState: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchSubreddit.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSubreddit.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isClicked = false;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(fetchSubreddit.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(getComments.pending, state => {
      state.commentsLoading = true;
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.commentsLoading = false;
      state.commentsError = null;
      state.postComments = action.payload;
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.commentsError = action.error.message;
      state.commentsLoading = false;
    });
  },
});

export default subredditSlice;
