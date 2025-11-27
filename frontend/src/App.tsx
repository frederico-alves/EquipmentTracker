import { Routes, Route, useLocation } from "react-router-dom";
import { Typography, Button, Container, Box, Stack } from "@mui/material";
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
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #0f172a 0%, #6366f1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Equipment Tracker
        </Typography>

        {/* Navigation Links */}
        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
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
              minWidth: { xs: "auto", sm: 64 },
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              "& .MuiButton-startIcon": {
                mr: { xs: 0.5, sm: 1 },
              },
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Dashboard
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: "inline", sm: "none" } }}
            >
              Home
            </Box>
          </Button>
          <Button
            component={RouterLink}
            to="/history"
            startIcon={<HistoryIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
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
              minWidth: { xs: "auto", sm: 64 },
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              "& .MuiButton-startIcon": {
                mr: { xs: 0.5, sm: 1 },
              },
            }}
          >
            History
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, sm: 3, md: 5 },
          mb: { xs: 2, sm: 3, md: 5 },
          px: { xs: 2, sm: 3 },
          flex: 1,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
