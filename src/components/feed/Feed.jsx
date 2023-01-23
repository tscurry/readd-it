import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { BsArrowDownSquare, BsArrowUpSquare } from "react-icons/bs";
import { GoComment } from "react-icons/go";

import FeedSkeleton from "../../features/skeletons/feed/feedSkeleton";
import { popularData } from "../../features/redux/reducers/popular";

import "./feed.css";

const Feed = () => {
  const [isSubreddit, setIsSubreddit] = React.useState(true);
  const [searched, setSearched] = React.useState(false);

  const dispatch = useDispatch();

  const subreddit = useSelector(state => state.subreddits);
  const popular = useSelector(state => state.popular);
  const search = useSelector(state => state.search);

  const popularLoading = useSelector(state => state.popular.isLoading);
  const searchLoading = useSelector(state => state.search.isLoading);
  const subredditLoading = useSelector(state => state.subreddits.isLoading);

  React.useEffect(() => {
    try {
      if (subreddit.isClicked && subreddit.data !== null) {
        setIsSubreddit(true);
      } else if (search.isSearched) {
        setSearched(true);
      } 
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, subreddit, search]);

  React.useEffect(() => {
    dispatch(popularData())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    return () => {
      setIsSubreddit(false);
      setSearched(false);
    };
  }, []);

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
        {subredditLoading && isSubreddit
          ? Array(5)
              .fill(null)
              .map((_, index) => <FeedSkeleton key={index} />)
          : subreddit.data.data.children
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
                      <img className="feed-icon-img" src={data.data.url} alt="subreddit-icon" />
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

        {searchLoading
          ? Array(5)
              .fill(null)
              .map((_, index) => <FeedSkeleton key={index} />)
          : search.data.data.children
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
                      <img className="feed-icon-img" src={data.data.thumbnail} alt="subreddit-icon" />
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
              )) }
        {/* {subredditLoading || searchLoading || popularLoading
          ? Array(5)
              .fill(null)
              .map((_, index) => <FeedSkeleton key={index} />)
          : isSubreddit
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
                      <img className="feed-icon-img" src={data.data.url} alt="subreddit-icon" />
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
          : searched
          ? search.data.data.children
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
                      <img className="feed-icon-img" src={data.data.thumbnail} alt="subreddit-icon" />
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
                      <img className="feed-icon-img" src={data.data.url} alt="subreddit-icon" />
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
              ))} */}
      </div>
    </>
  );
};

export default Feed;
