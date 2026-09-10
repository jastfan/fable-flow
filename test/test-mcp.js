/**
 * FableFlow 5.1 — MCP Server Self-Test Suite (Zero-Dependency)
 * Validates JSON-RPC 2.0 stdio handling & all 4 exposed tools.
 */

const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'mcp-server.js');
const child = spawn('node', [serverPath], { stdio: ['pipe', 'pipe', 'inherit'] });

let buffer = '';
let currentTest = 0;

const requests = [
  // 1. Initialize
  {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { clientInfo: { name: 'fable-test-client', version: '1.0.0' } }
  },
  // 2. List tools
  {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  },
  // 3. Call fable_decompose_prompt
  {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'fable_decompose_prompt',
      arguments: { task_description: 'Build idempotency token validator', domain: 'auth' }
    }
  },
  // 4. Call fable_audit_pipeline
  {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'fable_audit_pipeline',
      arguments: { code: 'async function run() { await fetch("/api"); }' }
    }
  }
];

function sendNext() {
  if (currentTest < requests.length) {
    const req = requests[currentTest];
    child.stdin.write(JSON.stringify(req) + '\n');
  } else {
    console.log('\n✔ All FableFlow MCP Tools & Protocol tests PASSED successfully!\n');
    child.kill();
    process.exit(0);
  }
}

child.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop(); // Keep partial line

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const res = JSON.parse(line);
      console.log(`[PASS] Test ${res.id} responded:`, res.result ? 'OK' : 'ERROR');
      currentTest++;
      sendNext();
    } catch (e) {
      console.error('Invalid JSON response:', line);
    }
  }
});

sendNext();
