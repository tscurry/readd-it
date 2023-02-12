import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubreddit = createAsyncThunk("subreddits", async subreddit => {
  const data = await fetch(`https://www.reddit.com/${subreddit}.json?limit=100`);
  const json = await data.json();
  return json;
});

export const getComments = createAsyncThunk("getComments", async params => {
  let { subText, id, limit } = params;
  const data = await fetch(`https://www.reddit.com/${subText}/comments/${id}.json?limit=${limit}`);
  const json = await data.json();

  return json[1].data.children;
});

const subredditSlice = createSlice({
  name: "subreddits",
  initialState: {
    isLoading: false,
    error: null,
    isClicked: false,
    data: {},
    commentsLoading: false,
    postComments: {},
    toggleId: "",
    limit: 10,
  },
  reducers: {
    setIsClicked: (state, action) => {
      state.isClicked = action.payload;
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
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchSubreddit.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchSubreddit.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isClicked = false;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(fetchSubreddit.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(getComments.pending, state => {
      state.commentsLoading = true;
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.commentsLoading = false;
      state.error = null;
      state.postComments = action.payload;
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default subredditSlice;
