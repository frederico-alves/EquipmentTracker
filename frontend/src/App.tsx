import { Routes, Route, useLocation } from "react-router-dom";
import { Button, Container, Box, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

function App() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Sticky Navigation Bar */}
      <Box
        component="nav"
        sx={{
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        {/* Navigation Links */}
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
            sx={{
              color:
                location.pathname === "/" ? "secondary.main" : "text.secondary",
              backgroundColor:
                location.pathname === "/"
                  ? "rgba(99, 102, 241, 0.08)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.12)",
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/history"
            startIcon={<HistoryIcon sx={{ fontSize: 18 }} />}
            sx={{
              color:
                location.pathname === "/history"
                  ? "secondary.main"
                  : "text.secondary",
              backgroundColor:
                location.pathname === "/history"
                  ? "rgba(99, 102, 241, 0.08)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.12)",
              },
            }}
          >
            History
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
