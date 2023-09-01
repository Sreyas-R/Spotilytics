// TopArtist.js
import React from "react";

function TopArtist({ artist }) {
  return (
    <div className="col-lg-2 mb-4">
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
  );
}

export default TopArtist;
