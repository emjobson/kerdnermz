import React from "react";

export const Game = ({ game, roomID }) => {
  return (
    <div>
      <div>{`Room: ${roomID}`}</div>
      <div>{`Board State: ${JSON.stringify(game)}`}</div>
    </div>
  );
};
