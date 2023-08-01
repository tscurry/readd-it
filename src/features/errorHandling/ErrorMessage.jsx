import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDefaultSubreddits } from "../redux/reducers/defaultSubreddit";
import subredditSlice, { fetchSubreddit } from "..//redux/reducers/subreddits";
import popularSlice from "../redux/reducers/popular";
import { searchData } from "../redux/reducers/search";

import "./errorMessage.css";

const ErrorMessage = ({ component }) => {
  const selectedSubreddit = useSelector(state => state.subreddits.selectedSubreddit);
  const searchedItem = useSelector(state => state.search.searchedItem);

  const dispatch = useDispatch();

  const handleClick = () => {
    if (component === "sidebar") {
      dispatch(fetchDefaultSubreddits());
    } else if (component === "search") {
      dispatch(searchData(searchedItem));
    } else {
      dispatch(popularSlice.actions.resetState());
      // dispatch(subredditSlice.actions.resetState());
      dispatch(subredditSlice.actions.setIsClicked(true));
      dispatch(fetchSubreddit(selectedSubreddit));
    }
  };

  return (
    <>
      <p className={component === "feed" ? "error-message-feed" : "error-message"}>
        {component === "feed" || component === "search" ? "Failed to load posts." : "Failed to load subreddits"}
      </p>
      <button onClick={() => handleClick()} className="error-button">
        {component === "feed" || component === "search" ? "Try Again" : "Refresh"}
      </button>
    </>
  );
};

export default ErrorMessage;
