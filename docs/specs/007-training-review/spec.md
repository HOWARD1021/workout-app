# 訓練回顧（Training Review）

## Problem Statement

使用者目前可以看到訓練次數、總訓練量、肌群分布、每週頻率、動作最大重量趨勢、PR 與近期訓練，但這些資料以同等重要的分析卡片分散呈現。

使用者因此需要自己回答三個最重要的問題：

1. 這週胸、背、腿各自預計完成多少，實際完成多少？
2. 我正在追蹤的力量或訓練目標是否有進步？
3. 這個進步是由哪些實際訓練造成的？

目前系統也沒有一等的訓練目標、目標週期、每週目標集合或目標接受狀態，因此無法把統計資料組織成可理解的 Training Review。現有頁面更接近 Analytics dashboard，而不是能說明目標進度與成長證據的回顧體驗。

## Solution

直接重構現有 `/analytics` 頁面為 Training Review，不新增平行入口。

首屏採用簡單的「預期／已完成」週進度：顯示目前週期中每個計畫肌群（例如胸、背、腿）的預期訓練次數與已完成訓練次數。第一層不展示所有動作、組數或重量，避免資訊過載。

週進度下方顯示事實型 Progress Summary，接著顯示一個可切換動作的 Growth Curve，讓使用者在 8 週 Goal Window 內看到自己的成長軌跡。力量曲線以每週最高有效 Estimated 1RM 為資料點，顯示 Goal Baseline、Goal Target Line、少數 Progress Milestone，以及沒有資料時的正確留白。

曲線下方顯示 Goal-Focused Training Timeline，只列出本週與目前目標相關的訓練歷程。訓練量與頻率保留為 Supporting Metric Card，完整組數與原始紀錄則透過資料點或歷程項目展開查看。

## User Stories

1. As a workout app user, I want to see my planned chest, back, and legs sessions for the current week, so that I know what my weekly training expectations are.
2. As a workout app user, I want to see expected and achieved session counts together, so that I can understand my weekly progress without calculating it myself.
3. As a workout app user, I want all planned muscle groups to remain visible, so that a chest/back/legs split is not reduced to one arbitrary action.
4. As a workout app user, I want each muscle-group card to use completed workout sessions as its first-layer unit, so that the progress is simple and comparable.
5. As a workout app user, I want the first viewport to prioritize weekly progress, so that the page does not feel like a dense analytics dashboard.
6. As a workout app user, I want a factual Progress Summary, so that I can understand the conclusion before interpreting a chart.
7. As a workout app user, I want the summary to distinguish completed sessions from unfinished weekly expectations, so that it does not overstate my progress.
8. As a workout app user, I want to create a Strength Goal, Frequency Goal, or Volume Goal, so that my Training Review has a measurable direction.
9. As a workout app user, I want the system to calculate my Goal Baseline from recent complete training history, so that I do not need to reconstruct my starting point manually.
10. As a workout app user, I want to set a Goal Target, so that the review can show what I am trying to reach.
11. As a workout app user, I want a default eight-week Goal Window, so that my progress has a concrete review period.
12. As a workout app user, I want to change the Goal Window, so that the review period matches my training plan.
13. As a workout app user, I want the system to suggest a Weekly Goal Set from my active goal, recent pattern, and available training structure, so that I do not start each week from an empty form.
14. As a workout app user, I want to accept or adjust a Suggested Weekly Goal before it becomes an Accepted Weekly Goal, so that the system does not silently commit me to a plan.
15. As a workout app user, I want an accepted weekly goal to be tracked separately from measured performance, so that a difficult week does not make a normal performance fluctuation look like failure.
16. As a workout app user, I want the weekly goal set to support multiple muscle-group actions, so that chest, back, and legs can all have expected progress in the same week.
17. As a workout app user, I want muscle-group goals to remain simple at the first layer, so that I see “胸 1/2 次” instead of a list of every exercise.
18. As a workout app user, I want muscle-group progress to be traceable to the exercises in completed workouts, so that I can inspect the evidence when needed.
19. As a workout app user, I want a strength goal to be bound to a selected exercise, so that the Growth Curve compares like with like.
20. As a workout app user, I want a strength weekly action to require a qualifying record in a completed workout, so that planned or empty sets do not count as completed training.
21. As a workout app user, I want a qualifying set to require positive weight and positive reps, so that incomplete records do not influence progress calculations.
22. As a workout app user, I want the Growth Curve to use weekly data points, so that daily fatigue and isolated fluctuations do not dominate the trend.
23. As a workout app user, I want the current eight-week Goal Window to be the default chart range, so that the curve is relevant to my active goal.
24. As a workout app user, I want to view longer history separately, so that I can inspect lifetime context without losing focus on the active goal.
25. As a workout app user, I want a Strength Goal curve to use the highest valid Estimated 1RM in each week, so that changes in weight and reps can be compared fairly.
26. As a workout app user, I want the actual weight and reps behind an Estimated 1RM to be visible, so that a derived number does not pretend to be a weight I actually lifted.
27. As a workout app user, I want multiple sessions for the same exercise in one week to be represented by the best valid weekly point, so that the chart shows my strongest observed performance.
28. As a workout app user, I want a week without a strength observation to appear as a gap, so that missing data is not misrepresented as zero strength.
29. As a workout app user, I want zero training weeks for Frequency Goal and Volume Goal to be represented as zero, so that an uncompleted weekly target remains visible.
30. As a workout app user, I want the chart to show my Goal Baseline, so that I can see where the active cycle started.
31. As a workout app user, I want the chart to show a Goal Target Line, so that I can see the intended destination.
32. As a workout app user, I want the chart to avoid a false linear prediction line, so that normal non-linear strength progress is not presented as failure.
33. As a workout app user, I want meaningful Progress Milestones such as PRs and target completion marked on the curve, so that important changes are easy to find.
34. As a workout app user, I want milestones to remain sparse, so that the chart stays readable and does not become a badge wall.
35. As a workout app user, I want to tap a weekly point and see Traceable Growth Evidence, so that I can understand how the value was calculated.
36. As a workout app user, I want point details to show date, actual set, reps, number of sets, and weekly volume, so that I can verify the evidence behind a trend.
37. As a workout app user, I want to see a Goal-Focused Training Timeline below the chart, so that the current week's planned and completed actions are connected to the curve.
38. As a workout app user, I want unrelated exercises hidden from the first timeline view, so that the timeline stays focused.
39. As a workout app user, I want to expand a timeline item into complete set details, so that the simple first layer does not prevent deeper review.
40. As a workout app user, I want frequency and training volume shown as Supporting Metric Cards, so that context is available without mixing chart axes.
41. As a workout app user, I want the primary curve to remain a single metric, so that strength, frequency, and volume do not become visually indistinguishable.
42. As a workout app user, I want the Training Review to remain useful when I have no active goal, so that existing historical workouts are not hidden.
43. As a workout app user, I want a clear goal-creation entry point when no active goal exists, so that I know how to make the review meaningful.
44. As a workout app user, I want to see a Suggested Weekly Goal before accepting it, so that I can start from a useful default without losing control.
45. As a workout app user, I want a helpful first action when I have no workout history, so that the page is not just an empty chart.
46. As a workout app user, I want a completed goal to remain viewable as an Archived Goal, so that I can revisit the full path that led to completion.
47. As a workout app user, I want a completed goal not to reset automatically, so that its historical evidence remains stable.
48. As a workout app user, I want to create a next goal after completing one, so that progress can continue without overwriting the previous cycle.
49. As a workout app user, I want changing a target or window to preserve prior evidence, so that the system does not rewrite my history.
50. As a workout app user, I want a Goal Adjustment Event shown when a target changes, so that I can distinguish changed expectations from actual performance.
51. As a workout app user, I want changing the selected exercise to create a Goal Replacement, so that incompatible exercise curves are not stitched together.
52. As a workout app user, I want deleted workouts excluded from all goal calculations, so that removed records do not continue to affect progress.
53. As a workout app user, I want my Training Review to use only my own workouts and goals, so that another user's data cannot affect my progress.
54. As a workout app user, I want the review to handle incomplete or interrupted workouts consistently, so that partial records do not silently count as completed goals.
55. As a workout app user, I want the same weekly boundary and timezone rules used across cards, charts, timelines, and APIs, so that one workout cannot appear in different weeks depending on the component.
56. As a workout app user, I want Traditional Chinese labels and concise factual copy, so that the interface feels clear rather than motivational or gamified.
57. As a workout app user, I want the Training Review to replace the current analytics experience at the same route, so that I do not need to learn a second destination for my progress.

## Implementation Decisions

- Replace the current analytics presentation in place; preserve the existing analytics route and avoid adding a parallel Training Review route.
- Keep existing workout, monthly recap, muscle-group, trend, and PR data sources where they remain semantically valid. Reorder and demote them according to the Training Review hierarchy instead of deleting useful history.
- Add first-class goal data with a goal type of `strength`, `frequency`, or `volume`.
- A goal stores its selected measurement context, Goal Baseline, Goal Target, Goal Window, active/ended state, and timestamps. The default Goal Window is eight weeks and is user-editable.
- A Strength Goal is bound to one exercise. A Goal Replacement is created when the selected exercise or measurement model changes; incompatible curves are never stitched together.
- A Frequency Goal and Volume Goal are evaluated weekly. A Weekly Goal Set may contain several goal categories such as chest, back, and legs.
- A Weekly Goal Set contains expected session counts for the current week. The first-layer display uses Weekly Session Count as `achieved / expected`; details may expose the underlying exercises and sets.
- Weekly goal suggestions are generated from the active goal, recent training pattern, and available training structure. A suggestion is not tracked until the user accepts or adjusts it into an Accepted Weekly Goal.
- The first-layer weekly cards show every planned category. They do not show every exercise, raw set, or weight.
- Goal completion requires a completed workout and at least one Qualifying Set. A Qualifying Set has positive weight and positive reps. Planned templates, empty logs, zero-value records, deleted workouts, and incomplete sessions do not count.
- The primary Growth Curve is one selected metric at a time. For Strength Goal, the weekly point is the highest valid Estimated 1RM in that week. The chart exposes the actual source set on interaction.
- Estimated 1RM is a comparison aid, not a claim that the user completed the estimated weight. The UI must label it as an estimate and retain actual weight/reps in evidence details.
- Strength weeks without a qualifying observation render as gaps. Frequency and volume weeks without qualifying training render as zero.
- The default chart range is the active eight-week Goal Window. Longer history is a secondary view.
- The chart includes Goal Baseline and Goal Target Line, but no linear expected-progress line. The Goal Window is used for context and status, not a fabricated prediction.
- Progress Milestones are sparse and factual: new PR, accepted weekly goal completed, target reached, or meaningful data interruption. They are annotations, not a replacement for the curve.
- A factual Progress Summary appears above the chart and reports current weekly completion plus measured change from baseline. It must not use motivational or vague encouragement copy.
- Goal-Focused Training Timeline appears below the chart and includes only current-week records related to the selected goal. Full records are available through expansion.
- Frequency and training volume are Supporting Metric Cards and must not be overlaid with the primary curve or share a mixed axis.
- No active goal state shows a goal-creation entry point while retaining existing historical training data. A user with no history sees a first actionable setup state instead of an empty, misleading chart.
- A completed or ended goal becomes an Archived Goal. Its baseline, target, window, weekly actions, adjustments, milestones, and evidence remain readable. It is not auto-reset.
- Updating a target or window creates a Goal Adjustment Event. It changes future comparison context without rewriting prior baseline or evidence.
- User ownership and deleted-record filtering must follow the existing authorization and soft-delete rules used by workout analytics.
- Weekly aggregation must use one consistent timezone and week-start rule across goal APIs, charts, weekly cards, and timelines.
- The generated UI mockup is a visual direction reference: light mobile-first surface, clear hierarchy, Traditional Chinese copy, calm fitness styling, one green growth line, a target reference line, sparse milestone markers, and no stock-market/candlestick treatment.

## Testing Decisions

- The primary acceptance seam is the user-visible Training Review contract: given API fixtures for goals, weekly progress, growth points, milestones, and timelines, the page must render the correct hierarchy and states. Tests should assert visible labels, values, gaps, and interactions rather than CSS class names or internal helper calls.
- API-level tests must lock the calculation contract for weekly session counts, accepted versus suggested goals, goal ownership, soft-deleted workouts, Qualifying Set filtering, Goal Baseline calculation, weekly highest Estimated 1RM, missing strength weeks, and target/adjustment lifecycle.
- Component-level tests should cover the first-layer weekly cards, factual Progress Summary, chart selection, point detail expansion, timeline filtering, no-goal state, no-history state, and archived-goal state.
- Regression tests should cover the existing monthly recap and workout APIs because the new page reuses their data and must not change their external behavior.
- Time-sensitive tests should use fixed dates and explicit timezone/weekly-boundary fixtures. They must cover workouts at both sides of a week boundary.
- Calculation tests should include varying reps at different weights, multiple sessions in one week, empty or zero-value sets, interrupted workouts, deleted workouts, and a week with no strength observation.
- Existing prior art includes route tests for monthly recap aggregation and workout persistence, plus React component tests for workout completion and user-visible feedback. New tests should follow those Vitest, Testing Library, mocked-auth, and mocked-database conventions.
- Verification should include lint, typecheck, the full Vitest suite, and a production build after implementation. A mobile viewport manual check should verify that the weekly cards, chart, and first timeline remain scannable.

## Out of Scope

- Building a coaching engine or prescribing medical, rehabilitation, or individualized training advice.
- Automatically changing a user's accepted weekly goal without an explicit user action.
- Treating Estimated 1RM as an actual completed lift or as a guaranteed prediction.
- Adding candlestick charts, finance-style chart interactions, or multiple overlaid primary metrics.
- Adding body-composition, calorie, sleep, recovery, or wearable integrations.
- Automatically inferring muscle growth from training volume or presenting volume as proof of hypertrophy.
- Replacing the workout logging flow or template editor.
- Replacing the existing achievements system with Goal Milestones.
- Adding social comparison or competitive leaderboards to Training Review.
- Rewriting or deleting historical analytics data when goals are adjusted or replaced.
- Creating a separate `/training-review` route.
- Creating a full design-system overhaul beyond the Training Review page and its supporting components.

## Further Notes

- The current product glossary defines Training Review, Training Goal, Goal Progress, Growth Evidence, Growth Curve, Weekly Goal, Weekly Goal Set, and related terms in the project context document. Implementers should use those terms consistently in UI copy, API names, and tests.
- The existing page already contains much of the raw data needed for the first visual iteration. The main product risk is semantic clarity, not lack of metrics.
- The implementation should prefer a small number of shared aggregation seams so the weekly cards, Progress Summary, chart, and timeline cannot disagree about what counts as completed training.
- The page should make the simple answer visible first: expected this week, achieved this week, and what changed over the active Goal Window.
