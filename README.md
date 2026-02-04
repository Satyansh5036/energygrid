EnergyGrid Data Aggregator

This repository contains a solution for the EnergyGrid coding assignment. It includes a mock backend server that simulates strict API constraints and a client application that fetches and aggregates telemetry data from 500 solar inverters while respecting those constraints.

Instructions to Run the Solution
Prerequisites

Node.js (v14 or higher)

npm

1. Start the Mock API

Open a terminal and run:

cd mock-api
npm install
npm start


You should see:

EnergyGrid Mock API running on port 3000


The mock server will be available at http://localhost:3000.

2. Run the Aggregator Client

Open a new terminal and run:

cd energygrid-aggregator
npm install
npm start


Expected output:

Fetching device data...
Done
Total devices fetched: 500

Approach
Rate Limiting & Concurrency

The EnergyGrid API enforces a strict limit of 1 request per second.

To handle this, a queue-based rate limiter is implemented that processes one request every 1000 ms.

Requests are executed sequentially, ensuring the rate limit is never exceeded while maintaining predictable throughput.

Batching

The API allows a maximum of 10 device serial numbers per request.

The 500 devices are divided into 50 batches of 10, minimizing the total number of API calls and optimizing execution time under the given constraints.

Security

Every request is signed using the required signature format:

MD5(URL + Token + Timestamp)


A fresh timestamp and signature are generated for each request.

Error Handling

HTTP 429 (rate limit) responses and transient network errors are retried up to a limited number of times.

Non-recoverable errors are handled gracefully without stopping the entire process.

Assumptions

The mock API is running locally on http://localhost:3000.

System clock skew is negligible for timestamp-based request signing.

In-memory rate limiting is sufficient for a single-process execution.

Ordering of device data in the final aggregated output is not critical.
