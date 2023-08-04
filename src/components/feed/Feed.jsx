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

const PostItem = ({ post, subredditIconUrl, globalActions, subreddit }) => {
  const [upvoted, setUpvoted] = React.useState({});
  const [downvoted, setDownvoted] = React.useState({}); 

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

  const isImage = url => url.match(/\.(jpeg|jpg|png)$/) !== null;

  const extractUrl = url => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return url.match(urlRegex)[0];
  };

  return (
    <div className="box-container" key={post.id}>
      <div className="data-container">
        <div className="votes-container">
          <TiArrowUpOutline size={27} className={`votes-icon ${upvoted[post.id] ? "up-voted" : "up-vote"}`} onClick={() => handleUpVote(post.id)} />
          <p className={upvoted[post.id] ? "up-voted" : downvoted[post.id] ? "down-voted" : ""}>{formatNumber(post.score)}</p>
          <TiArrowDownOutline
            size={27}
            className={`votes-icon ${downvoted[post.id] ? "down-voted" : "down-vote"}`}
            onClick={() => handleDownVote(post.id)}
          />
        </div>
        <div className="feed-header">
          {subredditIconUrl[post.subreddit_name_prefixed] ? (
            <LazyLoadImage className="feed-icon-img" src={subredditIconUrl[post.subreddit_name_prefixed]} alt="subreddit-icon" />
          ) : null}
          <p>{post.subreddit_name_prefixed}</p>
          <span>Posted by u/{post.author} </span>
          <span>{formatDate(post.created_utc)}</span>
        </div>
        <div className="feed-body">
          <p>{post.title}</p>
          {isImage(post.url) ? (
            <div style={{ textAlign: "center" }}>
              <LazyLoadImage effect="blur" src={post.url} style={{ width: "100%", height: "auto" }} alt="subreddit" />
            </div>
          ) : post.media && post.media.oembed ? (
            <>
              <LazyLoadComponent>
                <iframe
                  src={extractUrl(post.media.oembed.html)}
                  style={{ border: "none" }}
                  height="550"
                  width="100%"
                  title={post.media.oembed.title}
                  allowFullScreen
                ></iframe>
              </LazyLoadComponent>
            </>
          ) : null}
        </div>
        <div className="footer">
          <div className="comments" onClick={() => globalActions.handleComments(post.subreddit_name_prefixed, post.id)}>
            <GoComment size={25} className="comment-icon" />
            <p>{formatNumber(post.num_comments)} Comments</p>
          </div>
        </div>
        {subreddit.toggleId === post.id && <Comments id={post.id} subText={post.subreddit_name_prefixed} />}
      </div>
    </div>
  );
};

const Feed = () => {
  const [isSubreddit, setIsSubreddit] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [showFeed, setShowFeed] = React.useState(false);
  const [subredditIconUrl, setSubredditIconUrl] = React.useState("");
  const [postToRender, setPostToRender] = React.useState([]);

  const dispatch = useDispatch();

  const subreddit = useSelector(state => state.subreddits);
  const popular = useSelector(state => state.popular);
  const search = useSelector(state => state.search);

  React.useEffect(() => {
    if (isSubreddit && subreddit && subreddit.data && subreddit.data.data) setPostToRender(subreddit.data.data.children);
    if (searched && search && search.data && search.data.data) setPostToRender(search.data.data.children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subreddit, search]);

  React.useEffect(() => {
    dispatch(popularSlice.actions.resetState);
    dispatch(subredditSlice.actions.resetState);
    dispatch(searchSlice.actions.resetState);

    if (!showFeed) {
      dispatch(popularData());
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (popular && popular.data && popular.data.data) setPostToRender(popular.data.data.children);
  }, [popular]);

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

  const noResultsSearch = () => {
    dispatch(searchSlice.actions.resetState());
    setIsSubreddit(true);
    dispatch(fetchSubreddit(!subreddit.selectedSubreddit ? "r/Popular" : subreddit.selectedSubreddit));
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
      return null;
    }
  };

  const handleComments = (subText, id) => {
    dispatch(getComments({ subText, id, limit: 10 }));
    dispatch(subredditSlice.actions.toggleId(id));
    dispatch(subredditSlice.actions.resetLimit(10));
  };

  const handleGlobalAction = {
    noSearch: () => noResultsSearch(),
    handleComments: (subText, id) => handleComments(subText, id),
  };

  return (
    <>
      <div className="feed-container">
        {popular.isLoading || subreddit.isLoading || search.isLoading
          ? Array(5)
              .fill()
              .map((_, index) => <FeedSkeleton key={index} />)
          : null}

        {popular.error || subreddit.error ? (
          <ErrorMessage component="feed" />
        ) : (
          postToRender?.map(post => (
            <PostItem
              key={post.data.id}
              post={post.data}
              globalActions={handleGlobalAction}
              subredditIconUrl={subredditIconUrl}
              subreddit={subreddit}
            />
          ))
        )}
        <TopButton />
      </div>
    </>
  );
};

export default Feed;
