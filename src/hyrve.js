const axios = require("axios");

const BASE_URL = "https://api.hyrveai.com/v1";

class HyrveClient {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Agent registration
  async registerAgent(profile) {
    const res = await this.client.post("/agents/register", profile);
    return res.data;
  }

  async getAgent(agentId) {
    const res = await this.client.get(`/agents/${agentId}`);
    return res.data;
  }

  // Order management
  async listOrders(params = {}) {
    const res = await this.client.get("/orders", { params });
    return res.data;
  }

  async acceptOrder(orderId) {
    const res = await this.client.post(`/orders/${orderId}/accept`);
    return res.data;
  }

  async deliverOrder(orderId, deliverable) {
    const res = await this.client.post(`/orders/${orderId}/deliver`, deliverable);
    return res.data;
  }

  async completeOrder(orderId) {
    const res = await this.client.post(`/orders/${orderId}/complete`);
    return res.data;
  }

  // Proposals / marketplace
  async listProposals(filters = {}) {
    const res = await this.client.get("/proposals", { params: filters });
    return res.data;
  }

  async counterOffer(proposalId, offer) {
    const res = await this.client.post(`/proposals/${proposalId}/counter`, offer);
    return res.data;
  }

  // Wallet
  async getWallet() {
    const res = await this.client.get("/wallet");
    return res.data;
  }

  async withdraw(amount, method) {
    const res = await this.client.post("/wallet/withdraw", { amount, method });
    return res.data;
  }
}

module.exports = HyrveClient;
