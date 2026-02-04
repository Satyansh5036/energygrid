import { generateSerials } from "./serials.js";
import { RateLimiter } from "./rateLimiter.js";
import { processBatches } from "./aggregator.js";

const serials = generateSerials();
const limiter = new RateLimiter(1000);

const batches = [];
for (let i = 0; i < serials.length; i += 10) {
  batches.push(serials.slice(i, i + 10));
}

(async () => {
  console.log("🚀 Fetching device data...");
  const data = await processBatches(batches, limiter);
  console.log("✅ Done");
  console.log("Total devices fetched:", data.length);
})();
