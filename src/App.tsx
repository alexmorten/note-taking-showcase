import React from "react";
import "./App.css";
import { StoreProvider } from "./providers/storeContext";
import Router from "./Router";

const App: React.FC = () => {
  return (
    <div className="App">
      <StoreProvider>
        <Router />
      </StoreProvider>
    </div>
  );
};

export default App;
