// RecommendedTrack.js
import React from "react";

//Converting milliseconds to minute:second
function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function RecommendedTrack({ track }) {
  const trackDuration = formatDuration(track.duration_ms);

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">{track.name}</h6>
          <p className="mb-0">{track.artist}</p>
        </div>
        <div>
          <p className="mb-0">{trackDuration}</p>
        </div>
      </div>
    </li>
  );
}

export default RecommendedTrack;
