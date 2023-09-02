// Dashboard.js
import React, { useState } from "react";
import useAuth from "./useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from "spotify-web-api-node";
import TopArtists from "./TopArtists";
import TopSongs from "./TopSongs";
import RecommendedTrack from "./pages/reccomendedTracks";
import AIReccomended from "./pages/aiReccomended";
import AIInsights from "./pages/aiInsights";
import { generateSongRecc, generateSongInsights } from "./chat.js";
const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});
const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  if (accessToken) spotifyApi.setAccessToken(accessToken);
  const seedTracks = [];
  const [reccomendations, setReccomendations] = useState([]);
  const [playlist, setPlaylist] = useState(false);
  const [aiplaylist, setaiplaylist] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiRemarks, setAiRemarks] = useState("");
  const [aisecond, setAiSecond] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  const getReccomendedPlaylist = () => {
    setPlaylist(true);
    if (accessToken) {
      const recommendedTracks = [];
      console.log(seedTracks);
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

  const chatrecc = () => {
    generateSongRecc(userDetails)
      .then((recommendations) => {
        setAiRecommendations(recommendations);
        setaiplaylist(true);
      })
      .catch((error) => {
        console.error("Error generating AI recommendations:", error);
      });
  };

  const chatInsights = () => {
    generateSongInsights(userDetails)
      .then((insights) => {
        setAiRemarks(insights);
        setAiSecond(true);
      })
      .catch((error) => {
        console.error("Error generating AI insights:", error);
      });
  };

  return (
    <div className="container">
      <TopArtists accessToken={accessToken} />

      <TopSongs
        accessToken={accessToken}
        seedTracks={seedTracks}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />

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
};

export default Dashboard;
