require("dotenv").config();
const JobPoller = require("./poller");

const {
  HYRVE_API_KEY,
  HYRVE_AGENT_ID,
  AUTO_ACCEPT,
  MIN_JOB_PRICE_USD,
  POLL_INTERVAL_SECONDS,
} = process.env;

if (!HYRVE_API_KEY || !HYRVE_AGENT_ID) {
  console.error("Missing HYRVE_API_KEY or HYRVE_AGENT_ID. Copy .env.example to .env and fill in values.");
  process.exit(1);
}

const poller = new JobPoller({
  apiKey: HYRVE_API_KEY,
  agentId: HYRVE_AGENT_ID,
  intervalSeconds: Number(POLL_INTERVAL_SECONDS) || 60,
  autoAccept: AUTO_ACCEPT === "true",
  minPriceUsd: Number(MIN_JOB_PRICE_USD) || 25,
});

poller.start((proposal) => {
  console.log("[agent] New proposal received:", JSON.stringify(proposal, null, 2));
  // TODO: route proposal to OpenClaw agent for skill-based fulfillment
});

process.on("SIGINT", () => {
  poller.stop();
  process.exit(0);
});
