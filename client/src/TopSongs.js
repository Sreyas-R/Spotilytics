import React, { useState, useEffect } from "react";
import TopSong from "./pages/topSongs";
import SpotifyWebApi from "spotify-web-api-node";

const TopSongs = ({ accessToken, seedTracks, userDetails, setUserDetails }) => {
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    if (accessToken) {
      const spotifyApi = new SpotifyWebApi({
        accessToken,
      });

      spotifyApi
        .getMyTopTracks({ limit: 20 })
        .then((data) => {
          const topSongsData = data.body.items;
          setTopSongs(topSongsData);

          const userTopDetails = topSongsData.map((track, index) => ({
            artistName:
              track.artists.map((artist) => artist.name).join(", ") || "",
            songName: track.name || "",
          }));

          const newSeedTracks = topSongsData.map((track) => track.id);
          seedTracks.splice(0, seedTracks.length, ...newSeedTracks);

          // Update userDetails using the setUserDetails callback
          setUserDetails(userTopDetails);
        })
        .catch((err) => {
          console.log("Error fetching top songs:", err);
        });
    }
  }, [accessToken, seedTracks, setUserDetails]);

  return (
    <div>
      <h2 className="text-center">Top Songs</h2>
      <div className="row justify-content-center">
        {topSongs.slice(0, 5).map((song) => (
          <TopSong key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default TopSongs;
