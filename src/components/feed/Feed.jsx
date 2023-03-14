import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { LazyLoadImage, LazyLoadComponent } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { TiArrowUpOutline, TiArrowDownOutline } from "react-icons/ti";
import { GoComment } from "react-icons/go";
import TopButton from "../../features/backToTop/topButton";
import FeedSkeleton from "../../features/skeletons/feed/feedSkeleton";
import Comments from "../comments/Comments";
import subredditSlice from "../../features/redux/reducers/subreddits";
import popularSlice, { popularData } from "../../features/redux/reducers/popular";
import { getComments, fetchSubreddit } from "../../features/redux/reducers/subreddits";
import "./feed.css";
import ErrorMessage from "../../features/errorHandling/ErrorMessage";
import searchSlice from "../../features/redux/reducers/search";

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
    dispatch(popularSlice.actions.resetState);
    dispatch(subredditSlice.actions.resetState);
    dispatch(searchSlice.actions.resetState);
    dispatch(popularData());
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    try {
      if (subreddit.isClicked) {
        dispatch(searchSlice.actions.resetState());
        setShowFeed(true);
        setSearched(false);
        setIsSubreddit(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (search.isSearched) {
        setShowFeed(true);
        setIsSubreddit(false);
        setSearched(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const noResultsSearch = () => {
    dispatch(searchSlice.actions.resetState());
    setIsSubreddit(true);
    dispatch(fetchSubreddit(!subreddit.selectedSubreddit ? "r/Popular" : subreddit.selectedSubreddit));
  };

  const isImage = url => url.match(/\.(jpeg|jpg|png)$/) !== null;

  const extractUrl = url => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return url.match(urlRegex)[0];
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
    return popular.error ? (
      <ErrorMessage component="feed" />
    ) : popular.isLoading ? (
      Array(5)
        .fill()
        .map((_, index) => <FeedSkeleton key={index} />)
    ) : popular.data && popular.data.data ? (
      popular.data.data.children
        .filter(data => data.data.is_video === false)
        .map(data => (
          <div className="box-container" key={data.data.id}>
            <div className="data-container">
              <div className="votes-container">
                <TiArrowUpOutline
                  size={27}
                  className={`votes-icon ${upvoted[data.data.id] ? "up-voted" : "up-vote"}`}
                  onClick={() => handleUpVote(data.data.id)}
                />
                <p className={upvoted[data.data.id] ? "up-voted" : downvoted[data.data.id] ? "down-voted" : ""}>{formatNumber(data.data.score)}</p>
                <TiArrowDownOutline
                  size={27}
                  className={`votes-icon ${downvoted[data.data.id] ? "down-voted" : "down-vote"}`}
                  onClick={() => handleDownVote(data.data.id)}
                />
              </div>
              <div className="feed-header">
                {subredditIconUrl[data.data.subreddit_name_prefixed] ? (
                  <LazyLoadImage className="feed-icon-img" src={subredditIconUrl[data.data.subreddit_name_prefixed]} alt="subreddit-icon" />
                ) : null}
                <p>{data.data.subreddit_name_prefixed}</p>
                <span>Posted by u/{data.data.author} </span>
                <span>{formatDate(data.data.created_utc)}</span>
              </div>
              <div className="feed-body">
                <p>{data.data.title}</p>
                {isImage(data.data.url) ? (
                  <div style={{ textAlign: "center" }}>
                    <LazyLoadImage effect="blur" src={data.data.url} style={{ width: "100%", height: "auto" }} alt="subreddit" />
                  </div>
                ) : data.data.media ? (
                  <>
                    <LazyLoadComponent>
                      <iframe
                        src={extractUrl(data.data.media.oembed.html)}
                        style={{ border: "none" }}
                        height="550"
                        width="100%"
                        title={data.data.media.oembed.title}
                        allowFullScreen
                      ></iframe>
                    </LazyLoadComponent>
                  </>
                ) : null}
              </div>
              <div className="footer">
                <div className="comments" onClick={() => handleComments(data.data.subreddit_name_prefixed, data.data.id)}>
                  <GoComment size={25} className="comment-icon" />
                  <p>{formatNumber(data.data.num_comments)} Comments</p>
                </div>
              </div>
              {!subreddit.commentsError && subreddit.toggleId === data.data.id && (
                <Comments id={data.data.id} subText={data.data.subreddit_name_prefixed} />
              )}
            </div>
          </div>
        ))
    ) : null;
  };

  const feedRendering = () => {
    return subreddit.error ? (
      <ErrorMessage component="feed" />
    ) : subreddit.isLoading || search.isLoading ? (
      Array(5)
        .fill()
        .map((_, index) => <FeedSkeleton key={index} />)
    ) : isSubreddit && subreddit.data && subreddit.data.data ? (
      subreddit.data.data.children.map(data => (
        <div className="box-container" key={data.data.id}>
          <div className="data-container">
            <div className="votes-container">
              <TiArrowUpOutline
                size={27}
                className={`votes-icon ${upvoted[data.data.id] ? "up-voted" : "up-vote"}`}
                onClick={() => handleUpVote(data.data.id)}
              />
              <p className={upvoted[data.data.id] ? "up-voted" : downvoted[data.data.id] ? "down-voted" : ""}>{formatNumber(data.data.score)}</p>
              <TiArrowDownOutline
                size={27}
                className={`votes-icon ${downvoted[data.data.id] ? "down-voted" : "down-vote"}`}
                onClick={() => handleDownVote(data.data.id)}
              />
            </div>
            <div className="feed-header">
              {subredditIconUrl[data.data.subreddit_name_prefixed] ? (
                <LazyLoadImage className="feed-icon-img" src={subredditIconUrl[data.data.subreddit_name_prefixed]} alt="subreddit-icon" />
              ) : null}
              <p>{data.data.subreddit_name_prefixed}</p>
              <span>Posted by u/{data.data.author} </span>
              <span>{formatDate(data.data.created_utc)}</span>
            </div>
            <div className="feed-body">
              <p>{data.data.title}</p>
              {isImage(data.data.url) ? (
                <div style={{ textAlign: "center" }}>
                  <LazyLoadImage effect="blur" src={data.data.url} style={{ width: "100%", height: "auto" }} alt="subreddit" />
                </div>
              ) : data.data.media ? (
                <>
                  <LazyLoadComponent>
                    <iframe
                      src={extractUrl(data.data.media.oembed.html)}
                      style={{ border: "none" }}
                      height="550"
                      width="100%"
                      title={data.data.media.oembed.title}
                      allowFullScreen
                    ></iframe>
                  </LazyLoadComponent>
                </>
              ) : null}
            </div>
            <div className="footer">
              <div className="comments" onClick={() => handleComments(data.data.subreddit_name_prefixed, data.data.id)}>
                <GoComment size={25} className="comment-icon" />
                <p>{formatNumber(data.data.num_comments)} Comments</p>
              </div>
            </div>
            {!subreddit.commentsError && subreddit.toggleId === data.data.id && (
              <Comments id={data.data.id} subText={data.data.subreddit_name_prefixed} />
            )}
          </div>
        </div>
      ))
    ) : search.error ? (
      <ErrorMessage component="search" />
    ) : searched && search.data.data.children.length > 0 ? (
      search.data.data.children.map(data => (
        <div className="box-container" key={data.data.id}>
          <div className="data-container">
            <div className="votes-container">
              <TiArrowUpOutline
                size={27}
                className={`votes-icon ${upvoted[data.data.id] ? "up-voted" : "up-vote"}`}
                onClick={() => handleUpVote(data.data.id)}
              />
              <p className={upvoted[data.data.id] ? "up-voted" : downvoted[data.data.id] ? "down-voted" : ""}>{formatNumber(data.data.score)}</p>
              <TiArrowDownOutline
                size={27}
                className={`votes-icon ${downvoted[data.data.id] ? "down-voted" : "down-vote"}`}
                onClick={() => handleDownVote(data.data.id)}
              />
            </div>
            <div className="feed-header">
              {subredditIconUrl[data.data.subreddit_name_prefixed] ? (
                <LazyLoadImage
                  effect="blur"
                  className="feed-icon-img"
                  src={subredditIconUrl[data.data.subreddit_name_prefixed]}
                  alt="subreddit-icon"
                />
              ) : null}
              <p>{data.data.subreddit_name_prefixed}</p>
              <span>Posted by u/{data.data.author} </span>
              <span>{formatDate(data.data.created_utc)}</span>
            </div>
            <div className="feed-body">
              <p>{data.data.title}</p>
              {isImage(data.data.url) ? (
                <div style={{ textAlign: "center" }}>
                  <LazyLoadImage effect="blur" src={data.data.url} style={{ width: "100%", height: "auto" }} alt="subreddit" />
                </div>
              ) : data.data.media ? (
                <>
                  <LazyLoadComponent>
                    <iframe
                      src={extractUrl(data.data.media.oembed.html)}
                      style={{ border: "none" }}
                      height="550"
                      width="100%"
                      title={data.data.media.oembed.title}
                      allowFullScreen
                    ></iframe>
                  </LazyLoadComponent>
                </>
              ) : null}
            </div>
            <div className="footer">
              <div className="comments" onClick={() => handleComments(data.data.subreddit_name_prefixed, data.data.id)}>
                <GoComment size={25} className="comment-icon" />
                <p>{formatNumber(data.data.num_comments)} Comments</p>
              </div>
            </div>
            {!subreddit.commentsError && subreddit.toggleId === data.data.id && (
              <Comments id={data.data.id} subText={data.data.subreddit_name_prefixed} />
            )}
          </div>
        </div>
      ))
    ) : search.data.data.children.length === 0 ? (
      <>
        <p className="search-no-results">No post matching '{search.searchedItem}' was found.</p>
        <button className="search-no-results-button" onClick={() => noResultsSearch()}>
          Back to Home
        </button>
      </>
    ) : null;
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
