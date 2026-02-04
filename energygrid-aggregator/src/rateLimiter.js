export class RateLimiter {
  constructor(intervalMs = 1000) {
    this.queue = [];
    this.running = false;
    this.intervalMs = intervalMs;
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      try {
        resolve(await task());
      } catch (e) {
        reject(e);
      }
      await new Promise(r => setTimeout(r, this.intervalMs));
    }

    this.running = false;
  }
}
