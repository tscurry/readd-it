import * as React from "react";
import moment from "moment";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useSelector } from "react-redux";
import { TiArrowUpOutline, TiArrowDownOutline } from "react-icons/ti";

import "./comments.css";

const Comments = () => {
  const [upvoted, setUpvoted] = React.useState({});
  const [downvoted, setDownvoted] = React.useState({});

  const comments = useSelector(state => state.subreddits);

  const formatDate = date => moment.unix(date).fromNow();

  const formatNumber = num => {
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

  return (
    <>
      <div className="comments-container">
        {comments.postComments
          .filter(data => data.data.author !== "[deleted]")
          .map((comm, index) => (
            <div className="comments-data" key={index}>
              <div className="comments-header">
                <h3>{comm.data.author}</h3>
                <span>{formatDate(comm.data.created_utc)}</span>
              </div>
              <div className="comment-body">
                <ReactMarkdown children={comm.data.body} remarkPlugins={[remarkGfm]}/>
              </div>
              <div className="comment-footer">
                <TiArrowUpOutline
                  size={20}
                  className={`${upvoted[comm.data.id] ? "up-voted" : "up-vote"}`}
                  onClick={() => handleUpVote(comm.data.id)}
                />
                <p className={upvoted[comm.data.id] ? "up-voted" : downvoted[comm.data.id] ? "down-voted" : ""}>{formatNumber(comm.data.score)}</p>
                <TiArrowDownOutline
                  size={20}
                  className={`${downvoted[comm.data.id] ? "down-voted" : "down-vote"}`}
                  onClick={() => handleDownVote(comm.data.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Comments;
