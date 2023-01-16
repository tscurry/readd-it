import * as React from "react";
import { RiHome3Line } from "react-icons/ri";
import { BiTrendingUp } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";

import { fetchDefaultSubreddits } from "../../features/redux/reducers/defaultSubreddit";
import { fetchSubreddit } from "../../features/redux/reducers/subreddits";

import "./sidebar.css";

const Sidebar = () => {
  const [endpoint, setEndpoint] = React.useState("");

  const dispatch = useDispatch();

  const defaultSubreddit = useSelector(state => state.default.data.data.children);

  React.useEffect(() => {
    if (endpoint !== "") {
      dispatch(fetchSubreddit(endpoint));
    }
    dispatch(fetchDefaultSubreddits());
  }, [dispatch, endpoint]);

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
          {defaultSubreddit
            .filter(data => data.data.title !== "Home" && data.data.icon_img !== "")
            .map(subredditData => (
              <div className="content-container" key={subredditData.data.id} onClick={() => setEndpoint(subredditData.data.display_name_prefixed)}>
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
