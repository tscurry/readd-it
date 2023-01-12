import React from "react";

import { BsArrowDownSquare, BsArrowUpSquare } from "react-icons/bs";
import { GoComment } from "react-icons/go";

import "./feed.css";

const Feed = () => {
  return (
    <div className="feed-container">
      <div className="data-container">
        <div className="votes">
          <BsArrowUpSquare size={27} className="up-vote" />
          <p>1</p>
          <BsArrowDownSquare size={27} className="down-vote" />
        </div>
        <div className="footer">
          <div className="comments">
            <GoComment size={25} />
            <p>1000 Comments</p>
          </div>
          {/* <p>Posted by</p>
          <p>Time</p> */}
        </div>
      </div>
      <div className="data-container">
        <div className="votes">
          <BsArrowUpSquare size={27} className="up-vote" />
          <p>1</p>
          <BsArrowDownSquare size={27} className="down-vote" />
        </div>
        <div className="footer">
          <div className="comments">
            <GoComment size={25} />
            <p>1000 Comments</p>
          </div>
          {/* <p>Posted by</p>
          <p>Time</p> */}
        </div>
      </div>
      <div className="data-container">
        <div className="votes">
          <BsArrowUpSquare size={27} className="up-vote" />
          <p>1</p>
          <BsArrowDownSquare size={27} className="down-vote" />
        </div>
        <div className="footer">
          <div className="comments">
            <GoComment size={25} />
            <p>1000 Comments</p>
          </div>
          {/* <p>Posted by</p>
          <p>Time</p> */}
        </div>
      </div>
    </div>
  );
};

export default Feed;
