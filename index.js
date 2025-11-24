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

// Proxy for main Unith streaming avatar
app.use(
  "/avatar",
  createProxyMiddleware({
    target: "https://stream.unith.ai",
    changeOrigin: true,
    ws: true,
    secure: true,
    pathRewrite: {
      "^/avatar": "",
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

// Proxy for embedded-stream.unith.ai
app.use(
  "/embedded",
  createProxyMiddleware({
    target: "https://embedded-stream.unith.ai",
    changeOrigin: true,
    ws: true,
    secure: true,
    pathRewrite: {
      "^/embedded": "",
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
    },
    onError(err, req, res) {
      console.error("Embedded proxy error:", err);
      res.status(500).send("Proxy failed.");
    },
  })
);

// Proxy for gpt-head-assets.unith.ai
app.use(
  "/assets",
  createProxyMiddleware({
    target: "https://gpt-head-assets.unith.ai",
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      "^/assets": "",
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
    },
    onError(err, req, res) {
      console.error("Assets proxy error:", err);
      res.status(500).send("Proxy failed.");
    },
  })
);

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying:`);
  console.log(`  /avatar -> stream.unith.ai`);
  console.log(`  /embedded -> embedded-stream.unith.ai`);
  console.log(`  /assets -> gpt-head-assets.unith.ai`);
});

// Handle WebSocket upgrades
server.on('upgrade', (req, socket, head) => {
  console.log('WebSocket upgrade request:', req.url);
});
