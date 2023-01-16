import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { BsArrowDownSquare, BsArrowUpSquare } from "react-icons/bs";
import { GoComment } from "react-icons/go";

import { popularData } from "../../features/redux/reducers/popular";

import "./feed.css";

const Feed = () => {
  const [isSubreddit, setIsSubreddit] = React.useState(false);

  const dispatch = useDispatch();

  const subreddit = useSelector(state => state.subreddits);
  const popular = useSelector(state => state.popular.data.data);

  React.useEffect(() => {
    if (subreddit.isClicked) {
      setIsSubreddit(true);
    }
    dispatch(popularData());
  }, [dispatch, subreddit]);

  const formatNumber = num => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  const formatDate = date => moment.unix(date).fromNow();
  return (
    <>
      <div className="feed-container">
        {isSubreddit
          ? subreddit.data.data.children
              .filter(data => data.data.thumbnail !== "nsfw")
              .map(data => (
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
                      <span>{formatDate(data.data.created_utc)}</span>
                    </div>
                    <div className="feed-body">
                      <p>{data.data.title}</p>
                      <img src={data.data.url} alt="img" />
                    </div>
                    <div className="footer">
                      <div className="comments">
                        <GoComment size={25} className="comment-icon" />
                        <p>{formatNumber(data.data.num_comments)} Comments</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          : popular.children
              .filter(data => data.data.thumbnail !== "nsfw")
              .map(data => (
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
                      <span>{formatDate(data.data.created_utc)}</span>
                    </div>
                    <div className="feed-body">
                      <p>{data.data.title}</p>
                      <img src={data.data.url} alt="img" />
                    </div>
                    <div className="footer">
                      <div className="comments">
                        <GoComment size={25} className="comment-icon" />
                        <p>{formatNumber(data.data.num_comments)} Comments</p>
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
