import React from "react";

export default function AiRecommended({ chatlog }) {
  if (typeof chatlog !== "string") {
    return null;
  }

  const responseLines = chatlog.split("\n");

  return (
    <div>
      <h2>Recommended Songs:</h2>
      <ol>
        {responseLines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
