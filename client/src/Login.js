import React from "react";
import { Container } from "react-bootstrap";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=e5505021790c403b9d02f0e99a1caabc&response_type=code&redirect_uri=http://localhost:3000&scope=user-top-read%20playlist-read-private%20user-library-read%20user-read-playback-state%20user-modify-playback-state%20user-read-private%20user-read-email";

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  );
}
