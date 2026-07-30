# Workout App Context

This context defines the product language for the workout tracking experience.

## Language

**Training Feedback**:
The experience that helps a user understand what they just completed, where they improved, and what to do next after a training session.
_Avoid_: Motivation copy, completion screen, encouragement

**In-Workout Feedback**:
Immediate feedback shown while a workout is still active, especially when a user completes a set, breaks a PR, or returns from rest.
_Avoid_: Animation, toast, celebration

**PR Moment**:
An in-workout feedback event shown immediately after a completed set beats the user's prior best for that exercise.
_Avoid_: Achievement, end-of-workout PR summary

**Weight PR**:
A personal record where a completed set's weight is higher than the user's prior maximum weight for the same exercise.
_Avoid_: Volume PR, reps PR, estimated 1RM

**Training Review**:
The user-facing view that explains whether a user's training is moving toward a defined goal, using recent training and progress evidence.
_Avoid_: Analytics, backtest, dashboard

**Training Goal**:
A measurable outcome or repeatable behavior that gives the user's training a direction, such as reaching a target weight or training three times per week.
_Avoid_: Motivation, achievement, template

**Goal Progress**:
The current position of a training goal relative to its baseline and target, including the evidence that supports the progress calculation.
_Avoid_: Percentage alone, streak

**Growth Evidence**:
A dated, comparable change in training performance or consistency that helps explain progress toward a training goal.
_Avoid_: Celebration, badge, raw metric

**Growth Curve**:
A weekly time series for the primary training goal, showing the baseline, current position, target, and meaningful changes that explain the user's trajectory.
_Avoid_: Single-session chart, mixed-metric chart, stock chart

**Weekly Progress Point**:
The representative value for a goal within one training week; it is the default unit shown on the growth curve.
_Avoid_: Daily fluctuation, workout total

**Goal Type**:
The measurement model used to evaluate a training goal; the first version supports strength, frequency, and training volume.
_Avoid_: Arbitrary metric, dashboard filter

**Strength Goal**:
A target for the performance of a selected exercise, evaluated with an estimated 1RM as the primary growth signal and linked to the actual completed weight and reps.
_Avoid_: Any single heavier set, unqualified maximum weight

**Estimated 1RM**:
A comparable strength estimate derived from a completed set's weight and reps, used to compare weekly performance when the rep count changes.
_Avoid_: Actual lifted weight, guaranteed max, medical or coaching prescription

**Missing Progress Point**:
A week without an observed value for a goal; it is shown as a gap for exercise strength and as zero for frequency or volume goals when no qualifying training occurred.
_Avoid_: Regression, failed workout, unknown value treated as zero

**Goal Target Line**:
The visual reference on a growth curve showing the value the user intends to reach within the active goal window.
_Avoid_: Prediction line, guaranteed outcome, performance ceiling

**Traceable Growth Evidence**:
A growth-curve point that can be opened to reveal the completed training records and calculations behind its value.
_Avoid_: Unexplained score, aggregate without source, decorative chart point

**Weekly Goal**:
An actionable training commitment for the current week that supports the user's longer-term goal; multiple weekly goals may form a coordinated weekly goal set, and completion is evaluated separately from performance growth.
_Avoid_: Guaranteed weekly result, streak, generic to-do item

**Weekly Goal Action**:
The concrete behavior that satisfies a weekly goal, such as completing a selected exercise session or reaching a planned number of sets.
_Avoid_: Prediction, motivation prompt, raw measurement

**Weekly Goal Set**:
The coordinated collection of weekly goals that represents the user's current training split, such as chest, back, and legs, and is shown together in the training review.
_Avoid_: Unrelated checklist, lifetime program, single metric

**Weekly Expected Progress**:
The amount of training planned for one goal category during the current week, shown as the denominator of a simple expected-versus-achieved comparison.
_Avoid_: Long-term target, prediction line, performance promise

**Weekly Achieved Progress**:
The qualifying amount of training completed for one goal category during the current week, shown against its weekly expected progress.
_Avoid_: Raw lifetime total, estimated future result, unverified intention

**Weekly Session Count**:
The number of completed workouts in the current week that qualify for a goal category; it is the default first-layer unit for expected-versus-achieved progress.
_Avoid_: Set count, exercise count, lifetime workout count

**Suggested Weekly Goal**:
A system-generated weekly goal based on the active goal, the user's recent training pattern, and available training structure; the user may accept or adjust it.
_Avoid_: Fixed prescription, automatic commitment, uneditable plan

**Accepted Weekly Goal**:
A suggested weekly goal that the user has confirmed or adjusted and that is therefore eligible for completion tracking.
_Avoid_: Passive suggestion, automatic commitment, historical target

**Goal-Ready State**:
The state in which a user has enough goal and training context to see a meaningful progress comparison; it is distinct from merely having historical workout data.
_Avoid_: Logged-in state, completed state, analytics loaded

**Exercise-Bound Action**:
A weekly goal action whose completion is proven by a completed workout containing a specified exercise with qualifying records.
_Avoid_: Muscle-group intention, template selection alone, planned but unlogged work

**Qualifying Set**:
A completed exercise set with a positive weight and positive rep count that can support goal completion or strength calculation.
_Avoid_: Planned set, empty set, zero-value record

**Active Goal Window**:
The default eight-week view used to focus the training review on the current goal cycle; longer history remains available as a secondary view.
_Avoid_: Lifetime dashboard, arbitrary recent range, single workout view

**Weekly Strength Point**:
The highest valid estimated 1RM recorded for the selected exercise within an active goal week.
_Avoid_: Weekly average, unqualified max weight, isolated rep count

**Progress Milestone**:
A meaningful event attached to a growth curve, such as a new PR, an accepted weekly goal completed, or the long-term target reached.
_Avoid_: Every data point, decorative badge, generic achievement

**Progress Summary**:
A concise factual statement that interprets the current week's goal completion and measured change from the goal baseline.
_Avoid_: Motivation copy, vague encouragement, prediction

**Goal-Focused Training Timeline**:
A compact chronological view of the current week's completed and pending actions that directly support the active goal.
_Avoid_: Full workout history, unrelated exercise list, raw event stream

**Supporting Metric Card**:
A secondary summary for frequency or training volume that provides context for the primary growth curve without sharing its chart axis.
_Avoid_: Secondary primary chart, mixed-axis overlay, raw dashboard statistic

**Archived Goal**:
A completed or ended training goal whose baseline, target, window, weekly actions, and growth evidence remain viewable as a historical record.
_Avoid_: Deleted goal, reset goal, achievement badge

**Goal Adjustment Event**:
A dated change to an active goal's target or window that preserves prior evidence and makes the new comparison context explicit.
_Avoid_: Historical rewrite, silent reset, new goal without context

**Goal Replacement**:
The creation of a new goal when the selected exercise or measurement model changes, while the prior goal remains available as an ended record.
_Avoid_: Mutating an unrelated goal, stitching incompatible curves, silent reassignment

**Frequency Goal**:
A target number of completed workouts within one training week.
_Avoid_: Streak, calendar activity alone

**Volume Goal**:
A target amount of completed training volume within one training week, calculated from the supported workout records.
_Avoid_: Muscle growth, total lifetime volume

**Goal Baseline**:
The system-calculated starting point for a goal, derived from the user's recent complete training history before the goal begins.
_Avoid_: User's guess, lifetime best, current target

**Goal Target**:
The measurable value the user chooses to reach for a selected goal type.
_Avoid_: Wish, achievement threshold, baseline

**Goal Window**:
The bounded period in which the user intends to move from a goal baseline to its target; the default window is eight weeks and can be changed by the user.
_Avoid_: Lifetime history, arbitrary date filter
