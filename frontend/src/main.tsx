import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0f172a" },
    secondary: { main: "#6366f1" },
  },
  typography: {
    fontFamily: "BlinkMacSystemFont, sans-serif",
    h4: { fontWeight: 600, letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 20px",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
