// TopSong.js
import React from "react";
const cardStyle = {
  background: "none",
  border: "none",
  textAlign: "left",
};

const imageStyle = {
  float: "left",
  marginRight: "1rem",
};

function TopSong({ song }) {
  return (
    <div className="col-lg-2 mb-4">
      <div
        className="card h-100 d-flex align-items-center text-center"
        style={cardStyle}
      >
        <img
          src={song.album.images[0]?.url}
          className="card-img-top img-fluid"
          alt={song.name}
          style={imageStyle}
        />
        <div className="card-body">
          <h5 className="card-title ">{song.name}</h5>
        </div>
      </div>
    </div>
  );
}

export default TopSong;
