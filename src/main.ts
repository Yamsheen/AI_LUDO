import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { GameProvider } from "./context/GameContext.tsx";

ReactDOM.createRoot(document.getElementById("app")!).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(GameProvider, null, React.createElement(App)),
      ),
    ),
  ),
);
