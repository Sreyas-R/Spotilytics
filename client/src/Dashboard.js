import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from "spotify-web-api-node";
import TopArtist from "./pages/topArtists";
import TopSong from "./pages/topSongs";
import RecommendedTrack from "./pages/reccomendedTracks";
import { generateSongRecc, generateSongInsights } from "./chat.js";
import AIReccomended from "./pages/aiReccomended";
import AIInsights from "./pages/aiInsights";
const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  if (accessToken) spotifyApi.setAccessToken(accessToken);
  const [topArtists, setTopArtists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [seedTracks, setSeedTracks] = useState([]);
  const [reccomendations, setReccomendations] = useState([]);
  const [playlist, setPlaylist] = useState(false);
  const [aiplaylist, setaiplaylist] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiRemarks, setAiRemarks] = useState("");

  const [aisecond, setAiSecond] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    //Top Artists
    if (accessToken) {
      spotifyApi
        .getMyTopArtists({ limit: 5 })
        .then((data) => {
          setTopArtists(data.body.items);
        })
        .catch((err) => {
          console.log("Something went wrong!", err);
        });
      //Top Songs
      spotifyApi
        .getMyTopTracks({ limit: 20 })
        .then((data) => {
          const topSongs = data.body.items;
          const userTopDetails = topSongs.map((track, index) => ({
            artistName:
              track.artists.map((artist) => artist.name).join(", ") || "",
            songName: track.name || "",
          }));
          console.log("User Top Details", userTopDetails);

          // Set the user details state
          setUserDetails(userTopDetails);
          setTopSongs(data.body.items);
          setSeedTracks(data.body.items.map((track) => track.id));

          console.log("SetUserDetails", userDetails);
        })
        .catch((err) => {
          console.log("Something went wrong!", err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userDetails.length]);

  //new Playlist based on top songs using SPOTIFY
  const getReccomendedPlaylist = () => {
    setPlaylist(true);
    if (accessToken) {
      const recommendedTracks = [];

      seedTracks.forEach((seedTrack) => {
        spotifyApi
          .getRecommendations({
            seed_tracks: [seedTrack],
            limit: 50,
          })
          .then((data) => {
            if (data.body) {
              const recommendedTrackDetails = data.body.tracks.map((track) => ({
                name: track.name,
                artist: track.artists[0].name,
                duration_ms: track.duration_ms,
              }));
              recommendedTracks.push(...recommendedTrackDetails);
              setReccomendations(recommendedTracks);
            } else {
              console.log("No recommended tracks found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching recommendations:", error);
          });
      });
    }
  };

  //Open AI to get users top reccomendations based on CHATGPT
  const chatrecc = () => {
    generateSongRecc(userDetails)
      .then((recommendations) => {
        setAiRecommendations(recommendations); // Set the AI recommendations in the state
        setaiplaylist(true); // Set aiplaylist to true to trigger rendering of AIReccomended component
      })
      .catch((error) => {
        console.error("Error generating AI recommendations:", error);
      });
  };

  // Open Ai to get Insights into playlist
  const chatInsights = () => {
    generateSongInsights(userDetails)
      .then((insights) => {
        console.log(insights);
        setAiRemarks(insights); // Set the AI insights as a string in the state
        setAiSecond(true); // Set aisecond to true to trigger rendering of AIInsights component
      })
      .catch((error) => {
        console.error("Error generating AI insights:", error);
      });
  };

  // const fetchUserPlaylist = () => {
  //   if (accessToken) {
  //     const userPlaylists = [];
  //     spotifyApi
  //       .getUserPlaylists()
  //       .then((data) => {
  //         const playlists = data.body.items;
  //         userPlaylists.push(data.body.id);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching your playlists:", error);
  //       });
  //   }
  // };
  return (
    <div className="container">
      {/* Top Artists */}
      <h2 className="text-center">Top Artists</h2>
      <div className="card-group">
        <div className="row justify-content-center">
          {topArtists.map((artist) => (
            <TopArtist key={artist.id} artist={artist} />
          ))}
        </div>
      </div>

      {/* Top Songs */}
      <h2 className="text-center">Top Songs</h2>
      <div className="row justify-content-center">
        {topSongs.slice(0, 5).map((song) => (
          <TopSong key={song.id} song={song} />
        ))}
      </div>

      <div>
        <button onClick={getReccomendedPlaylist}>Curate New Playlist</button>
        <p>Create a new playlist based on your top songs using Spotify!</p>
      </div>

      {playlist && reccomendations.length > 0 && (
        <div>
          <h2 className="text-center">Curated Playlist</h2>
          <ul className="list-group list-group-horizontal overflow-x-auto">
            {reccomendations.map((track, index) => (
              <RecommendedTrack key={index} track={track} />
            ))}
          </ul>
        </div>
      )}

      <div>
        <button onClick={chatrecc}>Use AI to curate a playlist for you!</button>
        {aiplaylist && <AIReccomended chatlog={aiRecommendations} />}
      </div>

      <div>
        <button onClick={chatInsights}>Get Insights of your music taste</button>
        {aisecond && <AIInsights chatlog={aiRemarks} />}
      </div>
    </div>
  );
}
