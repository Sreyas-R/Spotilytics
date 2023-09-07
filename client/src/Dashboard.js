import React, { useState } from "react";
import useAuth from "./useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from "spotify-web-api-node";
import TopArtists from "./TopArtists";
import TopSongs from "./TopSongs";
import RecommendedTrack from "./pages/reccomendedTracks";
import AIRecommended from "./pages/aiReccomended";
import AIInsights from "./pages/aiInsights";
import { generateSongRecc, generateSongInsights } from "./chat.js";
import { Container, Button } from "react-bootstrap";
import "./App.css";
const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  if (accessToken) spotifyApi.setAccessToken(accessToken);

  const [seedTracks, setSeedTracks] = useState([]);
  const [reccomendations, setReccomendations] = useState([]);
  const [playlist, setPlaylist] = useState(false);
  const [aiplaylist, setaiplaylist] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiRemarks, setAiRemarks] = useState("");
  const [aisecond, setAiSecond] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [showArtists, setShowArtists] = useState(true); // Add state for showing top artists or top songs

  const getRecommendedPlaylist = () => {
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

  const chatRecc = () => {
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

  const toggleShowArtists = () => {
    setShowArtists(!showArtists);
  };

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundColor: "#121212",
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={backgroundStyle}
    >
      <div className="container">
        <div className="d-flex justify-content-center">
          <Button
            onClick={toggleShowArtists}
            variant="sucess"
            className="btn-success btn btn-large"
          >
            View Top Songs
          </Button>
        </div>
        {showArtists ? (
          <div className="custom-card mt-4">
            <div className="card-body">
              <TopArtists accessToken={accessToken} />
            </div>
          </div>
        ) : (
          <div className="custom-card mt-4">
            <div className="card-body">
              <TopSongs
                accessToken={accessToken}
                seedTracks={seedTracks}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
              />
            </div>
          </div>
        )}
        <div className="text-center ">
          <div className="d-inline-block mx-2">
            <button onClick={chatRecc} className="btn btn-success btn-lg">
              Use AI to curate a playlist for you!
            </button>
            {aiplaylist && <AIRecommended chatlog={aiRecommendations} />}
          </div>
          <div className="d-inline-block mx-2">
            <button onClick={chatInsights} className="btn btn-success btn-lg">
              Get Insights of your music taste
            </button>
            {aisecond && <AIInsights chatlog={aiRemarks} />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
