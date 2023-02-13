import * as React from "react";
import { RiHome3Line } from "react-icons/ri";
import { BiTrendingUp } from "react-icons/bi";
import { MdNewReleases } from "react-icons/md";

import { useSelector, useDispatch } from "react-redux";

import ErrorBoundary from "../../features/errorHandling/ErrorBoundary";
import SidebarSkeleton from "../../features/skeletons/sidebar/sidebarSkeleton";
import { fetchDefaultSubreddits } from "../../features/redux/reducers/defaultSubreddit";
import { fetchSubreddit } from "../../features/redux/reducers/subreddits";
import subredditSlice from "../../features/redux/reducers/subreddits";

import "./sidebar.css";

const Sidebar = () => {
  const [isEndpointSet, setIsEndpointSet] = React.useState(false);

  const dispatch = useDispatch();

  const defaultSubreddit = useSelector(state => state.default);
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
    dispatch(fetchSubreddit(end));
    dispatch(subredditSlice.actions.setIsClicked(true));
  };

  return (
    <div className="sidebar-content">
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
          {loading || Object.keys(defaultSubreddit.data).length === 0 ? (
            <SidebarSkeleton />
          ) : (
            <ErrorBoundary>
              {defaultSubreddit.data.data.children
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
                ))}
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
