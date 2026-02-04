import { fetchBatch } from "./apiClient.js";

export async function processBatches(batches, limiter) {
  const results = [];

  for (const batch of batches) {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await limiter.enqueue(() => fetchBatch(batch));
        results.push(...res.devices);
        break;
      } catch (e) {
        attempts++;
        if (!e.retry) break;
      }
    }
  }

  return results;
}
