import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const PORT = 3000;
const TOKEN = "interview_token_123";

let lastRequestTime = 0;

app.post("/device/real/query", (req, res) => {
  const now = Date.now();

  // Rate limit: 1 request / second
  if (now - lastRequestTime < 1000) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }
  lastRequestTime = now;

  const timestamp = req.headers.timestamp;
  const signature = req.headers.signature;

  const expectedSignature = crypto
    .createHash("md5")
    .update(
      "http://localhost:3000/device/real/query" +
        TOKEN +
        timestamp
    )
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { serialNumbers } = req.body;

  if (!Array.isArray(serialNumbers) || serialNumbers.length > 10) {
    return res.status(400).json({ error: "Max 10 serial numbers allowed" });
  }

  const devices = serialNumbers.map(sn => ({
    serialNumber: sn,
    power: Math.floor(Math.random() * 5000),
    status: "ONLINE"
  }));

  res.json({ devices });
});

app.listen(PORT, () => {
  console.log("⚡ EnergyGrid Mock API running on port 3000");
  console.log("   Constraints: 1 req/sec, Max 10 items/batch");
});
