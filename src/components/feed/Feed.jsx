import React from "react";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";

import { TiArrowUpOutline, TiArrowDownOutline } from "react-icons/ti";
import { GoComment } from "react-icons/go";

import TopButton from "../../features/backToTop/topButton";
import FeedSkeleton from "../../features/skeletons/feed/feedSkeleton";
import Comments from "../comments/Comments";
import subredditSlice from "../../features/redux/reducers/subreddits";

import { popularData } from "../../features/redux/reducers/popular";
import { getComments } from "../../features/redux/reducers/subreddits";

import "./feed.css";

const Feed = () => {
  const [isSubreddit, setIsSubreddit] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [showFeed, setShowFeed] = React.useState(false);
  const [subredditIconUrl, setSubredditIconUrl] = React.useState("");
  const [upvoted, setUpvoted] = React.useState({});
  const [downvoted, setDownvoted] = React.useState({});

  const dispatch = useDispatch();

  const subreddit = useSelector(state => state.subreddits);
  const popular = useSelector(state => state.popular);
  const search = useSelector(state => state.search);

  React.useEffect(() => {
    dispatch(popularData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [subreddit.isClicked, search.isSearched]);

  React.useEffect(() => {
    if (isSubreddit && subreddit.data && subreddit.data.data) {
      fetchSubredditIcon(subreddit.data.data.children);
    } else if (searched && search.data && search.data.data) {
      fetchSubredditIcon(search.data.data.children);
    } else if (!searched && !isSubreddit && popular.data && popular.data.data) {
      fetchSubredditIcon(popular.data.data.children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubreddit, searched, subreddit.data, search.data, popular.data]);

  const formatNumber = num => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  const formatDate = date => moment.unix(date).fromNow();

  const handleUpVote = id => {
    if (downvoted[id]) {
      setDownvoted({ ...downvoted, [id]: false });
    }
    setUpvoted({ ...upvoted, [id]: !upvoted[id] });
  };

  const handleDownVote = id => {
    if (upvoted[id]) {
      setUpvoted({ ...upvoted, [id]: false });
    }
    setDownvoted({ ...downvoted, [id]: !downvoted[id] });
  };

  const isImage = url => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  const fetchSubredditIcon = async data => {
    data.map(async data => {
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

  const handleComments = (subText, id) => {
    dispatch(getComments({ subText, id, limit: 10 }));
    dispatch(subredditSlice.actions.toggleId(id));
    dispatch(subredditSlice.actions.resetLimit(10));
  };

  const popularRendering = () => {
    if (popular.isLoading) {
      return Array(5)
        .fill()
        .map((_, index) => <FeedSkeleton key={index} />);
    } else if (popular.data && popular.data.data) {
      return popular.data.data.children.map((data, index) => (
        <div className="box-container" key={index}>
          <div className="data-container">
            <div className="votes-container">
              <TiArrowUpOutline
                size={27}
                className={`${upvoted[data.data.id] ? "up-voted" : "up-vote"}`}
                onClick={() => handleUpVote(data.data.id)}
              />
              <p className={upvoted[data.data.id] ? "up-voted" : downvoted[data.data.id] ? "down-voted" : ""}>{formatNumber(data.data.score)}</p>
              <TiArrowDownOutline
                size={27}
                className={`${downvoted[data.data.id] ? "down-voted" : "down-vote"}`}
                onClick={() => handleDownVote(data.data.id)}
              />
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
              {isImage(data.data.url) ? (
                <img src={data.data.url} alt="subreddit" />
              ) : data.data.is_video ? (
                <video height="auto" width="100%" controls>
                  <source src={data.data.media.reddit_video.fallback_url} />
                  <p className="error-media">Sorry, this content cannot be displayed.</p>
                </video>
              ) : null}
            </div>
            <div className="footer">
              <div className="comments" onClick={() => handleComments(data.data.subreddit_name_prefixed, data.data.id)}>
                <GoComment size={25} className="comment-icon" />
                <p>{formatNumber(data.data.num_comments)} Comments</p>
              </div>
            </div>
            {subreddit.toggleId === data.data.id && <Comments id={data.data.id} subText={data.data.subreddit_name_prefixed} />}
          </div>
        </div>
      ));
    }
  };

  const feedRendering = () => {
    if (subreddit.isLoading || search.isLoading) {
      return Array(5)
        .fill()
        .map((_, index) => <FeedSkeleton key={index} />);
    } else if (isSubreddit && subreddit.data && subreddit.data.data) {
      return subreddit.data.data.children.map((data, index) => (
        <div className="box-container" key={index}>
          <div className="data-container">
            <div className="votes-container">
              <TiArrowUpOutline
                size={27}
                className={`${upvoted[data.data.id] ? "up-voted" : "up-vote"}`}
                onClick={() => handleUpVote(data.data.id)}
              />
              <p className={upvoted[data.data.id] ? "up-voted" : downvoted[data.data.id] ? "down-voted" : ""}>{formatNumber(data.data.score)}</p>
              <TiArrowDownOutline
                size={27}
                className={`${downvoted[data.data.id] ? "down-voted" : "down-vote"}`}
                onClick={() => handleDownVote(data.data.id)}
              />
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
              {isImage(data.data.url) ? (
                <img src={data.data.url} alt="subreddit" />
              ) : data.data.is_video ? (
                <video height="auto" width="100%" controls>
                  <source src={data.data.media.reddit_video.fallback_url} />
                  <p className="error-media">Sorry, this content cannot be displayed.</p>
                </video>
              ) : null}
            </div>
            <div className="footer">
              <div className="comments" onClick={() => handleComments(data.data.subreddit_name_prefixed, data.data.id)}>
                <GoComment size={25} className="comment-icon" />
                <p>{formatNumber(data.data.num_comments)} Comments</p>
              </div>
            </div>
            {subreddit.toggleId === data.data.id && <Comments id={data.data.id} subText={data.data.subreddit_name_prefixed} />}
          </div>
        </div>
      ));
    } else if (searched && search.data && search.data.data) {
      return search.data.data.children.map((data, index) => (
        <div className="box-container" key={index}>
          <div className="data-container">
            <div className="votes-container">
              <TiArrowUpOutline
                size={27}
                className={`${upvoted[data.data.id] ? "up-voted" : "up-vote"}`}
                onClick={() => handleUpVote(data.data.id)}
              />
              <p className={upvoted[data.data.id] ? "up-voted" : downvoted[data.data.id] ? "down-voted" : ""}>{formatNumber(data.data.score)}</p>
              <TiArrowDownOutline
                size={27}
                className={`${downvoted[data.data.id] ? "down-voted" : "down-vote"}`}
                onClick={() => handleDownVote(data.data.id)}
              />
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
              {isImage(data.data.url) ? (
                <img src={data.data.url} alt="subreddit" />
              ) : data.data.is_video ? (
                <video height="auto" width="100%" controls>
                  <source src={data.data.media.reddit_video.fallback_url} />
                  <p className="error-media">Sorry, this content cannot be displayed.</p>
                </video>
              ) : null}
            </div>
            <div className="footer">
              <div className="comments" onClick={() => handleComments(data.data.subreddit_name_prefixed, data.data.id)}>
                <GoComment size={25} className="comment-icon" />
                <p>{formatNumber(data.data.num_comments)} Comments</p>
              </div>
            </div>
            {subreddit.toggleId === data.data.id && <Comments id={data.data.id} subText={data.data.subreddit_name_prefixed} />}
          </div>
        </div>
      ));
    }
  };

  return (
    <>
      <div className="feed-container">
        {showFeed ? feedRendering() : popularRendering()}
        <TopButton />
      </div>
    </>
  );
};

export default Feed;
