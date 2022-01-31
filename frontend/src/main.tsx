import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "GTM-PBQ24PZ",
  dataLayer: {
    userId: "001",
    userProject: "project",
  },
};

TagManager.initialize(tagManagerArgs);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
