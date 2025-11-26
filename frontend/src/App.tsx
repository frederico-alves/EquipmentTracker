import { Typography, Container, Button, Stack } from "@mui/material";

function App() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Equipment Tracker
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained">Primary</Button>
        <Button variant="outlined" color="secondary">
          Secondary
        </Button>
      </Stack>
    </Container>
  );
}

export default App;
