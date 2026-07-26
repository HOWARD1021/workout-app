# Workout Save Observability and D1 Compatibility Validation

## Problem Statement

使用者按下 Finish & Save 時，伺服器曾因 Cloudflare D1 不支援 Worker runtime 中的顯式 `BEGIN` transaction 而回傳 500。前端只看到「伺服器暫時無法儲存」，沒有錯誤參考編號、沒有可供維護者查詢的持久化 save attempt，也沒有自動化測試在部署前模擬 production D1 邊界，因此錯誤直到真實使用者操作才被發現。

目前 active workout 雖然會保存在本機以便重試，但失敗原因與使用者觸發的 log 沒有可靠的集中保存位置。若錯誤再次發生，維護者只能依賴即時 tail 或使用者口述，難以確認是 D1 API 相容性、認證、資料驗證、網路逾時或部署版本造成。

## Solution

讓 workout save 在進入 production 前具備 D1 相容性驗證，並讓每次 Finish & Save 都有可追蹤的 request、submission、版本與結果紀錄。

API 層以 D1 支援的 batch write 作為 workout 與 workout logs 的原子寫入邊界。測試在最高可用的 `/api/workouts` API seam 驗證外部行為，提供一個只實作 production D1 可用能力的測試資料庫替身；若程式再次呼叫不支援的顯式 transaction，測試必須立即失敗。

儲存失敗時，伺服器會產生可供使用者與維護者對照的 error reference，保存經過遮罩的 save attempt/error event；若 D1 本身無法寫入，Cloudflare Worker structured log 與瀏覽器端待送出的診斷佇列仍保留最小必要資訊。使用者畫面會保留 active workout、提供重試，並顯示錯誤參考編號，而不是只顯示無法採取行動的通用訊息。

## User Stories

1. As a person finishing a workout, I want the workout and its completed sets to save through a D1-compatible path, so that Finish & Save succeeds in production.
2. As a person finishing a workout, I want the workout record and workout logs to be written atomically, so that a failed save does not leave a half-complete workout.
3. As a developer, I want the API test database to expose only the D1 capabilities supported in a Worker, so that unsupported transaction calls fail in CI instead of production.
4. As a developer, I want the API contract test to exercise the real workout save route, so that tests verify user-visible behavior rather than a copied helper or an internal query shape.
5. As a release owner, I want CI to run the D1 compatibility test before build and deployment, so that a known runtime incompatibility blocks release.
6. As a release owner, I want the Cloudflare Worker build and deployment smoke checks to run against the same generated Worker bundle, so that a passing unit test cannot hide a broken production bundle.
7. As a person whose save fails, I want my active workout to remain available locally, so that I can retry without entering all sets again.
8. As a person whose save fails, I want the UI to distinguish authentication, validation, timeout, and server failures, so that I know what action to take next.
9. As a person whose save fails, I want an error reference number, so that I can report the exact incident without exposing my workout details.
10. As a person retrying a failed save, I want the same submission identity to be reused, so that retrying never creates duplicate workout records.
11. As a person who taps Finish more than once, I want duplicate requests to be safely coalesced, so that one workout is recorded once.
12. As a maintainer, I want every save attempt to record its request ID, submission ID, user ID when available, operation, result, error code, and release version, so that incidents can be correlated across client, Worker, and D1.
13. As a maintainer, I want failed save diagnostics to avoid raw exercise names, weights, notes, tokens, and cookies, so that observability does not become a privacy leak.
14. As a maintainer, I want errors that occur before a D1 write to still appear in Cloudflare structured logs, so that a D1 outage does not erase the evidence needed to diagnose it.
15. As a maintainer, I want the browser to queue a minimal diagnostic event when the server cannot accept it, so that the next successful request can attempt delivery.
16. As a maintainer, I want persisted save attempts to have a bounded retention policy, so that diagnostics remain useful without growing the database indefinitely.
17. As an operator, I want to search save incidents by error reference, submission ID, release version, and time window, so that I can identify regressions quickly.
18. As an operator, I want to distinguish a failed save from a successful save whose response was lost, so that retry handling does not create false duplicate alerts.
19. As a developer, I want tests to prove that the retry path recognizes an existing submission, so that idempotency remains intact while observability is added.
20. As a release owner, I want the deployment process to report the deployed Worker version and the smoke-test result, so that “deployed” means the intended bundle is actually serving.
21. As a person using an older cached PWA bundle, I want the save error to include enough version/reference information for support, so that client/server version mismatches can be identified.
22. As a maintainer, I want the existing active-workout close, timeout, discard, and retry behavior to remain unchanged, so that adding diagnostics does not reintroduce a trapped session.

## Implementation Decisions

- Keep the primary behavior seam at the workout save API boundary. The test must call the production POST handler with authenticated user context and realistic workout payloads.
- Use a D1 compatibility fixture that supports `select`, `insert`, and `batch`, but intentionally does not expose an explicit `transaction` method. The fixture models the production contract instead of asserting a particular ORM implementation.
- Keep workout and workout-log persistence on D1 batch writes. The server must generate or accept the stable submission identity before the batch and read back the persisted workout after a successful batch.
- Add a server-side save-attempt/error-event record with a stable event ID, request ID, submission ID, authenticated user ID when available, operation name, status, sanitized error code, HTTP status, release/Worker version, timestamps, and bounded context metadata.
- Treat the save-attempt record as diagnostic data, not as a replacement for the workout or workout-log tables. A successful workout remains the source of truth for user history.
- Emit the same error reference and structured fields to Cloudflare Worker logs. Logging must be best effort and must never recursively fail the workout response.
- If persistence of a diagnostic event fails because D1 is unavailable, retain a minimal client-side diagnostic queue alongside active workout recovery and attempt delivery on the next successful authenticated request. The queue must be bounded and discard only the oldest diagnostic entries after the bound is reached.
- Return stable machine-readable error codes with user-safe messages. The client maps codes to actionable text and displays the error reference; raw database messages and stack traces are never returned to the browser.
- Preserve the existing stable submission ID and idempotent retry contract. A repeated submission must resolve to the existing workout for the same user, while a submission ID owned by another user remains a conflict.
- Add a release/version identifier to the generated Worker and client diagnostic metadata so incidents can be mapped to the exact deployment.
- Add CI gates for the API D1 compatibility test, the full test suite, TypeScript validation, lint, and the Cloudflare/OpenNext production build. Deployment smoke validation must confirm the generated Worker responds and exposes the expected version metadata.
- Add an operational read path for authorized maintainers to query sanitized save-attempt events by reference ID and time range. The first version does not need a broad user-facing error dashboard.
- Apply retention and access controls to diagnostic records. Only authorized maintainers may query cross-user diagnostics; users may retrieve only their own error reference details if that capability is exposed.

## Testing Decisions

- The most important regression test is an API-level success test that runs the real workout POST handler against the D1 compatibility fixture and verifies a workout plus its completed logs are persisted through a batch. It must fail if the handler calls `db.transaction`.
- Add an API-level failure test for a rejected batch. Verify a safe 5xx response, a stable error code/reference, active-workout preservation at the client seam, and a structured diagnostic event attempt.
- Add an idempotency test that submits the same stable submission ID twice and verifies one workout is represented while both calls return a safe result.
- Add a conflict test that submits an existing submission ID owned by another user and verifies the request is rejected without exposing the existing record.
- Add tests for diagnostic redaction. Raw workout notes, weights, exercise names, authorization headers, cookies, and stack traces must not appear in persisted or returned diagnostic payloads.
- Add a client recovery test that queues a diagnostic event when its send fails and retries delivery after a later successful request, with a bounded queue.
- Add a Worker smoke test against the generated OpenNext bundle that verifies the app responds and the workout API returns the expected unauthenticated contract without requiring a real user account.
- Keep the existing workout finish regression tests for timeout, retry, close, discard, and stable submission identity. Extend them only for visible error reference and diagnostic-queue behavior.
- Tests should assert external behavior and safety guarantees, not Drizzle SQL strings or private helper calls. The deliberate absence of `transaction` in the D1 fixture is a runtime capability contract, not an assertion about implementation details.
- Prior art includes the existing real `WorkoutProvider` finish regression tests, the service-worker contract test, the workout-save utility tests, and the newly added workout API batch regression test.

## Out of Scope

- Migrating the application to Swift or changing the existing Cloudflare Worker/D1 platform.
- Redesigning the workout UI, rest timer behavior, templates, analytics, achievements, friends, membership, or authentication flows.
- Storing raw workout payloads, cookies, tokens, or stack traces in diagnostic records.
- Building a full observability dashboard or replacing Cloudflare's native Worker Logs.
- Guaranteeing diagnostic persistence during a total client device failure or an extended loss of both network and local storage.
- Making a failed workout save appear successful. The UI must continue to represent the workout as active until the server confirms the save or the user explicitly discards it.

## Further Notes

- The production incident that motivated this spec was observed in Worker logs as `Failed query: begin`; the corrective deployment switched the save path to D1 batch writes.
- The current Worker deployment is `0e758304-ef2a-4ad8-8526-a0f0cfbcd095`, and the corresponding source commit is `fad550c`.
- The existing local active-workout recovery remains essential. Server-side diagnostics explain failures but must never be treated as the user's workout record.
- The chosen test seam intentionally catches the class of error that escaped earlier tests: an implementation that passes local mocks but invokes a runtime capability unavailable in production.
