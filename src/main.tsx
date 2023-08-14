import React from "react";
import ReactDOM from "react-dom/client";

import { Home } from "./sections/Home";
import "../index.css";

import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "./components/Toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Home />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
