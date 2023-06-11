import React, { useState, useCallback, useEffect } from "react";

import "./SearchBar.css";

const SearchBar = (props) => {
  const [term, setTerm] = useState("");

  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);

  const search = useCallback(() => {
    props.onSearch(term);
  }, [props.onSearch, term]);

  /*Pressing enter in the search bar triggers a search*/
  const keyDown = async function handleKeyPress(e) {
    if (e.key === "Enter") {
      search();
    }
  };

  /*Potential Jammming Features:
        After user redirect on login, restoring the search term from before the redirect. useEffect must be imported first, add value to the input.*/
  useEffect(() => {
    const storedTerm = localStorage.getItem("searchTerm");
    if (storedTerm) {
      setTerm(storedTerm);
      search();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchTerm", term);
  }, [term]);

  return (
    /*Pressing enter in the search bar triggers a search*/
    <div className="SearchBar">
      <input placeholder="Enter A Song Title" value={term} onChange={handleTermChange} onKeyDown={keyDown}/>
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
