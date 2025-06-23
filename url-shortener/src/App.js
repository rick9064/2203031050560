import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ShortenerForm from "./components/ShortenerForm";
import ShortenerStats from "./components/ShortenerStats";
import Redirector from "./components/Redirector";
import { Container, AppBar, Toolbar, Button, Typography, Box, Paper } from "@mui/material";

function NotFound() {
  return (
    <Paper style={{ padding: 24, marginTop: 48 }}>
      <Typography variant="h5" color="error">Short URL Not Found</Typography>
      <Box mt={2}>
        <Button variant="contained" component={Link} to="/">Go Home</Button>
      </Box>
    </Paper>
  );
}

function Expired() {
  return (
    <Paper style={{ padding: 24, marginTop: 48 }}>
      <Typography variant="h5" color="error">Short URL Expired</Typography>
      <Box mt={2}>
        <Button variant="contained" component={Link} to="/">Go Home</Button>
      </Box>
    </Paper>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Shortener</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: 32 }}>
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<ShortenerStats />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/expired" element={<Expired />} />
          <Route path="/:code" element={<Redirector />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}