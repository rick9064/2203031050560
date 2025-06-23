import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Log } from "../logger/loggingMiddleware";

// Spinner for visual feedback
function Spinner() {
  return (
    <div style={{
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #555",
      borderRadius: "50%",
      width: 32,
      height: 32,
      animation: "spin 1s linear infinite",
      margin: "16px auto"
    }} />
  );
}

const spinnerStyle = document.createElement("style");
spinnerStyle.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}`;
document.head.appendChild(spinnerStyle);

export default function Redirector() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortenedUrls") || "[]") || [];
    const found = stored.find(u => u.shortcode === code);
    if (!found) {
      Log("frontend", "error", "redirect", `Shortcode not found: ${code}`);
      navigate("/notfound");
      return;
    }

    if (new Date() > new Date(found.expiresAt)) {
      Log("frontend", "warn", "redirect", `Shortcode expired: ${code}`);
      navigate("/expired");
      return;
    }

    const click = {
      timestamp: new Date().toISOString(),
      source: document.referrer || "direct",
      geo: "unknown",
    };
    found.clicks.push(click);
    localStorage.setItem(
      "shortenedUrls",
      JSON.stringify(stored.map(u => (u.shortcode === code ? found : u)))
    );
    Log("frontend", "info", "redirect", `Redirected: ${code}`);
    window.location.href = found.url;
  }, [code, navigate]);

  return (
    <div style={{
      maxWidth: 340,
      margin: "80px auto",
      padding: 24,
      background: "#f9f9f9",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      textAlign: "center",
      color: "#333",
      fontFamily: "system-ui, sans-serif"
    }}>
      <Spinner />
      <div style={{ fontSize: 18, marginTop: 12 }}>
        Redirecting you to your destination...
      </div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
        Please wait a moment.
      </div>
    </div>
  );
}
