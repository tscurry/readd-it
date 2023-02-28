import React from "react";
import SearchBar from "../searchBar/SearchBar";

import SidebarSkeleton from "../../features/skeletons/sidebar/sidebarSkeleton";
import { fetchDefaultSubreddits } from "../../features/redux/reducers/defaultSubreddit";
import { fetchSubreddit } from "../../features/redux/reducers/subreddits";
import subredditSlice from "../../features/redux/reducers/subreddits";
import { useDispatch, useSelector } from "react-redux";

import { RiMenu5Fill, RiCloseFill, RiHome3Line } from "react-icons/ri";
import { BiTrendingUp } from "react-icons/bi";
import { MdNewReleases } from "react-icons/md";

import "./navbar.css";

const Navbar = () => {
  const [click, setClick] = React.useState(false);
  const [isEndpointSet, setIsEndpointSet] = React.useState(false);

  const dispatch = useDispatch();

  const subreddits = useSelector(state => state.default);
  const loading = useSelector(state => state.default.isLoading);

  React.useEffect(() => {
    try {
      if (!isEndpointSet) {
        dispatch(fetchDefaultSubreddits());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, isEndpointSet]);

  React.useEffect(() => {
    return () => {
      setIsEndpointSet(false);
    };
  }, []);

  const handleEndpoint = end => {
    setIsEndpointSet(true);
    setClick(false);
    dispatch(fetchSubreddit(end));
    dispatch(subredditSlice.actions.setIsClicked(true));
  };

  const menuOpen = () => {
    return (
      <div className="menu-open">
        {/* sidebar.css is already imbedded in project so dont need to replicate styles*/}
        <div className="heading-container">
          <p className="subheading-container">Feeds</p>
          <div className="content-container" onClick={() => handleEndpoint("r/Home")}>
            <RiHome3Line size={20} />
            <p className="subreddit">Home</p>
          </div>
          <div className="content-container" onClick={() => handleEndpoint("r/Popular")}>
            <BiTrendingUp size={20} />
            <p className="subreddit">Popular</p>
          </div>
          <div className="content-container" onClick={() => handleEndpoint("/new")}>
            <MdNewReleases size={20} />
            <p className="subreddit">Latest</p>
          </div>
        </div>
        <div className="heading-container">
          <p className="subheading-container">Subreddits</p>
          <div id="menu-open-subreddit" className="subreddits-container">
            {loading || Object.keys(subreddits.data).length === 0 ? (
              <SidebarSkeleton />
            ) : subreddits.data && subreddits.data.data ? (
              subreddits.data.data.children
                .filter(data => data.data.title !== "Home" && data.data.icon_img !== "")
                .map(subredditData => (
                  <div
                    className="content-container"
                    key={subredditData.data.id}
                    onClick={() => handleEndpoint(subredditData.data.display_name_prefixed)}
                  >
                    <div className="icon-img-resize" style={{ backgroundImage: `url(${subredditData.data.icon_img})` }}></div>
                    <p className="subreddit">{subredditData.data.display_name_prefixed}</p>
                  </div>
                ))
            ) : (
              <p>No subreddits found, please refresh and try again</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="navbar-container">
      <div className="navbar-header-content">
        <h1 onClick={() => handleEndpoint("r/Popular")}>readd-it</h1>
        <SearchBar />
        {click ? (
          <RiCloseFill size={40} className="hamburg-menu" onClick={() => setClick(!click)} />
        ) : (
          <RiMenu5Fill size={40} className="hamburg-menu" onClick={() => setClick(!click)} />
        )}
        {click && menuOpen()}
      </div>
    </div>
  );
};

export default Navbar;
