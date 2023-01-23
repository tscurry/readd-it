import * as React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { BsArrowDownSquare, BsArrowUpSquare } from "react-icons/bs";
import { GoComment } from "react-icons/go";

import "./feedSkeleton.css";

const FeedSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-box">
        <div className="skeleton-votes">
          <BsArrowUpSquare size={27} className="up-vote" />
          <Skeleton className="votes-skeleton" baseColor="#fff" highlightColor="#e7e7e7" />
          <BsArrowDownSquare size={27} className="down-vote" />
        </div>
        <div className="skeleton-header">
          <Skeleton className="header-skeleton" />
        </div>
        <div className="skeleton-body">
          <Skeleton className="body-skeleton" />
        </div>
        <div className="skeleton-footer">
        <GoComment size={25} className="skeleton-comment-icon" />
          <Skeleton className='footer-skeleton'/>
        </div>
      </div>
    </div>
  );
};

export default FeedSkeleton;