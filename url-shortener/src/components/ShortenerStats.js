import React, { useEffect, useState } from "react";
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Link, Box, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Log } from "../logger/loggingMiddleware";

export default function ShortenerStats() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortenedUrls") || "[]") || [];
    setUrls(stored);
    Log("frontend", "info", "stats", "Loaded statistics page");
  }, []);

  const handleDelete = async (shortcode) => {
    const filtered = urls.filter(u => u.shortcode !== shortcode);
    setUrls(filtered);
    localStorage.setItem("shortenedUrls", JSON.stringify(filtered));
    await Log("frontend", "info", "stats", `Deleted shortcode: ${shortcode}`);
  };

  return (
    <Paper style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>Shortened URLs & Statistics</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Expires At</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((u, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Link href={`/${u.shortcode}`} target="_blank">
                  {window.location.origin}/{u.shortcode}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={u.url} target="_blank">{u.url}</Link>
              </TableCell>
              <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(u.expiresAt).toLocaleString()}</TableCell>
              <TableCell>
                {u.clicks.length}
                <Box>
                  {u.clicks.map((c, i) => (
                    <div key={i} style={{ fontSize: "0.9em", marginLeft: 8 }}>
                      {new Date(c.timestamp).toLocaleString()} | {c.source} | {c.geo}
                    </div>
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(u.shortcode)} size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
