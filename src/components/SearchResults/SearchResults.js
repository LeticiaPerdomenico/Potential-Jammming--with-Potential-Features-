import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList";

const SearchResults = (props) => {
  /*Potential Jammming Features:
        Only display songs not currently present in the playlist in the search results*/
  const { searchResults, playlistTracks, onAdd } = props;

  const filteredResults = searchResults.filter((track) => {
    return !playlistTracks.some((playlistTrack) => playlistTrack.id === track.id);
  });
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={filteredResults} onAdd={onAdd} />
    </div>
  );
};

export default SearchResults;