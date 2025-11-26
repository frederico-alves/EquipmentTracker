import { Routes, Route } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
