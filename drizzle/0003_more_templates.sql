-- Additional seed exercises (Dip, Chin Up, Dumbbell Row, Bulgarian Split Squat)
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_dip_001', 'Dip', 'Strength', 'Chest', 0),
  ('ex_chinup_001', 'Chin Up', 'Strength', 'Back', 0),
  ('ex_dbrow_001', 'Dumbbell Row', 'Strength', 'Back', 0),
  ('ex_bss_001', 'Bulgarian Split Squat', 'Strength', 'Legs', 0),
  ('ex_incdb_001', 'Incline Dumbbell Press', 'Strength', 'Chest', 0),
  ('ex_cablerow_001', 'Cable Face Pull', 'Strength', 'Shoulders', 0);

-- ================================================================
-- 全身訓練 Full Body Workout
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t009', '全身訓練 Full Body', '適合初學者或一週練 2-3 天的全身訓練', 'Full Body', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te039', 't009', 'a2539596e6b498e01c879efe884f5584', 0, 4, 8),   -- Squat
('te040', 't009', '5441368f567f60ae1b32a68f33a54382', 1, 4, 8),   -- Bench Press
('te041', 't009', '21f7cb35e65b5207d266cc5f41b4ba6c', 2, 4, 10),  -- Barbell Row
('te042', 't009', '636152658c62d5e483cfdb138a9b270c', 3, 3, 10),  -- Overhead Press
('te043', 't009', 'c0d126289f7104e1077c355098e8aceb', 4, 3, 6);   -- Deadlift

-- ================================================================
-- 上半身 Upper Body
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t010', '上半身 Upper Body', '胸背肩手臂的完整上半身訓練', 'Full Body', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te044', 't010', '5441368f567f60ae1b32a68f33a54382', 0, 4, 8),   -- Bench Press
('te045', 't010', '21f7cb35e65b5207d266cc5f41b4ba6c', 1, 4, 10),  -- Barbell Row
('te046', 't010', '636152658c62d5e483cfdb138a9b270c', 2, 3, 10),  -- Overhead Press
('te047', 't010', '8f8dfb12d90940f08344e35435207af3', 3, 3, 15),  -- Lateral Raise
('te048', 't010', '8d77a3d4637dfc25724df03eba2aa1f8', 4, 3, 12),  -- Bicep Curl
('te049', 't010', 'b9f3b3ce595a72a38f785c2d83a5eb26', 5, 3, 15); -- Tricep Pushdown

-- ================================================================
-- 下半身 Lower Body
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t011', '下半身 Lower Body', '股四頭、股二頭、臀部、小腿完整訓練', 'Legs', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te050', 't011', 'a2539596e6b498e01c879efe884f5584', 0, 4, 8),   -- Squat
('te051', 't011', 'dcd57f20c04d18f0008e7083b165a427', 1, 4, 10),  -- Romanian Deadlift
('te052', 't011', '74bc3be1dbba1a9d984abb68d6e4fb7b', 2, 3, 12),  -- Leg Press
('te053', 't011', 'e3a556c97838682d57d067aba459b28a', 3, 3, 15),  -- Leg Curl
('te054', 't011', '68033523b6d8cc234ed1d228b26d932e', 4, 3, 15),  -- Leg Extension
('te055', 't011', '9599b4aee8dc2e10ab28a2cda1145ced', 5, 4, 20); -- Calf Raise

-- ================================================================
-- 5x5 基礎力量 5x5 Strength
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t012', '5x5 基礎力量 5x5 Strength', '經典 5x5 力量訓練法，專注三大項', 'Full Body', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te056', 't012', 'a2539596e6b498e01c879efe884f5584', 0, 5, 5),   -- Squat 5x5
('te057', 't012', '5441368f567f60ae1b32a68f33a54382', 1, 5, 5),   -- Bench Press 5x5
('te058', 't012', '21f7cb35e65b5207d266cc5f41b4ba6c', 2, 5, 5);   -- Barbell Row 5x5

-- ================================================================
-- 快速上半身 Quick Upper
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t013', '快速上半身 Quick Upper', '30 分鐘內完成的精簡上半身訓練', 'Full Body', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te059', 't013', '5441368f567f60ae1b32a68f33a54382', 0, 3, 10),  -- Bench Press
('te060', 't013', '806613ce15ce8771377a17993e595c5e', 1, 3, 8),   -- Pull Up
('te061', 't013', '636152658c62d5e483cfdb138a9b270c', 2, 3, 10),  -- Overhead Press
('te062', 't013', '8d77a3d4637dfc25724df03eba2aa1f8', 3, 3, 12); -- Bicep Curl

-- ================================================================
-- HIIT 間歇訓練
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t014', 'HIIT 間歇訓練', '高強度間歇訓練，適合燃脂和體能提升', 'Full Body', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te063', 't014', '56db3dbd7afa3e6fcf688cbbbfd661aa', 0, 3, 20),  -- Push Up
('te064', 't014', 'a2539596e6b498e01c879efe884f5584', 1, 3, 15),  -- Squat (bodyweight)
('te065', 't014', '66a3e31c2ad2a4192691f4f73f51311f', 2, 3, 45),  -- Plank (seconds)
('te066', 't014', 'c4rd10004000000000000000jumprope1', 3, 3, 60); -- Jump Rope (seconds)

-- ================================================================
-- 胸背超級組 Chest & Back Superset
-- ================================================================
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t015', '胸背超級組 Chest & Back', '胸背交替的超級組訓練，節省時間', 'Full Body', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te067', 't015', '5441368f567f60ae1b32a68f33a54382', 0, 4, 10),  -- Bench Press
('te068', 't015', '21f7cb35e65b5207d266cc5f41b4ba6c', 1, 4, 10),  -- Barbell Row
('te069', 't015', '5943188bd5db3416ee1668cc01e2d727', 2, 3, 12),  -- Incline Bench Press
('te070', 't015', 'f68d6aee65206a98953353ab969a6f57', 3, 3, 12),  -- Lat Pulldown
('te071', 't015', '18032c79ada497d5426716434baa6a32', 4, 3, 15),  -- Dumbbell Fly
('te072', 't015', 'd7752864dc923696ccb110ba42ac627d', 5, 3, 15); -- Seated Cable Row
