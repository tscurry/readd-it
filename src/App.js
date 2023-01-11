import * as React from "react";
import { useDispatch } from "react-redux";
import { Navbar, Sidebar } from "./components/index";
import { fetchRedditData } from "./features/redux/reducers/redditSlice";

import "./app.css";
import "./index.css";

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchRedditData());
  }, [dispatch])

  return (
    <>
      <Navbar />
      <Sidebar />
    </>
  );
};

export default App;
