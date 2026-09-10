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
      dispatch: "Generated 3 files: /api/reset-token.ts, /auth/token-validator.ts, /tests/replay.test.ts"
    },
    stage3: [
      { name: "Replay Attack Invariant (2nd click must fail 401)", status: "PASSED" },
      { name: "Constant-Time Hash Comparison check", status: "PASSED" },
      { name: "Expired Token Boundary Check (15m + 1s)", status: "PASSED" },
      { name: "Zero Unhandled Exception Swallowing", status: "PASSED" }
    ],
    stage4: "CERTIFIED: AuthPasswordResetVerification meets all Fable 5.1 invariants. Safe to merge into main."
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
      dispatch: "Generated StreamBus actor, bounded mpsc sink queues, and Lagged(n) frame metrics."
    },
    stage3: [
      { name: "O(1) Heap Cap invariant under 100k eps burst", status: "PASSED" },
      { name: "Two-Stage TCP pushback trigger on sink delay", status: "PASSED" },
      { name: "Metric drop auditability (rekuiper_dropped_events_total)", status: "PASSED" },
      { name: "Zero runtime memory leak on 12-hour continuous test", status: "PASSED" }
    ],
    stage4: "CERTIFIED: EdgeStreamBoundedIngestion delivers 425k eps at 8MB RAM. Invariants locked."
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
      dispatch: "Generated 0042_dual_write_schema.sql, background shadow backfill worker, and rollback playbook."
    },
    stage3: [
      { name: "Lock duration assertion (< 50ms on migration run)", status: "PASSED" },
      { name: "Dual-write sync equality check (100k sample diff)", status: "PASSED" },
      { name: "Shadow rollback execution verification", status: "PASSED" },
      { name: "Zero transaction isolation anomaly detection", status: "PASSED" }
    ],
    stage4: "CERTIFIED: ZeroDowntimeDualWriteMigration ready for staged blue-green release."
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
      dispatch: "Generated timeline.js, canvas-renderer.js, and mcp-video-tools.js definitions."
    },
    stage3: [
      { name: "Agent JSON schema validation gate", status: "PASSED" },
      { name: "Frame alignment assertion at 60 FPS", status: "PASSED" },
      { name: "Undo/Redo state snapshot preservation", status: "PASSED" },
      { name: "Zero memory leak on canvas buffer reuse", status: "PASSED" }
    ],
    stage4: "CERTIFIED: AgentVideoTimelineEngine validated for Claude Code & Cursor tool calls."
  }
};

let currentPresetKey = 'auth';

function selectPreset(key) {
  currentPresetKey = key;
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const preset = PRESETS[key];
  if (preset) {
    document.getElementById('taskInput').value = preset.prompt;
    resetPipelineDisplay();
  }
}

function resetPipelineDisplay() {
  document.getElementById('pipelineStatusBadge').className = 'pipeline-status';
  document.getElementById('pipelineStatusBadge').innerText = 'Ready for Execution';

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
  const preset = PRESETS[currentPresetKey] || PRESETS.auth;

  btn.disabled = true;
  statusBadge.className = 'pipeline-status running';
  statusBadge.innerText = '⚡ Fable 5.1 Orchestrating...';

  // STAGE 1
  const stage1Card = document.getElementById('stage1Card');
  stage1Card.className = 'pipeline-stage-card active';
  document.getElementById('stage1Body').innerHTML = `
    <div class="contract-box">
      <div class="contract-title">${preset.stage1.contract}</div>
      <p><strong>Objective:</strong> ${preset.stage1.objective}</p>
      <ul class="invariants-list">
        ${preset.stage1.invariants.map(inv => `<li><span class="bullet">🛡️</span> <span>${inv}</span></li>`).join('')}
      </ul>
    </div>
  `;
  await sleep(650);
  stage1Card.className = 'pipeline-stage-card passed';

  // STAGE 2
  const stage2Card = document.getElementById('stage2Card');
  stage2Card.className = 'pipeline-stage-card active';
  document.getElementById('stage2Body').innerHTML = `
    <div class="contract-box">
      <div class="contract-title">Dispatched to: ${preset.stage2.worker}</div>
      <p>${preset.stage2.dispatch}</p>
      <p style="color: var(--accent-cyan); margin-top: 6px;">Status: Patch generated. Awaiting Stage 3 Invariant Gate.</p>
    </div>
  `;
  await sleep(650);
  stage2Card.className = 'pipeline-stage-card passed';

  // STAGE 3
  const stage3Card = document.getElementById('stage3Card');
  stage3Card.className = 'pipeline-stage-card active';
  document.getElementById('stage3Body').innerHTML = `
    <div class="checks-wrapper" style="margin-top: 8px;">
      ${preset.stage3.map(c => `
        <div class="check-item passed">
          <span>${c.name}</span>
          <span class="check-state">✔ ${c.status}</span>
        </div>
      `).join('')}
    </div>
  `;
  await sleep(650);
  stage3Card.className = 'pipeline-stage-card passed';

  // STAGE 4
  const stage4Card = document.getElementById('stage4Card');
  stage4Card.className = 'pipeline-stage-card passed';
  document.getElementById('stage4Body').innerHTML = `
    <div class="worklog-box">
## 🛡️ FableFlow Provenance Certification
- **Architect:** Claude Fable 5.1
- **Timestamp:** ${new Date().toISOString()}
- **Result:** ${preset.stage4}
- **Invariants Gate:** 4/4 Evaluated & Passed.
    </div>
  `;

  statusBadge.className = 'pipeline-status complete';
  statusBadge.innerText = '✔ Invariants Certified Clean';
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

  event.target.classList.add('active');
  const map = {
    claude: 'tabClaude',
    cursor: 'tabCursor',
    antigravity: 'tabAntigravity',
    local: 'tabLocal'
  };
  const targetEl = document.getElementById(map[tabId]);
  if (targetEl) targetEl.classList.remove('hidden');
}

// Initialize default preset on load
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('taskInput').value = PRESETS.auth.prompt;
});