import React from "react";
import SearchBar from "../searchBar/SearchBar";

import "./navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-header-content">
        <h1>reddon</h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default Navbar;
