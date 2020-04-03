import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Welcome } from "./Containers/Welcome";
import { Room } from "./Containers/Room";

function App() {
  const drone = new window.Scaledrone(process.env.REACT_APP_SCALEDRONE);

  return (
    <BrowserRouter>
      <Route exact path="/" component={Welcome} />
      <Route path="/:roomID" render={() => <Room drone={drone} />} />
    </BrowserRouter>
  );
}

export default App;
