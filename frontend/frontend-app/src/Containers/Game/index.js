import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const Game = ({ drone }) => {
  const { roomID } = useParams();
  const [gameState, setGameState] = useState({
    board: "default local board state",
  });

  useEffect(() => {
    const room = drone.subscribe(`observable-${roomID}`, { historyCount: 1 });

    room.on("message", (msg) => {
      setGameState(msg.data);
    });
    room.on("members", async (members) => {
      if (members.length === 1) {
        axios.get(`/new-game/${roomID}`);
      }
    });
    // TODO (Elliott): don't show board from someone else's old game
    room.on("history_message", (msg) => {
      setGameState(msg.data);
    });
  }, []);

  return (
    <div>
      <div>{`Room: ${roomID}`}</div>
      <div>{`Board State: ${JSON.stringify(gameState)}`}</div>
    </div>
  );
};
