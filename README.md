<div align="center">

# ⚡ FableFlow 5.1

**The Fable 5.1 Multi-Agent Architect & Invariant Verification Studio for Claude Code, Cursor & Web.**

[![Live Visual Studio](https://img.shields.io/badge/Live%20Studio-Explore%20Now-38bdf8?style=for-the-badge&logo=googlechrome)](https://jastfan.github.io/fable-flow/)
[![npm package](https://img.shields.io/badge/npm-fable--flow%20v1.0.0-cb3837?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/fable-flow)
[![MCP Protocol](https://img.shields.io/badge/MCP%20Server-Standard-10b981?style=for-the-badge&logo=anthropic)](https://modelcontextprotocol.io/)
[![CI Tests](https://img.shields.io/badge/Tests-Passing-10b981?style=for-the-badge&logo=githubactions)](test/test-mcp.js)
[![License MIT](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

<sub>⚡ Zero-Dependency MCP Server • 4-Stage Execution Ladder • 100% Free & Open Source • Maintained by [@jastfan](https://github.com/jastfan)</sub>

<br/>

```bash
# ⚡ 1-Click Coding Agent Integration (Claude Code)
claude mcp add fable-flow -- npx -y fable-flow
```

<br/>

👉 **[Launch the Live FableFlow Visual Studio](https://jastfan.github.io/fable-flow/)** to simulate task decomposition, adversarial bug injection, and invariant gates in real-time.

</div>

---

## 📑 Table of Contents

- [Why FableFlow? The Verification Bottleneck](#-why-fableflow-the-verification-bottleneck)
- [The 4-Stage Architecture Ladder](#-the-4-stage-architecture-ladder)
- [Architectural Comparison: Pros & Cons](#-architectural-comparison-pros--cons)
- [Exposed MCP Server Tools (Backend Engine)](#-exposed-mcp-server-tools-backend-engine)
- [Interactive Visual Studio (Frontend Engine)](#-interactive-visual-studio-frontend-engine)
- [1-Click IDE & Agent Setup](#-1-click-ide--agent-setup)
- [Local Setup & Development Guide](#-local-setup--development-guide)
- [GitHub Repository Setup & Push Guide](#-github-repository-setup--push-guide)
- [Automated CI/CD Invariant Gate](#-automated-cicd-invariant-gate)
- [Contributing Guidelines](#-contributing-guidelines)
- [License & Authorship](#-license--authorship)

---

## 🚀 Why FableFlow? The Verification Bottleneck

Autonomous coding agents (Claude Code, Cursor, Codex) are extraordinarily fast at writing code, but they consistently suffer from the **Verification Bottleneck**:

1. **Happy-Path Blindness**: Agents rush into typing code within seconds, silently ignoring **tacit invariants** (such as idempotency, bounded memory buffers, timing-safe hashes, and race conditions).
2. **Self-Fulfilling Test Hallucinations**: When asked to write tests, agents generate unit tests that merely verify the agent's *own flawed assumptions*, giving developers a false sense of security.
3. **High Regression Rate**: Studies show up to **52%** of unconstrained agent-generated patches introduce regressions in subtle edge states.

### The FableFlow Solution: The Fable 5.1 Architect Pattern

FableFlow decouples **Architectural Specification** from **Worker Implementation**:

```
[Developer Prompt]
       │
       ▼
[Stage 1: Claude Fable 5.1 Architect] ──► Extracts Tacit Invariants & Binds Task Contract
       │
       ▼
[Stage 2: Worker Subagent Lanes]       ──► Implements Code Diff (Sonnet, GPT-5.6, DeepSeek)
       │
       ▼
[Stage 3: Adversarial Invariant Gate]  ──► Tests Invariants with Failure Injection (Pass or Block)
       │
       ▼
[Stage 4: Certified Provenance Worklog]──► Generates Tamper-Proof Audit Record for PR/Merge
```

---

## 📊 Architectural Comparison: Pros & Cons

Why FableFlow 5.1 outclasses raw coding agents and heavy alternative orchestrators:

| Feature Dimension | Raw Coding Agent | Other Fable Tools (`fable-orchestrator`) | ⚡ FableFlow 5.1 (Ours) |
|---|---|---|---|
| **Cost & API Keys** | Burns expensive tokens blindly | Requires Paid Anthropic/OpenAI API keys ($20+/mo) | **100% Free & Zero-Dependency ($0 Cost)** |
| **Tacit Invariant Detection** | ❌ Blind (happy-path only) | ⚠️ Text prompt guidelines only | **✔ Formal Invariant Extraction & Gate Gating** |
| **Visual Verification Studio** | ❌ None (CLI/Terminal only) | ❌ None (Terminal only) | **✔ 4-Stage High-Contrast Dark Web Studio** |
| **Adversarial Bug Simulation** | ❌ Hallucinates self-verifying tests | ❌ Static assertions only | **✔ Real-Time Invariant Failure Injection** |
| **Zero-Config MCP Server** | ❌ Proprietary chat UI | ⚠️ Complex Python environment setup | **✔ Native Node.js JSON-RPC MCP Server** |
| **1-Click Export Hub** | ❌ None | ❌ None | **✔ Export to `.cursorrules`, `SKILL.md`, CI/CD** |
| **Automated PR Invariant Gate** | ❌ None | ❌ None | **✔ 1-Click GitHub Actions Invariant Gate** |

---

## 🛠️ Exposed MCP Server Tools (Backend Engine)

The backend is a **zero-dependency, native Node.js Model Context Protocol (MCP) server** operating over standard I/O (`stdio`) using JSON-RPC 2.0.

### 1. `fable_decompose_prompt`
Decomposes complex developer prompts into binding task contracts with explicit and tacit invariants.
```json
// Input:
{
  "task_description": "Implement password reset with single-use tokens",
  "domain": "auth"
}
```
**Output**: Structured contract containing objective, multi-agent lane map, and list of tacit invariants to guard (e.g. single-use atomic invalidation, constant-time comparison).

### 2. `fable_verify_invariants`
Executes an adversarial verification checklist on proposed code diffs before allowing the subagent to mark the task completed.
```json
// Input:
{
  "code_diff": "...",
  "invariants": ["Idempotency", "Bounded Memory", "Timing-Safe Comparison"]
}
```
**Output**: Gate evaluation report (`PASSED` or `REJECTED`) with granular evidence for each invariant.

### 3. `fable_audit_pipeline`
Static AST & regex security scan that inspects code for common architectural hazards:
- **Timer / Resource Leaks**: Detects `setInterval`/`setTimeout` without cancellation.
- **Unhandled Exceptions**: Detects naked `await` calls missing `try/catch` fallbacks.
- **Missing Idempotency**: Detects auth/session mutations without atomic guards.

### 4. `fable_generate_worklog`
Emits an immutable, certified provenance audit worklog ready to be attached to Git commit messages or GitHub Pull Request summaries.

---

## 🎨 Interactive Visual Studio (Frontend Engine)

Built with high-performance Vanilla HTML5, CSS3, and JavaScript (zero build step, zero bundling lag).

- **4 Real-World Presets**:
  1. 🔒 **Auth Single-Use Token**: Demonstrates atomic invalidation and timing-safe comparison.
  2. ⚡ **Bounded Stream O(1)**: Telemetry ingestion with ring backpressure and zero memory leaks.
  3. 🗄️ **Zero-Downtime Migration**: PostgreSQL schema evolution with `CONCURRENTLY` non-blocking indexing.
  4. 🎬 **Agent Video Timeline**: Browser-based JSON canvas video sequencer.
- **Simulation Modes**:
  - **🛡️ Contract Pass**: Simulates compliant worker subagent adhering to all contracts.
  - **⚠️ Inject Bug (Fail Gate)**: Simulates a subtle race condition or memory leak; watches Stage 3 turn **CRITICAL RED** and block delivery!
- **1-Click Export Hub**:
  - Instant clipboard export for `.cursorrules`, Claude Code `SKILL.md`, GitHub Actions workflow, and Provenance JSON.

---

## ⚡ 1-Click IDE & Agent Setup

### 1. Claude Code
Run this single command in your terminal:
```bash
claude mcp add fable-flow -- npx -y fable-flow
```

### 2. Cursor IDE (`.cursor/mcp.json`)
Add to your project's `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "fable-flow": {
      "command": "npx",
      "args": ["-y", "fable-flow"]
    }
  }
}
```

### 3. Antigravity IDE (`mcp_config.json`)
Add to your `mcp_config.json`:
```json
{
  "mcpServers": {
    "fable-flow": {
      "command": "npx",
      "args": ["-y", "fable-flow"]
    }
  }
}
```

---

## 💻 Local Setup & Development Guide

You can run both the **Backend MCP Server** and the **Frontend Visual Studio** locally with zero setup hassle.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Python 3](https://python.org) (optional, for simple static server) or any local HTTP server

### 1. Clone the Repository
```bash
git clone https://github.com/jastfan/fable-flow.git
cd fable-flow
```

### 2. Test the Backend MCP Server
Run the built-in self-test suite (validates all 4 MCP tools via JSON-RPC 2.0 in < 1 second):
```bash
npm test
```

To run the MCP server directly:
```bash
npm start
# Or: node mcp-server.js
```

### 3. Run the Frontend Visual Studio
Start a local static server:
```bash
# Using Python:
python -m http.server 3000

# Or using Node:
npx serve .
```
Now open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 GitHub Repository Setup & Push Guide

If you are initializing or pushing changes from your own machine:

```bash
# 1. Initialize git (if new)
git init
git branch -M main

# 2. Stage all project files
git add .

# 3. Create a clean commit
git commit -m "feat: initial commit of FableFlow 5.1 Multi-Agent Architect Studio"

# 4. Link your remote repository
git remote add origin https://github.com/jastfan/fable-flow.git

# 5. Push to GitHub
git push -u origin main
```

### Deploying to GitHub Pages
1. In your GitHub repository, go to **Settings** ➔ **Pages**.
2. Under **Build and deployment** ➔ **Source**, select **GitHub Actions** (or Deploy from branch `main`).
3. Your live visual studio will be live at:
   `https://<your-username>.github.io/fable-flow/`

---

## 🛡️ Automated CI/CD Invariant Gate

Block buggy PRs automatically. Add `.github/workflows/fable-gate.yml` to your repository:

```yaml
name: FableFlow Invariant Gate
on: [pull_request, push]

jobs:
  invariant-gate:
    name: Adversarial Invariant Verification
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run FableFlow MCP Test Suite
        run: |
          node test/test-mcp.js
          echo "✔ All Fable 5.1 architectural invariants verified clean."
```

---

## 🤝 Contributing Guidelines

We welcome community contributions! To contribute:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/awesome-new-preset
   ```
3. **Adhere to the Fable Invariant Standard**:
   - Zero external runtime npm dependencies for `mcp-server.js`.
   - Maintain client-side compatibility for the web studio.
4. **Run Verification Tests**:
   ```bash
   npm test
   ```
5. **Submit a Pull Request** with a detailed architectural worklog.

---

## 📄 License & Authorship

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete details.

- **Author & Maintainer**: [@jastfan](https://github.com/jastfan)
- **Architecture**: Inspired by the Claude Fable 5.1 Multi-Agent Design Pattern.
- **Repository**: [https://github.com/jastfan/fable-flow](https://github.com/jastfan/fable-flow)