## Problem Statement

使用者在訓練期間依賴休息計時器結束提示，但提示音目前時好時壞，尤其在手機從背景、鎖屏或其他音訊中斷恢復後更容易失效。現有流程同時使用頁面 Web Audio、瀏覽器通知、震動與 Service Worker timer，缺少一致的完成事件與可靠的音訊生命週期處理。

使用者也無法穩定關閉進行中的訓練。訓練畫面的返回操作只會導向首頁，並不會結束 active workout；Finish 在儲存請求卡住時會長時間停留在儲存中；某些沒有動作或組數的訓練又沒有可用的退出路徑。使用者需要一個明確、可恢復且不會遺失資料的關閉流程。

## Solution

改善目前 PWA 的休息計時器提醒與 active workout lifecycle：

- 將休息結束視為單一、可去重的 domain event。
- 在前景中可靠恢復 AudioContext，確認音訊真的可播放後才排程提示音；遇到 suspended、interrupted 或 closed 狀態時採取可預期的恢復或 fallback 行為。
- 保留音效、震動、toast 與背景通知的分工，但避免同一次計時結束重複觸發或互相競速。
- 加入明確的退出／關閉訓練入口，所有返回或關閉操作都經過同一個 confirmation flow。
- Finish、Discard、Continue 三種操作都不能讓使用者卡在無法操作的狀態。
- 儲存逾時或失敗時保留本機 active workout，清除 saving lock，提供可重試的錯誤狀態。
- 讓重試不會建立重複的 workout record。

## User Stories

1. As a person doing a workout, I want the rest timer to play an audible completion alert in the foreground, so that I can keep my attention on the exercise instead of watching the screen.
2. As a person using an iPhone, I want the alert to recover after the app returns from the background, so that a temporary audio interruption does not silently disable future alerts.
3. As a person using a phone with the screen locked or the app backgrounded, I want the best available notification fallback, so that I still have a chance to notice the end of rest.
4. As a person who has granted notification permission, I want a background alert to be delivered at most once per timer, so that duplicate alerts do not become distracting.
5. As a person who has not granted notification permission, I want the foreground sound and toast behavior to remain useful, so that notification permission is not a prerequisite for the core timer.
6. As a person using a device without vibration support, I want the timer to remain functional through sound and visual feedback, so that unsupported hardware does not cause an error.
7. As a person with another audio session or interrupted audio route, I want the workout alert to handle the interruption gracefully, so that the timer does not become permanently silent.
8. As a person editing an active workout, I want an obvious way to close or leave the workout, so that I am not trapped on the logging screen.
9. As a person pressing Back while a workout is active, I want to see the same close confirmation as the explicit close control, so that navigation cannot accidentally leave an ambiguous active session behind.
10. As a person who wants to keep training, I want to dismiss the close confirmation and continue editing without changing my workout, so that an accidental tap is reversible.
11. As a person who has completed a workout, I want Finish and Save to close the active workout and show the completion summary, so that the session has a clear end state.
12. As a person who wants to abandon a workout, I want Discard to remove the active session after explicit confirmation, so that an unwanted session does not remain stuck in the app.
13. As a person with an empty or partially started workout, I want to be able to leave it safely, so that the Finish button being disabled for an empty session does not prevent me from closing the session.
14. As a person with a slow or temporarily unavailable network, I want a save timeout to return me to an actionable state, so that the UI does not remain stuck on Saving indefinitely.
15. As a person whose save fails, I want the workout data to remain recoverable locally, so that I can retry after authentication or network problems without re-entering sets.
16. As a person retrying a save after a lost response, I want the server to recognize the same workout submission, so that one workout is not recorded twice.
17. As a person who taps Finish more than once, I want only one save attempt to be created, so that repeated taps cannot duplicate the workout.
18. As a person returning to the app after an interrupted close or save, I want the active workout state and its available actions to be restored consistently, so that I always know whether the workout is active, saved, or discarded.
19. As a maintainer, I want the timer alert behavior tested through the real workout state flow, so that tests do not pass while the production provider wiring is broken.
20. As a maintainer, I want close, finish, discard, retry, and timeout behavior tested at the highest practical UI/state seam, so that future changes cannot reintroduce a trapped active workout.

## Implementation Decisions

- Keep the existing Next.js PWA and Cloudflare API as the immediate implementation target. A full Swift rewrite is not part of this issue; native iOS remains a follow-up if reliable locked-screen behavior cannot be achieved with web capabilities.
- Introduce one canonical rest-timer completion path that owns deduplication and emits the appropriate foreground/background feedback once.
- Treat AudioContext lifecycle states explicitly. Resume must complete before scheduling generated tones, and interrupted or closed contexts must use a defined recovery or fallback path rather than silently continuing.
- Preserve the existing absolute end-time model so timer display can reconcile after visibility changes; do not rely on elapsed interval ticks as the source of truth.
- Keep Service Worker notifications as a best-effort background fallback and reconcile the timer when the page becomes visible again. Do not represent a Service Worker in-memory timeout as a guaranteed durable scheduler.
- Add an explicit close/exit action to the active workout UI. Back navigation while an active workout exists must invoke the close confirmation instead of silently routing away.
- The close confirmation must offer Continue Training, Finish and Save, and Discard Workout. Continue must leave all active state unchanged; Discard must clear the active session and local persistence; Finish must use the existing completion summary flow.
- Empty or partially started sessions must always have an exit path. The UI may require a confirmation before saving a session with no completed sets, but it must never make the user unable to leave.
- Make the workout save operation bounded with an abortable client timeout. A timeout or failure must clear the finishing lock, preserve the active session, surface a retryable error, and avoid navigating to a false completion state.
- Preserve the existing best-effort PR lookup behavior. PR analytics must never block the required workout save or prevent the user from closing the session.
- Make workout submission retry-safe by carrying a stable client-generated workout submission identity through the active session and having the API treat repeated submissions of that identity as the same workout rather than inserting duplicates.
- Maintain the current user data isolation and existing workout log sanitization behavior.
- Do not add a new dependency unless an existing browser or platform API cannot provide the required behavior.

## Testing Decisions

- Tests must assert observable behavior and state transitions, not the exact number of oscillator objects or private implementation calls.
- The primary seam is the existing WorkoutProvider plus the active workout UI. Tests should initialize a recoverable active workout, exercise the real Finish/Back/close controls, and assert the visible state, persistence behavior, navigation, and retry behavior.
- Extend the existing workout finish regression coverage to include: successful finish, repeated Finish taps, save rejection, save timeout, retry after failure, discard confirmation, discard completion, Back while active, and an empty active workout.
- Add an integration-level timer alert test through the real provider seam. It should cover completion while visible, completion after visibility restoration, audio context resume completion, unavailable vibration, notification permission states, and duplicate-completion prevention.
- Add focused boundary tests for the Service Worker message contract: starting a timer, replacing a timer, stopping a timer, and handling a timer that is already expired when the message is received.
- Add API-level coverage for stable workout submission identity and repeated POST behavior, confirming that retries do not create duplicate workout records while preserving existing exercise-ID sanitization.
- Use fake timers and deterministic clock control for timer tests, and use controllable promises for save/PR lookup tests so the stuck-saving behavior is reproducible.
- Add a manual device verification matrix for iPhone Safari/PWA in foreground, background, screen locked, interrupted audio, notification permission denied, and notification permission granted states. Record whether feedback is sound, vibration, toast, or notification because OS settings can affect each channel.
- Preserve and build on prior art in the existing rest-timer alert tests and workout finish regression tests, while replacing copied-function assertions with tests that exercise the production state flow.

## Out of Scope

- Rewriting the entire frontend in Swift or SwiftUI.
- Building an Android native client.
- Apple Watch, HealthKit, Live Activities, widgets, or other native iOS integrations.
- Redesigning the workout dashboard, analytics, templates, achievements, friends, membership, or authentication flows.
- Changing workout calculation, PR calculation, exercise catalog, or user data isolation rules except where required to make save retries safe.
- Guaranteeing audible playback through a locked or muted iPhone browser/PWA; if that requirement remains mandatory after this fix, it should become a separate native iOS project specification.
- Replacing the Cloudflare Workers, D1 database, or existing deployment platform.

## Further Notes

- Current evidence points to two independent reliability risks: AudioContext resume is initiated without waiting for completion, and the background Service Worker relies on an in-memory setTimeout that may not survive worker termination.
- The current test suite has coverage for copied alert logic and several finish regressions, but it does not fully exercise the production provider/UI path for timer completion and close navigation.
- Definition of done: a user can always leave an active workout through Continue, Finish and Save, or Discard; save failures never leave a permanent Saving state; repeated saves do not duplicate records; and the alert behavior is deterministic in the supported foreground and visibility-recovery scenarios.
