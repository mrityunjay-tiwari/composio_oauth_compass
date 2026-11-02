# Composio OAuth Compass 🧭
### The Autonomous Integration Launchpad & BYOC Guide for AI Agents

> **Built for the Composio APM Integrations Take-Home Assignment**  
> Helping developers and agent builders navigate the path between Day-0 Prototyping (Composio Managed Auth) and Enterprise Production (Custom OAuth App / BYOC).

---

## 🚀 Live Experience & Demo

- **Live Production App:** [https://composio-oauth-compass.vercel.app](https://composio-oauth-compass.vercel.app) *(or run locally below)*
- **GitHub Repository:** [https://github.com/mrityunjay/composio-oauth-compass](https://github.com/mrityunjay/composio-oauth-compass)

---

## 💡 Executive Summary & Problem Understanding

Today, developers building AI agents on Composio face a severe drop-off point when moving from prototype to production:

```
[Day 0: Prototyping] ───> Uses Composio Managed Auth ───> 2-minute setup, shared keys & branding
                                                                  │
                                                                  ▼
[Day 14+: Production] ──> Must Switch to Custom OAuth (BYOC) ────> HITS A 4-WEEK BRICK WALL:
                          • Google Cloud: 3-4 week review + unlisted YouTube video
                          • Scope Penalty: $3k–$15k CASA Tier 2 third-party audit
                          • The 7-Day Trap: Testing mode refresh tokens expire in 7 days
                          • Slack: Confusion between Bot scopes vs User scopes
                          • Spotify: Hard quota cap at 25 users
```

### The 4 Core Bottlenecks
1. **The "Time-to-First-Token" vs. "Time-to-Production" Illusion**: Setting up credentials locally takes 15 minutes, but getting approved to serve external users can take 3 to 6 weeks of manual compliance reviews.
2. **The "Scope Penalty" ($15,000 CASA Audits)**: Choosing `gmail.modify` instead of `gmail.send` triggers an annual independent security assessment costing thousands of dollars. Documentation never warns developers upfront.
3. **The 7-Day Silent Token Expiry**: Google Cloud OAuth apps in "Testing" mode silently revoke refresh tokens after 7 days, causing AI agent cron jobs to mysteriously fail every Sunday night.
4. **Documentation Drift**: Provider developer portals (Google, Slack, X/Twitter, Salesforce) change their UIs and scope names every few quarters. Static markdown guides decay within months.

---

## 🎯 Product Decisions & Architecture

Instead of building a fragile browser scraper (which fails on 2FA and violates provider TOS) or a generic chatbot (which hallucinates scopes and costs customers weeks of review delays), **Composio OAuth Compass** is architected around four product pillars:

### 1. Friction & Readiness Radar
Every integration is graded across 5 tangible dimensions:
- **Hands-on Setup Time** (e.g. 10m vs 45m)
- **Approval Wait Time** (0 days instant vs 24 days)
- **Financial Cost** ($0 vs CASA assessor fees)
- **Review Type** (None, Workspace Admin, App Directory, or CASA Tier 2)
- **Friction Score** (1.0/5.0 to 5.0/5.0)

### 2. Autonomous Real-Time Investigation Agent (Requirement #1)
When an evaluator or developer submits an unfamiliar app (e.g., `Airtable`, `Linear`, `HubSpot`, `Discord`, or any raw doc URL):
1. **Targeted Doc Discovery**: Queries Tavily / Brave search engines to discover the canonical OAuth 2.0 developer guide.
2. **Headless Ingestion via Jina Reader (`r.jina.ai`)**: Bypasses client-side React/Docusaurus rendering and converts documentation to clean, structured markdown in under 1.5 seconds.
3. **Structured Schema Synthesis**: Extracts auth endpoints, PKCE mandates, token rotation rules, and review gates.
4. **Composio Translation**: Reverse-engineers extracted scopes into Composio tool actions and generates a 1-click `composio_auth_config.json`.

### 3. Agent vs. Human Boundary Matrix
Clearly demarcates responsibilities so developers know exactly what can be automated versus where they must take over:
- **What the Agent Automates:** Generates Slack manifests, formats Composio BYOC configs, minimizes scopes to avoid CASA audits, and drafts reviewer justification statements.
- **Where Humans Must Take Over:** Credit card/billing activation, DNS TXT record domain verification in Google Search Console, recording unlisted YouTube screencasts, and 2FA authentication.

### 4. Interactive Scope Minimizer
An interactive widget where agent builders check off desired tools (e.g., `GMAIL_SEND_EMAIL` vs `GMAIL_DELETE_EMAIL`). The engine recalculates the least-privilege scopes in real time and alerts the builder if a restricted scope triggers a CASA Tier 2 third-party audit.

---

## ⚖️ Ground Truth & Evidence Audit (Requirement #2)

Official documentation only describes the provider's "happy path." We rigorously tested setup attempts and cataloged the discrepancies:

| Provider | Official Doc Claim | Tested Developer Reality (The Trap) | How OAuth Compass Solves It |
| :--- | :--- | :--- | :--- |
| **Google Cloud** | *"Register consent screen and start testing."* | **7-Day Token Expiry**: In "Testing" status, Google silently revokes refresh tokens after 7 days. Agent background jobs die weekly. | Prompts developers to publish to "In Production" with internal/test users to get non-expiring tokens. |
| **Google (Scopes)** | *"Select requested scopes (e.g. `gmail.modify`)."* | **The \$15,000 CASA Trap**: `gmail.modify` triggers a mandatory CASA Tier 2 third-party security audit (\$3k–\$15k / 4 weeks). | Recommends `gmail.send` (Sensitive only), bypassing CASA Tier 2 and launching in under 2 weeks. |
| **Slack API** | *"Submit your app for review before distributing."* | **App Directory Illusion**: You do NOT need the 2-week App Directory review for multi-workspace installs. | Instructs developers to toggle "Public Distribution" directly, reducing wait time from 14 days to 0 minutes. |
| **Spotify Web API** | *"Authenticate users with Authorization Code grant."* | **25-User Quota Gate**: Development mode is hard-capped to 25 manual email whitelist slots. User #26 receives a cryptic 403 error. | Flags the quota gate upfront so teams submit the Extension Request during early beta. |
| **Salesforce** | *"Create Connected App and connect immediately."* | **10-Minute Cluster Lag**: For 2–10 minutes after creation, OAuth calls fail with `invalid_client_id` while keys replicate globally. | Built-in warning explaining replication delay so developers don't waste hours debugging valid code. |

---

## 🔌 Composio Integration & BYOC Alignment

This project directly aligns with Composio's core primitives as documented in:
- [Composio Managed Auth Documentation](https://docs.composio.dev/toolkits/managed-auth)
- [Hosted Authentication & Connect Links](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link)

Every generated guide exports the exact **Composio Auth Config JSON** and SDK code:

```python
from composio import Composio

composio = Composio()

# 1. Register Custom Auth Config (BYOC)
auth_config = composio.auth_configs.create(
    app="slack",
    credentials={
        "client_id": "YOUR_SLACK_CLIENT_ID",
        "client_secret": "YOUR_SLACK_CLIENT_SECRET"
    }
)

# 2. Generate Hosted Connect Link for User
connection = composio.connected_accounts.link(
    user_uuid="user_p7a89x",
    auth_config_id=auth_config.id
)

print("Direct user to authenticate:", connection.redirect_url)
```

---

## 🛠️ Local Setup & Development

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- `pnpm` or `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/mrityunjay/composio-oauth-compass.git
cd composio-oauth-compass

# Install dependencies
pnpm install # or npm install

# Configure Environment Variables (.env.local)
# Optional: Add keys for live search & extraction (built-in fallbacks provided)
OPENROUTER_API_KEY="your-openrouter-key"
TAVILY_API_KEY="your-tavily-key"
JINA_API_KEY="your-jina-key"

# Run development server
pnpm dev # or npm run dev
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 🔮 Limitations & Future Roadmap

1. **Automated Token Health Heartbeats**: Extend the engine to actively poll and test if a provider's refresh token has expired, providing real-time uptime monitors for BYOC apps.
2. **Direct Composio CLI Sync**: A 1-click command (`composio auth sync --app linear`) that pulls the generated AuthConfig straight into the developer's local environment.
3. **CASA Self-Assessment Assistant**: An automated compliance generator that drafts answers to the 40+ security questions required by Google's CASA Tier 1 questionnaire.

---

## 👨‍💻 Submission Details
- **Role:** APM - Integrations & Developer Platform
- **Company:** Composio
- **Author:** Candidate Submission
