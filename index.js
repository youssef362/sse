const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.raw({ type: "*/*" }));

const TARGET = "https://stream.unith.ai";

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/avatar", async (req, res) => {
  try {
    const path = req.url.replace("/avatar", "");
    const url = TARGET + path;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(TARGET).host
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
    });

    const buffer = await response.buffer();

    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.status(response.status).send(buffer);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
