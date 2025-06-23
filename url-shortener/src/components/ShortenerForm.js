import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Box, Link, Divider } from "@mui/material";
import { Log } from "../logger/loggingMiddleware";

const MAX = 5, DEFAULT_MIN = 30;

const isURL = url => {
  try { new URL(url); return true; } catch { return false; }
};

const isCode = c => /^[a-zA-Z0-9]{4,16}$/.test(c);
const randomCode = () => Math.random().toString(36).substring(2, 8);

export default function ShortenerForm({ onShortened }) {
  const [data, setData] = useState(() =>
    Array.from({ length: MAX }, () => ({ url: "", validity: "", code: "" }))
  );
  const [errs, setErrs] = useState([]);
  const [out, setOut] = useState([]);

  const change = (i, field, val) => {
    const temp = [...data];
    temp[i][field] = val;
    setData(temp);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
    const codes = new Set(saved.map(i => i.shortcode));
    const res = [], newErrs = [];
    let hasErr = false;

    for (let i = 0; i < MAX; i++) {
      let { url, validity, code } = data[i];
      if (!url) continue;
      if (!isURL(url)) {
        newErrs[i] = "Invalid URL";
        await Log("frontend", "error", "validation", url);
        hasErr = true;
        continue;
      }

      const mins = validity ? parseInt(validity) : DEFAULT_MIN;
      if (validity && (isNaN(mins) || mins <= 0)) {
        newErrs[i] = "Enter valid minutes";
        await Log("frontend", "error", "validation", validity);
        hasErr = true;
        continue;
      }

      if (!code) code = randomCode();
      if (!isCode(code)) {
        newErrs[i] = "Invalid code";
        await Log("frontend", "error", "validation", code);
        hasErr = true;
        continue;
      }

      if (codes.has(code)) {
        newErrs[i] = "Code taken";
        await Log("frontend", "error", "validation", code);
        hasErr = true;
        continue;
      }

      codes.add(code);
      const now = new Date();
      const item = {
        url,
        shortcode: code,
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + mins * 60000).toISOString(),
        clicks: []
      };
      res.push(item);
      await Log("frontend", "info", "shortener", `${url} -> ${code}`);
    }

    setErrs(newErrs);

    if (!hasErr && res.length) {
      const all = [...saved, ...res];
      localStorage.setItem("shortenedUrls", JSON.stringify(all));
      setOut(res);
      onShortened?.(res);
    } else {
      setOut([]);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: "auto", mt: 3 }}>
      <Typography variant="h6">Shorten URLs (Max {MAX})</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {data.map((d, i) => (
            <React.Fragment key={i}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth label="URL" size="small" value={d.url}
                  onChange={e => change(i, "url", e.target.value)}
                  error={!!errs[i]} helperText={errs[i]}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth label="Validity (min)" size="small" value={d.validity}
                  onChange={e => change(i, "validity", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth label="Custom Code" size="small" value={d.code}
                  onChange={e => change(i, "code", e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained">Shorten</Button>
          </Grid>
        </Grid>
      </form>

      {out.length > 0 && (
        <Box mt={4}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1">Shortened URLs</Typography>
          {out.map((r, i) => (
            <Paper key={i} sx={{ p: 2, mb: 2 }}>
              <div><b>Original:</b> <Link href={r.url} target="_blank">{r.url}</Link></div>
              <div><b>Short:</b> <Link href={`/${r.shortcode}`} target="_blank">{window.location.origin}/{r.shortcode}</Link></div>
              <div><b>Expires:</b> {new Date(r.expiresAt).toLocaleString()}</div>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}
