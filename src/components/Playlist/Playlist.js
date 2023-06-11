import React, { useState, useCallback } from "react";

import "./Playlist.css";

import TrackList from "../TrackList/TrackList";

const Playlist = (props) => {
  /*Potential Jammming Features:
        Ensure playlist information doesn’t get cleared if a user has to refresh their access token*/
  const [isEditing, setIsEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(props.playlistName);

  const handleNameChange = useCallback(
    (event) => {
     setPlaylistName(event.target.value);
  }, []);

  const handleNameBlur = useCallback(() => {
    setIsEditing(false);
    props.onNameChange(playlistName);
  }, [props.onNameChange, playlistName]);

  const handleNameClick = useCallback(() => {
    setIsEditing(true);
  }, []);
 /*Potential Jammming Features:
        1. Add a loading screen while playlist is saving. It is done with the props.isSaving is not a screen but it changes the button
        2. Ensure playlist information doesn’t get cleared if a user has to refresh their access token*/
  return (
    <div className="Playlist">
        {isEditing ? (
          <input
            type="text"
            value={playlistName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
          />
        ) : (
          <input type="text" value={playlistName} className="Playlist-input Playlist-title" onClick={handleNameClick} readOnly />
        )}
      <TrackList
        tracks={props.playlistTracks}
        isRemoval={true}
        onRemove={props.onRemove}
      />
      {props.isSaving ? (
        <div className="loading">Saving...</div>
      ) : (
        <button className="Playlist-save" onClick={props.onSave}>
          SAVE TO SPOTIFY
        </button>
      )}
    </div>
  );
};

export default Playlist;