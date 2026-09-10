/**
 * FableFlow 5.1 — Master Studio Simulation & Interactive Engine
 * Author: jastfan
 * License: MIT
 */

const PRESETS = {
  auth: {
    prompt: "Implement password reset token endpoint with strict single-use invariant, rate-limiting, and timing-safe token verification.",
    stage1: {
      contract: "CONTRACT: AuthPasswordResetVerification",
      objective: "Produce an idempotent, single-use password reset flow immune to replay attacks.",
      invariants: [
        "Single-use token invalidation immediately upon consumption (prevent replay remounts)",
        "Constant-time token hash comparison (mitigate side-channel timing attacks)",
        "Strict 15-minute token TTL with deterministic expiry",
        "Zero token leakage in server logs or client-facing responses"
      ]
    },
    stage2: {
      worker: "Worker Lane (GPT-5.6 / Sonnet)",
      dispatchPass: "Generated 3 files: /api/reset-token.ts, /auth/token-validator.ts, /tests/replay.test.ts",
      dispatchFail: "Worker patch omitted atomic invalidation; token marked used AFTER async email trigger (240ms race window)."
    },
    stage3Pass: [
      { name: "Replay Attack Invariant (2nd click must fail 401)", status: "PASSED", detail: "Verified atomic single-use state mutation." },
      { name: "Constant-Time Hash Comparison check", status: "PASSED", detail: "crypto.timingSafeEqual() validated across 10k trials." },
      { name: "Expired Token Boundary Check (15m + 1s)", status: "PASSED", detail: "Expired tokens rejected with zero DB mutation." },
      { name: "Zero Unhandled Exception Swallowing", status: "PASSED", detail: "Fail-closed try/catch wrapper in place." }
    ],
    stage3Fail: [
      { name: "Replay Attack Invariant (2nd click must fail 401)", status: "FAILED", detail: "VIOLATION: Concurrent POST requests within 240ms both succeeded (Double-spend exploit)." },
      { name: "Constant-Time Hash Comparison check", status: "PASSED", detail: "crypto.timingSafeEqual() passed." },
      { name: "Expired Token Boundary Check (15m + 1s)", status: "PASSED", detail: "Expiry check passed." },
      { name: "Zero Unhandled Exception Swallowing", status: "PASSED", detail: "Fail-closed check passed." }
    ],
    stage4Pass: "CERTIFIED: AuthPasswordResetVerification meets all Fable 5.1 invariants. Safe to merge into main.",
    stage4Fail: "REJECTED: Replay invariant violation detected! Subagent instructed to convert to atomic SQL transaction before re-evaluation."
  },
  stream: {
    prompt: "Design a high-throughput telemetry ingestion pipeline for IoT edge gateways handling 100k events/sec under cellular packet jitter.",
    stage1: {
      contract: "CONTRACT: EdgeStreamBoundedIngestion",
      objective: "Provide lock-free streaming telemetry with deterministic O(1) memory guarantees.",
      invariants: [
        "Bounded memory buffers under sink stall (prevent gateway OOM killer panics)",
        "Two-stage backpressure: TCP window pushback + Lagged(n) ring buffer fallback",
        "Deterministic drop counters exposed via Prometheus metrics",
        "Zero GC stop-the-world latency jitter"
      ]
    },
    stage2: {
      worker: "Systems Lane (Rust / Tokio Actor Bus)",
      dispatchPass: "Generated StreamBus actor, bounded mpsc sink queues, and Lagged(n) frame metrics.",
      dispatchFail: "Worker allocated unbounded unbounded_channel() for edge buffering during network lag."
    },
    stage3Pass: [
      { name: "O(1) Heap Cap invariant under 100k eps burst", status: "PASSED", detail: "Heap clamped at 7.8MB maximum under 30s stall." },
      { name: "Two-Stage TCP pushback trigger on sink delay", status: "PASSED", detail: "Backpressure signaled to sender on 80% queue saturation." },
      { name: "Metric drop auditability (rekuiper_dropped_events_total)", status: "PASSED", detail: "Drop counter verified strictly monotonic." },
      { name: "Zero runtime memory leak on continuous test", status: "PASSED", detail: "Zero dangling references after channel drop." }
    ],
    stage3Fail: [
      { name: "O(1) Heap Cap invariant under 100k eps burst", status: "FAILED", detail: "VIOLATION: Memory ballooned to 284MB in 12s under sink stall. OOM killer would terminate process." },
      { name: "Two-Stage TCP pushback trigger on sink delay", status: "PASSED", detail: "Signal triggered." },
      { name: "Metric drop auditability", status: "PASSED", detail: "Counters registered." },
      { name: "Zero runtime memory leak on continuous test", status: "PASSED", detail: "No persistent leaks found." }
    ],
    stage4Pass: "CERTIFIED: EdgeStreamBoundedIngestion delivers 425k eps at 8MB RAM. Invariants locked.",
    stage4Fail: "REJECTED: Unbounded queue violation detected. Invariant Gate requires bounded mpsc channel with explicit Drop policy."
  },
  db: {
    prompt: "Execute zero-downtime database column split on 50M row users table with dual-writing and automated rollback triggers.",
    stage1: {
      contract: "CONTRACT: ZeroDowntimeDualWriteMigration",
      objective: "Safely transition user schema without locking production database or dropping queries.",
      invariants: [
        "Non-blocking index creation (CONCURRENTLY in PostgreSQL)",
        "Dual-write phase with automated shadow validation",
        "Safe rollback script that operates without data truncation",
        "Read replica replication lag remains under 200ms"
      ]
    },
    stage2: {
      worker: "Database Architect Lane",
      dispatchPass: "Generated 0042_dual_write_schema.sql, background shadow backfill worker, and rollback playbook.",
      dispatchFail: "Worker generated CREATE INDEX without CONCURRENTLY keyword, inducing ACCESS EXCLUSIVE lock."
    },
    stage3Pass: [
      { name: "Lock duration assertion (< 50ms on migration run)", status: "PASSED", detail: "Max lock duration recorded: 14ms." },
      { name: "Dual-write sync equality check (100k sample diff)", status: "PASSED", detail: "Shadow sync parity verified 100.00%." },
      { name: "Shadow rollback execution verification", status: "PASSED", detail: "Rollback script validated without schema lock." },
      { name: "Zero transaction isolation anomaly detection", status: "PASSED", detail: "Serializable snapshot isolation preserved." }
    ],
    stage3Fail: [
      { name: "Lock duration assertion (< 50ms on migration run)", status: "FAILED", detail: "VIOLATION: Migration attempted ACCESS EXCLUSIVE table lock for 4,200ms, risking query cascade timeouts." },
      { name: "Dual-write sync equality check", status: "PASSED", detail: "Sync parity passed." },
      { name: "Shadow rollback execution verification", status: "PASSED", detail: "Rollback script valid." },
      { name: "Zero transaction isolation anomaly detection", status: "PASSED", detail: "Isolation preserved." }
    ],
    stage4Pass: "CERTIFIED: ZeroDowntimeDualWriteMigration ready for staged blue-green release.",
    stage4Fail: "REJECTED: Exclusive lock invariant failed. Re-run worker with CONCURRENTLY indexing directive."
  },
  video: {
    prompt: "Build an in-browser AI video timeline editor driven by Claude Code MCP tool calls with canvas preview and track stitching.",
    stage1: {
      contract: "CONTRACT: AgentVideoTimelineEngine",
      objective: "Expose deterministic JSON timeline manipulation tools for autonomous coding agents.",
      invariants: [
        "Zero-dependency browser client (HTML5 Canvas + Web Audio)",
        "Strict JSON schema contract for cut/trim/caption actions",
        "Deterministic frame rendering without drift over 60s playback",
        "Idempotent undo/redo history stack"
      ]
    },
    stage2: {
      worker: "Media & Canvas Lane",
      dispatchPass: "Generated timeline.js, canvas-renderer.js, and mcp-video-tools.js definitions.",
      dispatchFail: "Worker accumulated floating-point timestamp drift on canvas requestAnimationFrame loop."
    },
    stage3Pass: [
      { name: "Agent JSON schema validation gate", status: "PASSED", detail: "100% valid schema compliance across all actions." },
      { name: "Frame alignment assertion at 60 FPS", status: "PASSED", detail: "Zero audio-video sync drift measured over 120s." },
      { name: "Undo/Redo state snapshot preservation", status: "PASSED", detail: "History depth 50 tested with zero state mutation." },
      { name: "Zero memory leak on canvas buffer reuse", status: "PASSED", detail: "Canvas ImageData buffers recycled cleanly." }
    ],
    stage3Fail: [
      { name: "Agent JSON schema validation gate", status: "PASSED", detail: "Schema validated." },
      { name: "Frame alignment assertion at 60 FPS", status: "FAILED", detail: "VIOLATION: Timestamp drift accumulated 184ms desync at t=45s. AV sync invariant violated." },
      { name: "Undo/Redo state snapshot preservation", status: "PASSED", detail: "Snapshots intact." },
      { name: "Zero memory leak on canvas buffer reuse", status: "PASSED", detail: "Buffer reuse clean." }
    ],
    stage4Pass: "CERTIFIED: AgentVideoTimelineEngine validated for Claude Code & Cursor tool calls.",
    stage4Fail: "REJECTED: AV frame desync invariant violated. Worker must use audioContext.currentTime as absolute clock."
  }
};

let currentPresetKey = 'auth';
let currentAuditMode = 'pass'; // 'pass' or 'fail'

function setAuditMode(mode) {
  currentAuditMode = mode;
  const btnPass = document.getElementById('modeBtnPass');
  const btnFail = document.getElementById('modeBtnFail');
  
  if (mode === 'pass') {
    btnPass.classList.add('active');
    btnFail.classList.remove('active');
  } else {
    btnFail.classList.add('active');
    btnPass.classList.remove('active');
  }
  resetPipelineDisplay();
}

function selectPreset(key) {
  currentPresetKey = key;
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }

  const preset = PRESETS[key];
  if (preset) {
    document.getElementById('taskInput').value = preset.prompt;
    resetPipelineDisplay();
  }
}

function resetPipelineDisplay() {
  const statusBadge = document.getElementById('pipelineStatusBadge');
  statusBadge.className = 'pipeline-status';
  statusBadge.innerText = 'Ready for Execution';

  for (let i = 1; i <= 4; i++) {
    const card = document.getElementById(`stage${i}Card`);
    card.className = 'pipeline-stage-card';
    const body = document.getElementById(`stage${i}Body`);
    body.innerHTML = `<p class="placeholder-text">Click 'Run FableFlow Architect Pipeline'...</p>`;
  }
}

async function runArchitectSimulation() {
  const btn = document.getElementById('runFlowBtn');
  const statusBadge = document.getElementById('pipelineStatusBadge');
  const taskText = document.getElementById('taskInput').value.trim();
  const preset = PRESETS[currentPresetKey] || PRESETS.auth;
  const isPass = currentAuditMode === 'pass';

  btn.disabled = true;
  statusBadge.className = 'pipeline-status running';
  statusBadge.innerText = isPass 
    ? '⚡ Fable 5.1 Orchestrating...' 
    : '⚠️ Running Invariant Gate with Injected Bug...';

  // Check if user has connected a live LLM
  let liveAiResult = null;
  try {
    liveAiResult = await callLiveBrowserLLM(taskText);
  } catch (err) {
    console.warn('Live LLM call error, using local simulation:', err.message);
  }

  // STAGE 1: Architect Decomposition
  const stage1Card = document.getElementById('stage1Card');
  stage1Card.className = 'pipeline-stage-card active';

  if (liveAiResult) {
    document.getElementById('stage1Body').innerHTML = `
      <div class="contract-box">
        <div class="contract-title">LIVE INFERENCE: ${liveAiResult.provider}</div>
        <pre style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.8rem; color: #e2e8f0; margin-top: 8px;">${liveAiResult.text}</pre>
      </div>
    `;
  } else {
    document.getElementById('stage1Body').innerHTML = `
      <div class="contract-box">
        <div class="contract-title">${preset.stage1.contract}</div>
        <p><strong>Objective:</strong> ${preset.stage1.objective}</p>
        <ul class="invariants-list">
          ${preset.stage1.invariants.map(inv => `<li><span class="bullet">🛡️</span> <span>${inv}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }
  await sleep(600);
  stage1Card.className = 'pipeline-stage-card passed';

  // STAGE 2: Subagent Allocation
  const stage2Card = document.getElementById('stage2Card');
  stage2Card.className = 'pipeline-stage-card active';
  const dispatchText = isPass ? preset.stage2.dispatchPass : preset.stage2.dispatchFail;
  const noteText = isPass 
    ? '<p style="color: var(--accent-cyan); margin-top: 6px;">Status: Patch generated. Awaiting Stage 3 Invariant Gate.</p>'
    : '<p style="color: var(--accent-rose); margin-top: 6px;">Adversarial Trace: Subagent committed subtle tacit invariant omission.</p>';

  document.getElementById('stage2Body').innerHTML = `
    <div class="contract-box">
      <div class="contract-title">Dispatched to: ${preset.stage2.worker}</div>
      <p>${dispatchText}</p>
      ${noteText}
    </div>
  `;
  await sleep(600);
  stage2Card.className = isPass ? 'pipeline-stage-card passed' : 'pipeline-stage-card';

  // STAGE 3: Adversarial Invariant Gate
  const stage3Card = document.getElementById('stage3Card');
  stage3Card.className = 'pipeline-stage-card active';
  const checks = isPass ? preset.stage3Pass : preset.stage3Fail;

  document.getElementById('stage3Body').innerHTML = `
    <div class="checks-wrapper" style="margin-top: 8px;">
      ${checks.map(c => `
        <div class="check-item ${c.status === 'PASSED' ? 'passed' : 'failed'}">
          <div>
            <strong>${c.name}</strong>
            <p style="font-size: 0.76rem; opacity: 0.85; margin-top: 2px;">${c.detail}</p>
          </div>
          <span class="check-state">${c.status === 'PASSED' ? '✔ PASSED' : '✖ REJECTED'}</span>
        </div>
      `).join('')}
    </div>
  `;
  await sleep(700);

  if (isPass) {
    stage3Card.className = 'pipeline-stage-card passed';
    
    // STAGE 4: Clean Certification
    const stage4Card = document.getElementById('stage4Card');
    stage4Card.className = 'pipeline-stage-card passed';
    document.getElementById('stage4Body').innerHTML = `
      <div class="worklog-box">
## 🛡️ FableFlow Provenance Certification
- **Architect:** Claude Fable 5.1
- **Timestamp:** ${new Date().toISOString()}
- **Result:** ${preset.stage4Pass}
- **Invariants Gate:** 4/4 Evaluated & Passed.
      </div>
    `;

    statusBadge.className = 'pipeline-status complete';
    statusBadge.innerText = '✔ Invariants Certified Clean';
  } else {
    stage3Card.className = 'pipeline-stage-card failed';

    // STAGE 4: Rejection Worklog
    const stage4Card = document.getElementById('stage4Card');
    stage4Card.className = 'pipeline-stage-card failed';
    document.getElementById('stage4Body').innerHTML = `
      <div class="worklog-box rejected">
## 🛑 FableFlow Quality Gate Rejection
- **Auditor:** Fable 5.1 Invariant Gate
- **Timestamp:** ${new Date().toISOString()}
- **Status:** BLOCKED (Zero-Tolerance Invariant Failure)
- **Violation:** ${preset.stage4Fail}
      </div>
    `;

    statusBadge.className = 'pipeline-status failed';
    statusBadge.innerText = '✖ Release Blocked by Invariant Gate';
  }

  btn.disabled = false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function copyClaudeCommand() {
  copyText('claude mcp add fable-flow -- npx -y fable-flow');
  const btn = document.getElementById('quickCopyBtn');
  const tag = btn.querySelector('.copy-tag');
  tag.innerText = 'Copied!';
  setTimeout(() => tag.innerText = 'Copy', 2000);
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

  if (event && event.target) {
    event.target.classList.add('active');
  }
  const map = {
    claude: 'tabClaude',
    cursor: 'tabCursor',
    antigravity: 'tabAntigravity',
    local: 'tabLocal'
  };
  const targetEl = document.getElementById(map[tabId]);
  if (targetEl) targetEl.classList.remove('hidden');
}

// Export Hub Handlers
function exportCursorRules() {
  const rules = `# FableFlow 5.1 Architect Mode for Cursor IDE
You are operating in Fable 5.1 Architect Mode.
Before writing any code or proposing diffs:
1. Decompose the request into explicit and tacit invariants.
2. Invariants must include: Single-use/idempotency, bounded memory, graceful error fallback.
3. You must NOT declare completion until all adversarial verification gates pass.
4. Always provide an audit worklog summarizing verified invariants.`;
  copyText(rules);
  alert('Copied Fable 5.1 .cursorrules to clipboard!');
}

function exportClaudeSkill() {
  const skill = `---
name: fable-flow
description: Enforces the Fable 5.1 Master Architect pattern for autonomous coding agents.
---
# FableFlow 5.1 Architect Protocol
1. [Stage 1] Master Architect decomposes prompt into binding task contracts.
2. [Stage 2] Worker subagents write targeted diffs.
3. [Stage 3] Run adversarial invariant gate: reject any patch with silent assumptions.
4. [Stage 4] Emit certified provenance worklog before merging.`;
  copyText(skill);
  alert('Copied Claude Code SKILL.md to clipboard!');
}

function exportGithubAction() {
  const workflow = `name: FableFlow Invariant Gate
on: [pull_request]

jobs:
  invariant-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Run FableFlow Adversarial Audit
        run: |
          npx -y fable-flow --audit
          echo "All tacit invariants certified clean."`;
  copyText(workflow);
  alert('Copied GitHub Actions CI/CD Workflow to clipboard!');
}

function exportAuditJSON() {
  const preset = PRESETS[currentPresetKey];
  const audit = {
    fable_flow_version: "5.1.0",
    timestamp: new Date().toISOString(),
    audit_mode: currentAuditMode,
    contract: preset.stage1.contract,
    invariants_checked: preset.stage1.invariants,
    verification_status: currentAuditMode === 'pass' ? 'PASSED' : 'REJECTED'
  };
  copyText(JSON.stringify(audit, null, 2));
  alert('Copied Provenance Audit JSON to clipboard!');
}

/* ==========================================================================
   Real LLM Provider & BYOK Connection Logic (Client-Side)
   ========================================================================== */

function getApiConfig() {
  return {
    provider: localStorage.getItem('fable_provider') || 'anthropic',
    apiKey: localStorage.getItem('fable_api_key') || '',
    endpoint: localStorage.getItem('fable_endpoint') || 'http://localhost:11434'
  };
}

function updateApiStatusUI() {
  const config = getApiConfig();
  const statusEl = document.getElementById('navApiStatusText');
  const btn = document.getElementById('navApiBtn');
  if (config.apiKey || (config.provider === 'ollama' && config.endpoint)) {
    const nameMap = { anthropic: 'Claude Live', openai: 'OpenAI Live', deepseek: 'DeepSeek Live', ollama: 'Ollama Live' };
    statusEl.innerText = `${nameMap[config.provider] || 'Live LLM'} Active`;
    btn.style.borderColor = 'var(--accent-emerald)';
    btn.style.color = 'var(--accent-emerald)';
  } else {
    statusEl.innerText = 'Connect Real LLM (BYOK)';
    btn.style.borderColor = 'rgba(56, 189, 248, 0.35)';
    btn.style.color = 'var(--accent-cyan)';
  }
}

function openApiModal() {
  const config = getApiConfig();
  document.getElementById('providerSelect').value = config.provider;
  document.getElementById('apiKeyInput').value = config.apiKey;
  document.getElementById('endpointInput').value = config.endpoint;
  onProviderChange();
  document.getElementById('apiModal').classList.add('active');
}

function closeApiModal() {
  document.getElementById('apiModal').classList.remove('active');
}

function onProviderChange() {
  const provider = document.getElementById('providerSelect').value;
  const isOllama = provider === 'ollama';
  document.getElementById('apiKeyField').style.display = isOllama ? 'none' : 'flex';
  document.getElementById('endpointField').style.display = isOllama ? 'flex' : 'none';
}

function saveApiSettings() {
  const provider = document.getElementById('providerSelect').value;
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  const endpoint = document.getElementById('endpointInput').value.trim();

  localStorage.setItem('fable_provider', provider);
  localStorage.setItem('fable_api_key', apiKey);
  localStorage.setItem('fable_endpoint', endpoint);

  updateApiStatusUI();
  closeApiModal();
  alert(`Connected to ${provider.toUpperCase()}! Your API Key is stored safely in local browser storage.`);
}

function clearApiKey() {
  localStorage.removeItem('fable_provider');
  localStorage.removeItem('fable_api_key');
  localStorage.removeItem('fable_endpoint');
  updateApiStatusUI();
  closeApiModal();
  alert('Disconnected from live API. Running in local high-fidelity sandbox mode.');
}

async function callLiveBrowserLLM(userPrompt) {
  const config = getApiConfig();
  if (!config.apiKey && config.provider !== 'ollama') return null;

  const systemPrompt = `You are Claude Fable 5.1 Master Architect. Decompose the given engineering requirement into:
1. Formal Task Contract
2. Explicit & Tacit Invariants to guard (single-use idempotency, O(1) bounded memory, fail-closed fallback)
3. Multi-Agent lanes (Stage 1 Architect, Stage 2 Worker, Stage 3 Gate, Stage 4 Audit).
Return clean, structured technical analysis.`;

  if (config.provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return { provider: 'Anthropic Claude 3.7 Sonnet', text: data.content[0].text };
  }

  if (config.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return { provider: 'OpenAI GPT-4o', text: data.choices[0].message.content };
  }

  if (config.provider === 'deepseek') {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return { provider: 'DeepSeek Chat', text: data.choices[0].message.content };
  }

  if (config.provider === 'ollama') {
    const res = await fetch(`${config.endpoint.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1',
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return { provider: 'Ollama Local (deepseek-r1)', text: data.message.content };
  }

  return null;
}

// Initialize default preset and API status on load
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('taskInput').value = PRESETS.auth.prompt;
  updateApiStatusUI();
});