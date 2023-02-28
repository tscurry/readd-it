import * as React from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { searchData } from "../../features/redux/reducers/search";
import searchSlice from "../../features/redux/reducers/search";

import "./searchBar.css";

const SearchBar = () => {
  const [query, setQuery] = React.useState("");
  const dispatch = useDispatch();
  const searchedItem = useSelector(state => state.search.searchedItem);

  React.useEffect(() => {
    searchedItem ? setQuery(searchedItem) : setQuery("");
  }, [searchedItem]);

  const handleQuery = e => {
    e.preventDefault();
    dispatch(searchSlice.actions.setSearched({ searched: true, query: query }));
    dispatch(searchData(query));
  };

  return (
    <form className="searchbar" onSubmit={handleQuery}>
      <input type="text" placeholder="Search readd-it" value={query} onChange={e => setQuery(e.target.value)} />
      <FiSearch size={27} className="search-icon" onClick={handleQuery} />
    </form>
  );
};

export default SearchBar;
