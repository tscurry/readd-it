import React from "react";
import { RiHome3Line } from "react-icons/ri";
import { BiTrendingUp } from "react-icons/bi";

import { useSelector } from "react-redux";

import "./sidebar.css";

const Sidebar = () => {
  const subreddit = useSelector(state => state.subreddits.data.data.children);

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
            .filter(text => text.data.title !== "Home")
            .map(subredditData => (
              <div className="content-container">
                <p>{subredditData.data.display_name_prefixed}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
