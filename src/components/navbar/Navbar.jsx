import React from "react";
import { FiSearch } from 'react-icons/fi'

import "./navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-header-content">
        <h1>reddon</h1>
        <div className="searchbar">
          <input type="text" placeholder="Search Reddon"/>
          <FiSearch size={27} className='search-icon'/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
