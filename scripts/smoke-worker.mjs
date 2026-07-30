import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 8798;
const baseUrl = `http://127.0.0.1:${port}`;
const expectedVersion = process.env.NEXT_PUBLIC_APP_VERSION || null;
const wrangler = spawn(
  "npx",
  ["wrangler", "dev", "--local", "--port", String(port)],
  {
    cwd: process.cwd(),
    stdio: "ignore",
    env: process.env,
  }
);

async function waitForWorker() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return response;
    } catch {
      // Wrangler is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Worker did not become ready within 30 seconds");
}

try {
  const response = await waitForWorker();
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(typeof body.releaseVersion, "string");
  assert.ok(body.releaseVersion.length > 0);
  assert.equal(
    response.headers.get("x-workout-release-version"),
    body.releaseVersion
  );
  if (expectedVersion) assert.equal(body.releaseVersion, expectedVersion);

  const unauthenticatedWorkouts = await fetch(`${baseUrl}/api/workouts`);
  assert.equal(unauthenticatedWorkouts.status, 401);
  console.log(`Worker smoke passed: ${body.releaseVersion}`);
} finally {
  wrangler.kill("SIGTERM");
}
