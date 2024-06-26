import { ThemeProvider } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
