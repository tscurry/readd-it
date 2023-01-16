import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { BsArrowDownSquare, BsArrowUpSquare } from "react-icons/bs";
import { GoComment } from "react-icons/go";

import { popularData } from "../../features/redux/reducers/reddit";

import "./feed.css";

const Feed = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(popularData());
  }, [dispatch]);

  const popular = useSelector(state => state.reddit.popular.data.data.children);

  const formatNumber = num => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  return (
    <>
      <div className="feed-container">
        {popular.map(data => (
          <div className="box-container" key={data.data.id}>
            <div className="data-container">
              <div className="votes-container">
                <BsArrowUpSquare size={27} className="up-vote" />
                <p>{formatNumber(data.data.score)}</p>
                <BsArrowDownSquare size={27} className="down-vote" />
              </div>
              <div className="feed-header">
                <div className="feed-icon-img" style={{ backgroundImage: `url(${data.data.url})` }}></div>
                <p>{data.data.subreddit_name_prefixed}</p>
                <span>Posted by u/{data.data.author} </span>
              </div>
              <div className="feed-body">
                <p>{data.data.title}</p>
              </div>
              <div className="footer">
                <div className="comments">
                  <GoComment size={25} />
                  <p>{formatNumber(data.data.num_comments)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Feed;
