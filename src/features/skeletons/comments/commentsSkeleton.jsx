import * as React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "./commentsSkeleton.css";

const CommentsSkeleton = () => {
  return (
    <div className="comments-skeleton">
      <div className="comments-box">
        <div className="comments-skeleton-header">
          <Skeleton className="header-span" />
        </div>
        <div className="comments-skeleton-body">
          <Skeleton className="body-span" />
          <Skeleton className="body-span" />
        </div>
      </div>
    </div>
  );
};

export default CommentsSkeleton;
