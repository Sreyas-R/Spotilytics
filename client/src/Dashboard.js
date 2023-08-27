import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from "spotify-web-api-node";

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
  //GEtting top songs and top artists ->SPOTIFY WRAPPED
  useEffect(() => {
    if (accessToken) {
      spotifyApi
        .getMyTopArtists({ limit: 5 })
        .then((data) => {
          setTopArtists(data.body.items);
        })
        .catch((err) => {
          console.log("Something went wrong!", err);
        });

      spotifyApi
        .getMyTopTracks({ limit: 5 })
        .then((data) => {
          setTopSongs(data.body.items);
          setSeedTracks(data.body.items.map((track) => track.id));
        })
        .catch((err) => {
          console.log("Something went wrong!", err);
        });
    }
  }, [accessToken]);
  //Formatting milliseconds to seconds
  const formatDuration = (milliseconds) => {
    const date = new Date(milliseconds);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  //Generate custom playlist based on top songs listened
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

  return (
    <div className="container">
      <h2 className="text-center">Top Artists</h2>
      <div className="card-group">
        <div className="row justify-content-center">
          {topArtists.map((artist) => (
            <div key={artist.id} className="col-lg-2 mb-4">
              <div className="card h-100 d-flex align-items-center text-center">
                <img
                  src={artist.images[0]?.url}
                  className="card-img-top img-fluid"
                  alt={artist.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{artist.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-center">Top Songs</h2>
      <div className="row justify-content-center">
        {topSongs.map((song) => (
          <div key={song.id} className="col-lg-2 mb-4">
            <div className="card h-100 d-flex align-items-center text-center">
              <img
                src={song.album.images[0]?.url}
                className="card-img-top img-fluid"
                alt={song.name}
              />
              <div className="card-body">
                <h5 className="card-title">{song.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button onClick={getReccomendedPlaylist}>Curate New Playlist</button>
        <p>Create a new playlist based on your top songs!</p>
      </div>

      {playlist && reccomendations.length > 0 && (
        <div>
          <h2 className="text-center">Curated Playlist</h2>
          <div className="row justify-content-center">
            {reccomendations.map((track, index) => (
              <div key={index} className="col-lg-3 mb-4">
                <div className="card h-100 d-flex align-items-center text-center">
                  <div className="card-body">
                    <h5 className="card-title">{track.name}</h5>
                    <p className="card-text">{track.artist}</p>
                    <p className="card-text">
                      {formatDuration(track.duration_ms)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
