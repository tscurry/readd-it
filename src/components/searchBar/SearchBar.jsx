import * as React from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";

// import { searchData } from "../../features/redux/reducers/search";

import "./searchBar.css";

const SearchBar = () => {
  const [query, setQuery] = React.useState("");
  const dispatch = useDispatch();

  // const handleQuery = () => {
  //   dispatch(searchData(query));
  // };

  return (
    <div className="searchbar">
      <input type="text" placeholder="Search Reddon" value={query} onChange={e => setQuery(e.target.value)} />
      <FiSearch size={27} className="search-icon" />
    </div>
  );
};

export default SearchBar;
