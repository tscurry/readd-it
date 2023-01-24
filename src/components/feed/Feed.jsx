import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { BsArrowDownSquare, BsArrowUpSquare } from "react-icons/bs";
import { GoComment } from "react-icons/go";

import FeedSkeleton from "../../features/skeletons/feed/feedSkeleton";
import { popularData } from "../../features/redux/reducers/popular";

import "./feed.css";

const Feed = () => {
  const [isSubreddit, setIsSubreddit] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [showFeed, setShowFeed] = React.useState(false);
  const [subredditIconUrl, setSubredditIconUrl] = React.useState("");

  const dispatch = useDispatch();

  const subreddit = useSelector(state => state.subreddits);
  const popular = useSelector(state => state.popular);
  const search = useSelector(state => state.search);

  React.useEffect(() => {
    try {
      if (subreddit.isClicked) {
        setShowFeed(true);
        setSearched(false);
        setIsSubreddit(true);
      } else if (search.isSearched) {
        setShowFeed(true);
        setIsSubreddit(false);
        setSearched(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, subreddit, search]);

  React.useEffect(() => {
    dispatch(popularData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (showFeed && isSubreddit) {
      fetchSubredditIcon(subreddit.data.data.children);
    } else if (showFeed && searched) {
      fetchSubredditIcon(search.data.data.children);
    } else {
      fetchSubredditIcon(popular.data.data.children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeed, isSubreddit, searched, subreddit.data, search.data, popular.data]);

  const formatNumber = num => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  const formatDate = date => moment.unix(date).fromNow();

  const fetchSubredditIcon = async data => {
    data
      .filter(data => data.data.thumbnail !== "nsfw")
      .map(async data => {
        const url = await subredditIcon(data.data.subreddit_name_prefixed);
        setSubredditIconUrl(prevState => {
          return { ...prevState, [data.data.subreddit_name_prefixed]: url };
        });
      });
  };

  const subredditIcon = async subName => {
    try {
      const data = await fetch(`https://www.reddit.com/${subName}/about.json`);
      const json = await data.json();
      return json.data.icon_img ? json.data.icon_img : null;
    } catch (error) {
      console.log(error);
    }
  };

  const isImage = url => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  const popularRendering = () => {
    return popular.isLoading
      ? Array(5)
          .fill()
          .map((_, index) => <FeedSkeleton key={index} />)
      : popular.data.data.children
          .filter(data => data.data.thumbnail !== "nsfw")
          .map((data, index) => (
            <div className="box-container" key={index}>
              <div className="data-container">
                <div className="votes-container">
                  <BsArrowUpSquare size={27} className="up-vote" />
                  <p>{formatNumber(data.data.score)}</p>
                  <BsArrowDownSquare size={27} className="down-vote" />
                </div>
                <div className="feed-header">
                  {subredditIconUrl[data.data.subreddit_name_prefixed] ? (
                    <img className="feed-icon-img" src={subredditIconUrl[data.data.subreddit_name_prefixed]} alt="subreddit-icon" />
                  ) : null}
                  <p>{data.data.subreddit_name_prefixed}</p>
                  <span>Posted by u/{data.data.author} </span>
                  <span>{formatDate(data.data.created_utc)}</span>
                </div>
                <div className="feed-body">
                  <p>{data.data.title}</p>
                  {isImage(data.data.url) ? <img src={data.data.url} alt="subreddit" /> : null}
                </div>
                <div className="footer">
                  <div className="comments">
                    <GoComment size={25} className="comment-icon" />
                    <p>{formatNumber(data.data.num_comments)} Comments</p>
                  </div>
                </div>
              </div>
            </div>
          ));
  };

  const feedRendering = () => {
    if (subreddit.isLoading || search.isLoading) {
      return Array(5)
        .fill(null)
        .map((_, index) => <FeedSkeleton key={index} />);
    } else if (isSubreddit && Object.keys(subreddit.data).length !== 0) {
      return subreddit.data.data.children
        .filter(data => data.data.thumbnail !== "nsfw")
        .map((data, index) => (
          <div className="box-container" key={index}>
            <div className="data-container">
              <div className="votes-container">
                <BsArrowUpSquare size={27} className="up-vote" />
                <p>{formatNumber(data.data.score)}</p>
                <BsArrowDownSquare size={27} className="down-vote" />
              </div>
              <div className="feed-header">
                {subredditIconUrl[data.data.subreddit_name_prefixed] ? (
                  <img className="feed-icon-img" src={subredditIconUrl[data.data.subreddit_name_prefixed]} alt="subreddit-icon" />
                ) : null}{" "}
                <p>{data.data.subreddit_name_prefixed}</p>
                <span>Posted by u/{data.data.author} </span>
                <span>{formatDate(data.data.created_utc)}</span>
              </div>
              <div className="feed-body">
                <p>{data.data.title}</p>
                {isImage(data.data.url) ? <img src={data.data.url} alt="subreddit" /> : null}
              </div>
              <div className="footer">
                <div className="comments">
                  <GoComment size={25} className="comment-icon" />
                  <p>{formatNumber(data.data.num_comments)} Comments</p>
                </div>
              </div>
            </div>
          </div>
        ));
    } else if (searched && Object.keys(search.data).length !== 0) {
      return search.data.data.children
        .filter(data => data.data.thumbnail !== "nsfw")
        .map((data, index) => (
          <div className="box-container" key={index}>
            <div className="data-container">
              <div className="votes-container">
                <BsArrowUpSquare size={27} className="up-vote" />
                <p>{formatNumber(data.data.score)}</p>
                <BsArrowDownSquare size={27} className="down-vote" />
              </div>
              <div className="feed-header">
                {subredditIconUrl[data.data.subreddit_name_prefixed] ? (
                  <img className="feed-icon-img" src={subredditIconUrl[data.data.subreddit_name_prefixed]} alt="subreddit-icon" />
                ) : null}{" "}
                <p>{data.data.subreddit_name_prefixed}</p>
                <span>Posted by u/{data.data.author} </span>
                <span>{formatDate(data.data.created_utc)}</span>
              </div>
              <div className="feed-body">
                <p>{data.data.title}</p>
                {isImage(data.data.url) ? <img src={data.data.url} alt="subreddit" /> : null}
              </div>
              <div className="footer">
                <div className="comments">
                  <GoComment size={25} className="comment-icon" />
                  <p>{formatNumber(data.data.num_comments)} Comments</p>
                </div>
              </div>
            </div>
          </div>
        ));
    }
  };

  return (
    <>
      <div className="feed-container">{showFeed ? feedRendering() : popularRendering()}</div>
    </>
  );
};

export default Feed;
