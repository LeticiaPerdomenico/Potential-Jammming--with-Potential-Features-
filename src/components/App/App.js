import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";

/*Potential Jammming Features:
        1. Add a loading screen while playlist is saving. It is done with the props.isSaving is not a screen but it changes the button
        2. Ensure playlist information doesn’t get cleared if a user has to refresh their access token*/
const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState(localStorage.getItem("playlistName") || "New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState(JSON.parse(localStorage.getItem("playlistTracks")) || []);
  const [isSaving, setIsSaving] = useState(false);

  const search = useCallback((term) => {
    if (term.trim() !== "") {
      Spotify.search(term).then(setSearchResults);
    }
  }, []);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
  }, []);

  /*Potential Jammming Features:
        Ensure playlist information doesn’t get cleared if a user has to refresh their access token*/
  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
    localStorage.setItem("playlistName", name);
  }, []);

  /*Potential Jammming Features:
        Add a loading screen while playlist is saving. It is done with the props.isSaving is not a screen but it changes the button*/
  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    setIsSaving(true);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setIsSaving(false);
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
      localStorage.removeItem("playlistName");
      localStorage.removeItem("playlistTracks");
    });
  }, [playlistName, playlistTracks]);

  /*Potential Jammming Features:
        After user redirect on login, restoring the search term from before the redirect. useEffect must be imported first.*/
  useEffect(() => {
    const storedTerm = localStorage.getItem("searchTerm");
    if (storedTerm) {
      search(storedTerm);
    }
  }, [search]);

  /*Potential Jammming Features:
        Ensure playlist information doesn’t get cleared if a user has to refresh their access token*/

  useEffect(() => {
    const storedPlaylistName = localStorage.getItem("playlistName");
    if (storedPlaylistName) {
      setPlaylistName(storedPlaylistName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlistTracks", JSON.stringify(playlistTracks));
  }, [playlistTracks]);

  /*useEffect(() => {
    localStorage.setItem("playlistTracks", JSON.stringify(playlistTracks));
  }, [playlistTracks]);*/

  return (
     /*Potential Jammming Features:
        1. Only display songs not currently present in the playlist in the search results. playlistTracks added to searchResults
        2. Add a loading screen while playlist is saving. It is done with the props.isSaving is not a screen but it changes the button*/
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} playlistTracks={playlistTracks} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default App;