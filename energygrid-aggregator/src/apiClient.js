import crypto from "crypto";
import http from "http";

const API_URL = "http://localhost:3000/device/real/query";
const TOKEN = "interview_token_123";

export function generateSignature(url, token, timestamp) {
  return crypto.createHash("md5")
    .update(url + token + timestamp)
    .digest("hex");
}

export function fetchBatch(serialNumbers) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now().toString();
    const signature = generateSignature(API_URL, TOKEN, timestamp);

    const body = JSON.stringify({ serialNumbers });

    const req = http.request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Token": TOKEN,
        "Timestamp": timestamp,
        "Signature": signature
      }
    }, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else if (res.statusCode === 429) {
          reject({ retry: true });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
