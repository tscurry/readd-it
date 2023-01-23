import * as React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "./sidebarSkeleton.css";

const SidebarSkeleton = () => {
  return (
    <div className="skeleton">
      <Skeleton count={100} circle height={25} width={25} className="skeleton-icon" />
      <Skeleton count={100} className="skeleton-text" />
    </div>
  );
};

export default SidebarSkeleton;
