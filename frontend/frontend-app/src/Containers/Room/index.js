import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Game } from "./Game";
import { WordBank } from "./WordBank";

export const Room = ({ drone }) => {
  const { roomID } = useParams();
  const [roomState, setRoomState] = useState();

  useEffect(() => {
    const room = drone.subscribe(`observable-${roomID}`, { historyCount: 1 });

    room.on("message", (msg) => {
      setRoomState(msg.data);
    });

    room.on("members", async (members) => {
      if (members.length === 1) {
        const res = await axios.get(`/${roomID}`);
        if (res.status !== 200) {
          console.log("Failed request"); // TODO(elliott): display error message
        }
      } else {
        // only look if game in progress
        room.on("history_message", (msg) => {
          setRoomState(msg.data);
        });
      }
    });

    return () => {
      room.unsubscribe(`observable-${roomID}`);
    };
  }, [drone, roomID]);

  if (!roomState) {
    return <div>Loading...</div>;
  }
  // const { game, page, wordBank } = roomState;
  const { game, page, wordBank } = roomState;
  //  const page = "wordBank"; // TODO: revert

  if (page === "game") {
    return <Game game={game} roomID={roomID} />;
  }
  return <WordBank wordBank={wordBank} />;
};
