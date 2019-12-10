import React from "react";
import "./App.css";
import { StoreProvider } from "./providers/storeContext";

const App: React.FC = () => {
  return (
    <div className="App">
      <StoreProvider>
        <div>loaded!</div>
      </StoreProvider>
    </div>
  );
};

export default App;
