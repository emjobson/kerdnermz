import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Welcome = () => {
  const [room, setRoom] = useState("");
  const history = useHistory();

  return (
    <form onSubmit={() => history.push(`/${room}`)}>
      <label>
        Welcome! Join a room:
        <input
          type="text"
          value={room}
          onChange={(evt) => {
            setRoom(evt.target.value);
          }}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};
