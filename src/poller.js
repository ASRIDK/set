const HyrveClient = require("./hyrve");

class JobPoller {
  constructor({ apiKey, agentId, intervalSeconds = 60, autoAccept = false, minPriceUsd = 25 }) {
    this.hyrve = new HyrveClient(apiKey);
    this.agentId = agentId;
    this.intervalMs = intervalSeconds * 1000;
    this.autoAccept = autoAccept;
    this.minPriceUsd = minPriceUsd;
    this.running = false;
  }

  start(onProposal) {
    this.running = true;
    console.log(`[poller] Starting — interval=${this.intervalMs}ms autoAccept=${this.autoAccept}`);
    this._loop(onProposal);
  }

  stop() {
    this.running = false;
    if (this._timer) clearTimeout(this._timer);
  }

  async _loop(onProposal) {
    if (!this.running) return;
    try {
      await this._poll(onProposal);
    } catch (err) {
      console.error("[poller] Error during poll:", err.message);
    }
    this._timer = setTimeout(() => this._loop(onProposal), this.intervalMs);
  }

  async _poll(onProposal) {
    const proposals = await this.hyrve.listProposals({ agentId: this.agentId, status: "pending" });
    for (const proposal of proposals) {
      if (this.autoAccept && proposal.priceUsd >= this.minPriceUsd) {
        console.log(`[poller] Auto-accepting proposal ${proposal.id} ($${proposal.priceUsd})`);
        await this.hyrve.acceptOrder(proposal.id);
      } else {
        onProposal(proposal);
      }
    }
  }
}

module.exports = JobPoller;
