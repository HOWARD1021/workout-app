-- Create achievements definition table
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('first', 'streak', 'count', 'volume', 'muscle', 'pr')),
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id),
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed achievements

-- First milestones
INSERT OR IGNORE INTO achievements (id, name, name_en, description, description_en, icon, category, condition_type, condition_value)
VALUES
  ('first_workout', '初試啼聲', 'First Step', '完成第一次訓練', 'Complete your first workout', '🏋️', 'first', 'total_workouts', 1),
  ('first_template', '模板達人', 'Template Master', '第一次使用模板訓練', 'Use a template for the first time', '📋', 'first', 'template_used', 1),
  ('first_pr', '突破自我', 'Personal Record', '第一次刷新個人紀錄', 'Set your first personal record', '🏅', 'first', 'total_prs', 1);

-- Streak achievements
INSERT OR IGNORE INTO achievements (id, name, name_en, description, description_en, icon, category, condition_type, condition_value)
VALUES
  ('streak_3', '三日不懈', '3-Day Streak', '連續 3 天訓練', 'Work out 3 days in a row', '🔥', 'streak', 'streak_days', 3),
  ('streak_7', '一週戰士', 'Weekly Warrior', '連續 7 天訓練', 'Work out 7 days in a row', '⚡', 'streak', 'streak_days', 7),
  ('streak_14', '鋼鐵意志', 'Iron Will', '連續 14 天訓練', 'Work out 14 days in a row', '💎', 'streak', 'streak_days', 14),
  ('streak_30', '三十天傳奇', '30-Day Legend', '連續 30 天訓練', 'Work out 30 days in a row', '👑', 'streak', 'streak_days', 30);

-- Count achievements
INSERT OR IGNORE INTO achievements (id, name, name_en, description, description_en, icon, category, condition_type, condition_value)
VALUES
  ('count_10', '小有成就', 'Getting Started', '完成 10 次訓練', 'Complete 10 workouts', '💪', 'count', 'total_workouts', 10),
  ('count_50', '健身老手', 'Gym Regular', '完成 50 次訓練', 'Complete 50 workouts', '🦾', 'count', 'total_workouts', 50),
  ('count_100', '百練成鋼', 'Century Club', '完成 100 次訓練', 'Complete 100 workouts', '🏆', 'count', 'total_workouts', 100),
  ('count_500', '健身宗師', 'Fitness Legend', '完成 500 次訓練', 'Complete 500 workouts', '🐉', 'count', 'total_workouts', 500);

-- Volume achievements (kg)
INSERT OR IGNORE INTO achievements (id, name, name_en, description, description_en, icon, category, condition_type, condition_value)
VALUES
  ('volume_1000', '千斤之力', 'Ton Lifter', '累積總訓練量達 1,000 kg', 'Lift a total of 1,000 kg', '🪨', 'volume', 'total_volume', 1000),
  ('volume_10000', '萬斤巨力', '10-Ton Club', '累積總訓練量達 10,000 kg', 'Lift a total of 10,000 kg', '🌋', 'volume', 'total_volume', 10000),
  ('volume_100000', '泰山之力', '100-Ton Titan', '累積總訓練量達 100,000 kg', 'Lift a total of 100,000 kg', '🗻', 'volume', 'total_volume', 100000);

-- Muscle group coverage
INSERT OR IGNORE INTO achievements (id, name, name_en, description, description_en, icon, category, condition_type, condition_value)
VALUES
  ('muscle_3', '多元訓練', 'Diversified', '訓練過 3 個不同部位', 'Train 3 different muscle groups', '🎯', 'muscle', 'muscle_groups_trained', 3),
  ('muscle_all', '全身覆蓋', 'Full Body Master', '訓練過所有 6 個部位', 'Train all 6 muscle groups', '🌈', 'muscle', 'muscle_groups_trained', 6);

-- PR milestones
INSERT OR IGNORE INTO achievements (id, name, name_en, description, description_en, icon, category, condition_type, condition_value)
VALUES
  ('pr_5', '五連破', '5 PRs', '累積 5 次個人紀錄', 'Set 5 personal records', '⭐', 'pr', 'total_prs', 5),
  ('pr_20', '紀錄破壞者', 'Record Breaker', '累積 20 次個人紀錄', 'Set 20 personal records', '🌟', 'pr', 'total_prs', 20),
  ('pr_50', '無人能敵', 'Unstoppable', '累積 50 次個人紀錄', 'Set 50 personal records', '💫', 'pr', 'total_prs', 50);
