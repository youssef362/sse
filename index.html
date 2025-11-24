const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve your HTML file from the root directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Proxy for Unith streaming avatar
app.use(
  "/avatar",
  createProxyMiddleware({
    target: "https://stream.unith.ai",
    changeOrigin: true,
    ws: true, // Enable WebSocket support
    secure: true,
    pathRewrite: {
      "^/avatar": "", // Remove /avatar prefix when forwarding
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
    },
    onError(err, req, res) {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy failed.");
    },
  })
);

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
