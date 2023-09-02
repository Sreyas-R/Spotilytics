// TopArtists.js
import React, { useState, useEffect } from "react";
import TopArtist from "./pages/topArtists";
import SpotifyWebApi from "spotify-web-api-node";

const TopArtists = ({ accessToken }) => {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    if (accessToken) {
      const spotifyApi = new SpotifyWebApi({
        accessToken,
      });

      // Fetch top artists and update the state
      spotifyApi
        .getMyTopArtists({ limit: 5 })
        .then((data) => {
          const topArtistsData = data.body.items;
          setTopArtists(topArtistsData);
        })
        .catch((err) => {
          console.log("Error fetching top artists:", err);
        });
    }
  }, [accessToken]);

  return (
    <div>
      <h2 className="text-center">Top Artists</h2>
      <div className="card-group">
        <div className="row justify-content-center">
          {topArtists.map((artist) => (
            <TopArtist key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopArtists;
