import CLIENT_ID from "./config";
const clientId = CLIENT_ID; // Insert client ID here.
const redirectUri = 'http://potentialjammming.surge.sh'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const Spotify = {
  /*Potential Jammming Features:
       Update the access token logic to expire at exactly the right time, instead of setting expiration from when the user initiates their next search*/
  accessToken: null,
  expirationTime: null,

  getAccessToken() {
    /*Potential Jammming Features:
       Update the access token logic to expire at exactly the right time, instead of setting expiration from when the user initiates their next search*/
    if (this.accessToken && Date.now() < this.expirationTime) {
      return this.accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      this.accessToken = accessTokenMatch[1];
      /*Potential Jammming Features:
       Update the access token logic to expire at exactly the right time, instead of setting expiration from when the user initiates their next search*/
      this.expirationTime = Date.now() + parseInt(expiresInMatch[1]) * 1000;
      window.history.pushState('Access Token', null, '/');
      return this.accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  async search(term) {
    const accessToken = this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
       /*Potential Jammming Features:
        Include preview samples for each track*/
      preview: track.preview_url,
      uri: track.uri
    }));
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
};

export default Spotify;
