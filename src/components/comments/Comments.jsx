import * as React from "react";
import moment from "moment";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useDispatch, useSelector } from "react-redux";
import { TiArrowUpOutline, TiArrowDownOutline } from "react-icons/ti";
import CommentsSkeleton from "../../features/skeletons/comments/commentsSkeleton";

import "./comments.css";
import subredditSlice, { getComments } from "../../features/redux/reducers/subreddits";

const Comments = ({ subText, id }) => {
  const [upvoted, setUpvoted] = React.useState({});
  const [downvoted, setDownvoted] = React.useState({});
  const [view, setView] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [defaultView, setDefaultView] = React.useState(true);

  const dispatch = useDispatch();

  const comments = useSelector(state => state.subreddits);
  const newLimit = useSelector(state => state.subreddits.limit);

  const formatCommentsDate = date => moment.unix(date).fromNow();

  const formatCommentsNumber = num => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

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

  const viewMore = () => {
    setDefaultView(false);
    setView(true);
    setLoading(true);
    dispatch(subredditSlice.actions.increaseLimit(15));
  };

  React.useEffect(() => {
    view &&
      dispatch(getComments({ subText, id, limit: newLimit }))
        .then(() => {
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    return () => {
      setView(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newLimit, view]);

  React.useEffect(() => {
    const clickedComment = document.getElementById("container");
    const getScrolledLocation = clickedComment.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + getScrolledLocation.top - 150,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <div className="comments-container" id="container">
        {defaultView && comments.commentsLoading ? (
          Array(1)
            .fill()
            .map((_, index) => <CommentsSkeleton key={index} />)
        ) : comments.postComments.length > 0 ? (
          comments.postComments.map((commentsData, index) => (
            <div key={index}>
              {commentsData.kind === "more" ? (
                <div className={loading ? "loading" : "view-more"} onClick={() => viewMore()}>
                  {loading ? "Loading..." : "View More"}
                </div>
              ) : (
                <div className="comments-data">
                  <div className="comments-header">
                    <h3>{commentsData.data.author}</h3>
                    <span>{formatCommentsDate(commentsData.data.created_utc)}</span>
                  </div>
                  <div className="comment-body">
                    <ReactMarkdown children={commentsData.data.body} remarkPlugins={[remarkGfm]} />
                  </div>
                  <div className="comment-footer">
                    <TiArrowUpOutline
                      size={20}
                      id="resizable-icon"
                      className={`resizable-icon ${upvoted[commentsData.data.id] ? "up-voted" : "up-vote"}`}
                      onClick={() => handleUpVote(commentsData.data.id)}
                    />
                    <p className={upvoted[commentsData.data.id] ? "up-voted" : downvoted[commentsData.data.id] ? "down-voted" : ""}>
                      {formatCommentsNumber(commentsData.data.score)}
                    </p>
                    <TiArrowDownOutline
                      size={20}
                      id="resizable-icon"
                      className={`resizable-icon ${downvoted[commentsData.data.id] ? "down-voted" : "down-vote"}`}
                      onClick={() => handleDownVote(commentsData.data.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="comments-data">
            <p className="comment-body">No comments found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Comments;
