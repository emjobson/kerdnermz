import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Welcome } from "./Containers/Welcome";
import { Game } from "./Containers/Game";

function App() {
  const drone = new window.Scaledrone(process.env.REACT_APP_SCALEDRONE);

  return (
    <BrowserRouter>
      <Route exact path="/" component={Welcome} />
      <Route path="/:roomID" render={() => <Game drone={drone} />} />
    </BrowserRouter>
  );
}

export default App;
