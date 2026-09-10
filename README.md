<div align="center">

# ⚡ FableFlow 5.1

**The Fable 5.1 Multi-Agent Architect & Invariant Verification Studio for Claude Code, Cursor & Web.**

[![Live Visual Studio](https://img.shields.io/badge/Live%20Studio-Explore%20Now-38bdf8?style=for-the-badge&logo=googlechrome)](https://jastfan.github.io/fable-flow/)
[![npm package](https://img.shields.io/badge/npm-fable--flow%20v1.0.0-cb3837?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/fable-flow)
[![MCP Protocol](https://img.shields.io/badge/MCP%20Server-Standard-10b981?style=for-the-badge&logo=anthropic)](https://modelcontextprotocol.io/)
[![License MIT](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

<sub>⚡ Zero-Dependency MCP Server • 4-Stage Execution Ladder • Maintained by [@jastfan](https://github.com/jastfan)</sub>

<br/>

```bash
# ⚡ 1-Click Coding Agent Integration (Claude Code)
claude mcp add fable-flow -- npx -y fable-flow
```

<br/>

👉 **[Launch the Live FableFlow Visual Studio](https://jastfan.github.io/fable-flow/)** to simulate task decomposition and invariant gates in real-time.

</div>

---

## 🚀 Why FableFlow?

Traditional coding agents rush to type code immediately. This creates the **Verification Bottleneck**:
- Agents implement the happy path in 5 minutes, but omit **tacit assumptions** (e.g. single-use tokens, memory bounds, error paths).
- Standard AI test generation hallucinates tests that verify the agent's *own flawed assumptions*.

**FableFlow implements the Architect Pattern popularized by Claude Fable 5.1:**
1. **Claude Fable 5.1 acts as the Master Architect:** It specifies requirements, extracts hidden tacit invariants, and establishes a binding task contract.
2. **Worker Subagents Implement:** Execution lanes (GPT-5.6, Sonnet, DeepSeek) write the actual code.
3. **Adversarial Invariant Gate:** Code cannot be marked done until it passes checks that can genuinely **FAIL**.
4. **Clean-Context Delivery:** Generates an evidence-backed provenance worklog.

---

## ⚡ 1-Click Installation (Zero Dependencies)

### 1. Claude Code
```bash
claude mcp add fable-flow -- npx -y fable-flow
```

### 2. Cursor IDE (`.cursor/mcp.json`)
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

## 🛠️ Exposed MCP Tools

| Tool | Description |
|---|---|
| `fable_decompose_prompt` | Decomposes raw developer prompts into task contracts with explicit & tacit invariants. |
| `fable_verify_invariants` | Runs adversarial verification gates on proposed code diffs before delivery. |
| `fable_generate_worklog` | Emits a certified provenance audit worklog for git commits and PR descriptions. |

---

## 🏛️ The 4-Stage Architecture Ladder

```
User Prompt ──► [Stage 1: Fable 5.1 Architect Decomposition]
                     │
                     ▼
             [Stage 2: Worker Subagent Allocation (Lanes)]
                     │
                     ▼
             [Stage 3: Adversarial Invariant Gate (Pass/Fail)]
                     │
                     ▼
             [Stage 4: Certified Provenance Worklog & Code Merge]
```

---

## 📄 License

Maintained with ❤️ by [jastfan](https://github.com/jastfan). Licensed under the [MIT License](LICENSE).