import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const Game = ({ drone }) => {
  const { roomID } = useParams();
  const [gameState, setGameState] = useState();

  useEffect(() => {
    const room = drone.subscribe(`observable-${roomID}`, { historyCount: 1 });

    room.on("message", (msg) => {
      setGameState(msg.data);
    });

    room.on("members", async (members) => {
      if (members.length === 1) {
        const res = await axios.get(`/new-game/${roomID}`);
        if (res.status !== 200) {
          console.log("Failed request"); // TODO(elliott): display error message
        }
      } else {
        // only look if game in progress
        room.on("history_message", (msg) => {
          setGameState(msg.data);
        });
      }
    });

    return () => {
      room.unsubscribe(`observable-${roomID}`);
    };
  }, [drone, roomID]);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>{`Room: ${roomID}`}</div>
      <div>{`Board State: ${JSON.stringify(gameState)}`}</div>
    </div>
  );
};
