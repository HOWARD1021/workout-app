-- New exercises needed for the Zoro chest template
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_inc30db_001', '30° Incline Dumbbell Press', 'Strength', 'Chest', 0),
  ('ex_inc45db_001', '45° Incline Dumbbell Press', 'Strength', 'Chest', 0),
  ('ex_smithbp_001', 'Smith Machine Bench Press', 'Strength', 'Chest', 0),
  ('ex_lowcfly_001', '15° Cable Fly (Narrow)', 'Strength', 'Chest', 0),
  ('ex_hicfly_001', 'High Cable Fly (Downward)', 'Strength', 'Chest', 0),
  ('ex_dip_001', 'Dip', 'Strength', 'Chest', 0);

-- ================================================================
-- 索隆胸肌課表 Zoro Chest (Rest-Pause)
-- 🛠️ Rest-Pause: 10下力竭 → 休20秒 → 再補5-8下
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t016', '索隆胸肌課表 Zoro Chest', '🛠️ Rest-Pause 訓練法：10下力竭 → 休20秒 → 再補5-8下（再次力竭）', 'Chest', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te073', 't016', 'ex_inc30db_001', 0, 3, 10),  -- 30° 上斜啞鈴推舉
('te074', 't016', 'ex_inc45db_001', 1, 3, 10),  -- 45° 上斜啞鈴推舉
('te075', 't016', 'ex_smithbp_001', 2, 3, 10),  -- Smith 平板臥推
('te076', 't016', 'ex_lowcfly_001', 3, 3, 10),  -- 15° cable飛鳥（窄範圍）
('te077', 't016', 'ex_hicfly_001',  4, 3, 10),  -- 高位cable飛鳥（向下夾）
('te078', 't016', 'ex_dip_001',     5, 3, 10);  -- 雙槓體撐
