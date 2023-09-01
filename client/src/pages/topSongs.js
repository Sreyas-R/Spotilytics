// TopSong.js
import React from "react";

function TopSong({ song }) {
  return (
    <div className="col-lg-2 mb-4">
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
  );
}

export default TopSong;
