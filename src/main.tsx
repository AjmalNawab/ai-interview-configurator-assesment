import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { InterviewProvider } from "./context/InterviewContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <InterviewProvider>
        <App />
        <Toaster position="top-right" />
      </InterviewProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
