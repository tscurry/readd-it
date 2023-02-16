import * as React from "react";
import { useDispatch } from "react-redux";
import { fetchDefaultSubreddits } from "../../features/redux/reducers/defaultSubreddit";
import subredditSlice, { fetchSubreddit } from "../../features/redux/reducers/subreddits";
import popularSlice from "../redux/reducers/popular";

import "./errorMessage.css";

const ErrorMessage = ({ component }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (component === "sidebar") {
      dispatch(fetchDefaultSubreddits());
    } else {
      dispatch(popularSlice.actions.resetState());
      dispatch(subredditSlice.actions.resetState());
      dispatch(subredditSlice.actions.setIsClicked(true));
      dispatch(fetchSubreddit("r/Home"));
    }
  };

  return (
    <>
      <p className={component === "feed" ? "error-message-feed" : "error-message"}>
        Oops.... something went wrong, please check your internet connection or click the button below to try again.
      </p>
      <button onClick={() => handleClick()} className="error-button">
        {component === "feed" ? "Home" : "Refresh"}
      </button>
    </>
  );
};

export default ErrorMessage;
