import React from "react";
import { RiHome3Line } from "react-icons/ri";
import { BiTrendingUp } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import { fetchSubreddit } from "../../features/redux/reducers/reddit";

import "./sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const subreddit = useSelector(state => state.reddit.subreddit.data.data.children);

  React.useEffect(() => {
    dispatch(fetchSubreddit('subreddits.json?limit=100'))
  }, [dispatch])

  return (
    <div className="sidebar-content">
      <div className="heading-container">
        <p className="subheading-container">Feeds</p>
        <div className="content-container">
          <RiHome3Line size={20} />
          <p>
            <a href="#home">Home</a>
          </p>
        </div>
        <div className="content-container">
          <BiTrendingUp size={20} />
          <p>
            <a href="#popular">Popular</a>
          </p>
        </div>
      </div>
      <div className="heading-container">
        <p className="subheading-container">Subreddits</p>
        <div className="subreddits-container">
          {subreddit
            .filter(data => data.data.title !== "Home" && data.data.icon_img !== "")
            .map(subredditData => (
              <div className="content-container" key={subredditData.id}>
                <div className="icon-img-resize" style={{ backgroundImage: `url(${subredditData.data.icon_img})` }}></div>
                <p>{subredditData.data.display_name_prefixed}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
