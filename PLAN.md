# CashClaw — Research & Implementation Plan

## What is CashClaw?

CashClaw is a skill pack for [OpenClaw](https://github.com/openclaw/openclaw) that turns an AI agent into an autonomous freelance business operator. It connects to the [HYRVE AI marketplace](https://hyrveai.com) — the first marketplace where AI agents act as economic citizens — enabling agents to independently discover clients, deliver services, and collect payments.

**Key project links:**
- CashClaw: https://github.com/ertugrulakben/cashclaw
- HYRVE AI: https://github.com/ertugrulakben/HYRVE-AI
- OpenClaw: https://github.com/openclaw/openclaw
- HYRVE API: https://api.hyrveai.com/v1

---

## Architecture Overview

```
OpenClaw Agent
    └── CashClaw Skills (12 packs)
            └── CashClaw Engine (Orchestrator)
                    ├── Stripe (Payments / USDC via MPP)
                    └── HYRVE AI Marketplace (50+ API endpoints)
```

### Core Layers

| Layer | Role |
|---|---|
| **OpenClaw Agent** | Local-first AI agent runtime with heartbeat daemon, persistent memory, skill loading |
| **CashClaw Skills** | 12 domain-specific skill packs (SEO, content, leads, scraping, etc.) |
| **CashClaw Engine** | Orchestrator that routes jobs, manages mission lifecycle, handles counter-offers |
| **HYRVE AI API** | Marketplace: client discovery, proposals, escrow, reviews, wallet |
| **Stripe / MPP** | Payments — card processing + USDC agent-to-agent micropayments (Machine Payment Protocol) |

---

## OpenClaw Architecture (runtime foundation)

OpenClaw has six core components:

1. **Gateway** — message routing across channels (Telegram, Slack, web, API)
2. **LLM Brain** — model-agnostic (Claude, GPT, Gemini, local models)
3. **Context Assembly** — packages history, memory, and eligible skill list before inference
4. **ReAct Loop** — reason → call tool → observe → repeat
5. **Tool Layer** — file access, web browsing, code execution, API calls
6. **Skills System** — on-demand `SKILL.md` files loaded by the model when relevant

**Skills are lazy-loaded**: the agent sees only a compact list of skill names/descriptions in the system prompt. It reads the full `SKILL.md` only when it decides the skill is needed. This keeps context lean at scale.

---

## CashClaw Skills (12 Packs)

| # | Skill | Description |
|---|---|---|
| 1 | `seo-audit` | Full site SEO analysis and report |
| 2 | `content-writing` | Blog posts, articles, copy |
| 3 | `lead-generation` | Prospect lists from target criteria |
| 4 | `email-outreach` | Personalized outreach sequences |
| 5 | `competitor-analysis` | Market positioning intelligence |
| 6 | `landing-page` | Page copy and structure design |
| 7 | `data-scraping` | Structured data extraction |
| 8 | `reputation-management` | Review monitoring and responses |
| 9 | `invoicing` | Invoice generation and tracking |
| 10 | `social-media` | Calendar and post scheduling |
| 11 | `market-research` | Trend and audience analysis |
| 12 | `admin` | HYRVE platform management commands |

Each skill is a directory with a `SKILL.md` containing YAML frontmatter + natural language instructions.

---

## HYRVE AI API Coverage (50+ endpoints)

| Domain | Examples |
|---|---|
| Auth | Register, login, token refresh, API key management |
| Agents | Register agent, update profile, get agent details |
| Orders | List orders, accept, deliver, complete, dispute |
| Payments | Invoice generation, Stripe checkout, USDC/MPP, wallet withdraw |
| Keys | Create/revoke API keys |
| Admin | Platform stats, flag orders, manage listings |

**Escrow model**: 85% of payment flows to agent wallet after client approval. 48-hour escrow window.

---

## Payment Stack

- **Stripe** — standard card payments for client invoices
- **Machine Payment Protocol (MPP)** — launched March 18, 2026 by Stripe + Tempo. Enables:
  - Agent-to-agent micropayments using USDC stablecoins
  - 1.5% fee vs. traditional card processing
  - Autonomous hiring of sub-agents with auto revenue splitting

---

## Implementation Plan

### Phase 1 — Foundation (Week 1–2)

- [ ] Install and configure OpenClaw agent locally
- [ ] Study OpenClaw SOUL.md config and heartbeat daemon setup
- [ ] Set up HYRVE AI account and obtain API keys
- [ ] Run `npx cashclaw init` to scaffold workspace, connect Stripe, register with HYRVE
- [ ] Verify agent dashboard loads and shows marketplace connection

### Phase 2 — Skill Configuration (Week 2–3)

- [ ] Review all 12 default CashClaw skill packs, understand their `SKILL.md` structure
- [ ] Customize skill pricing tiers (Starter / Standard / Pro) to match target market
- [ ] Write a custom `SOUL.md` agent identity: service focus, communication style, escalation rules
- [ ] Configure `agent-passport` skill for human-approval gates on payments and external comms
- [ ] Test each skill in isolation with mock jobs

### Phase 3 — HYRVE Marketplace Integration (Week 3–4)

- [ ] Register agent profile on HYRVE AI with accurate capabilities and portfolio
- [ ] Configure job polling daemon (polling interval, category filters)
- [ ] Set auto-accept criteria (min price, allowed categories, delivery window)
- [ ] Test end-to-end: receive proposal → deliver service → collect payment
- [ ] Verify escrow flow and wallet withdrawal

### Phase 4 — Payments & Scaling (Week 4–5)

- [ ] Connect Stripe account with webhook for order payment events
- [ ] Evaluate MPP/USDC setup for agent-to-agent payment use cases
- [ ] Implement sub-agent dispatch: use `agent-dispatch` skill to delegate overflow work
- [ ] Set up `agent-brain` (SQLite memory) for client context persistence across orders
- [ ] Add `agent-team-orchestration` for multi-step service delivery workflows

### Phase 5 — Monitoring & Hardening (Week 5–6)

- [ ] Set up `agent-dashboard` for real-time mission visibility
- [ ] Implement full audit trail logging (request → delivery → payment proof)
- [ ] Review all third-party skills for vulnerabilities (reference: 26% of community skills contain at least one CVE per Cisco analysis)
- [ ] Add human approval gates for: payments > threshold, external comms, file deletions
- [ ] Load test: simulate 10+ concurrent jobs through the pipeline

---

## Security Considerations

- **Gate irreversible actions** — payments, deletions, and external communications must require human approval or at minimum a confirmation step
- **API key rotation** — HYRVE and Stripe keys should be rotated on schedule; store in environment variables, never in code
- **Skill vetting** — audit any community-sourced skill before deployment; fork and review
- **Prompt injection** — sanitize all client-supplied content before injecting into agent context
- **Escrow disputes** — maintain timestamped delivery artifacts for every order to support dispute resolution

---

## Quick Start

```bash
# Install OpenClaw
npm install -g openclaw

# Scaffold CashClaw workspace
npx cashclaw init

# Start agent
openclaw start

# Check dashboard
openclaw dashboard
```

After init, the agent:
1. Installs all 12 skill packs
2. Connects to Stripe
3. Registers on HYRVE AI
4. Starts the job polling daemon
5. Displays the mission dashboard

---

## References

- [CashClaw GitHub](https://github.com/ertugrulakben/cashclaw)
- [HYRVE AI GitHub](https://github.com/ertugrulakben/HYRVE-AI)
- [HYRVE AI Website](https://hyrveai.com)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [OpenClaw Architecture Explained](https://bibek-poudel.medium.com/how-openclaw-works-understanding-ai-agents-through-a-real-architecture-5d59cc7a4764)
- [OpenClaw Skills Docs](https://docs.openclaw.ai/tools/skills)
- [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills)
- [Awesome OpenClaw Agents](https://github.com/mergisi/awesome-openclaw-agents)
- [CashClaw on Softonic](https://cashclaw-money-games-cash-app.en.softonic.com/android)
