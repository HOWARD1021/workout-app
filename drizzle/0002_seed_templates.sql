-- Seed default workout templates

-- 胸日 (Chest Day)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t001', '胸日 Chest Day', '完整胸部訓練，包含上胸、中胸、下胸', 'Chest', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te001', 't001', '5441368f567f60ae1b32a68f33a54382', 0, 4, 8),  -- Bench Press
('te002', 't001', '5943188bd5db3416ee1668cc01e2d727', 1, 4, 10), -- Incline Bench Press
('te003', 't001', '18032c79ada497d5426716434baa6a32', 2, 3, 12), -- Dumbbell Fly
('te004', 't001', '0cca6ce13f9048aeb3f181fab42ac53f', 3, 3, 15), -- Cable Crossover
('te005', 't001', '56db3dbd7afa3e6fcf688cbbbfd661aa', 4, 3, 15); -- Push Up

-- 背日 (Back Day)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t002', '背日 Back Day', '完整背部訓練，包含上背、中背、下背', 'Back', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te006', 't002', 'c0d126289f7104e1077c355098e8aceb', 0, 4, 6),  -- Deadlift
('te007', 't002', '21f7cb35e65b5207d266cc5f41b4ba6c', 1, 4, 10), -- Barbell Row
('te008', 't002', 'f68d6aee65206a98953353ab969a6f57', 2, 4, 12), -- Lat Pulldown
('te009', 't002', 'd7752864dc923696ccb110ba42ac627d', 3, 3, 12), -- Seated Cable Row
('te010', 't002', '806613ce15ce8771377a17993e595c5e', 4, 3, 8);  -- Pull Up

-- 腿日 (Leg Day)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t003', '腿日 Leg Day', '完整腿部訓練，包含股四頭、股二頭、小腿', 'Legs', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te011', 't003', 'a2539596e6b498e01c879efe884f5584', 0, 4, 8),  -- Squat
('te012', 't003', '74bc3be1dbba1a9d984abb68d6e4fb7b', 1, 4, 12), -- Leg Press
('te013', 't003', 'dcd57f20c04d18f0008e7083b165a427', 2, 4, 10), -- Romanian Deadlift
('te014', 't003', '68033523b6d8cc234ed1d228b26d932e', 3, 3, 15), -- Leg Extension
('te015', 't003', 'e3a556c97838682d57d067aba459b28a', 4, 3, 15), -- Leg Curl
('te016', 't003', '9599b4aee8dc2e10ab28a2cda1145ced', 5, 4, 20); -- Calf Raise

-- 手臂日 (Arms Day)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t004', '手臂日 Arms Day', '二頭肌和三頭肌訓練', 'Arms', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te017', 't004', '8d77a3d4637dfc25724df03eba2aa1f8', 0, 4, 12), -- Bicep Curl
('te018', 't004', '74ef4895b9778388951af636c4361c62', 1, 3, 12), -- Hammer Curl
('te019', 't004', 'df662ce739f712b344815b524c03fdf2', 2, 4, 12), -- Skull Crusher
('te020', 't004', 'b9f3b3ce595a72a38f785c2d83a5eb26', 3, 4, 15); -- Tricep Pushdown

-- 肩膀日 (Shoulders Day)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t005', '肩膀日 Shoulders Day', '前束、中束、後束完整訓練', 'Shoulders', true, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te021', 't005', '636152658c62d5e483cfdb138a9b270c', 0, 4, 8),  -- Overhead Press
('te022', 't005', '8f8dfb12d90940f08344e35435207af3', 1, 4, 15), -- Lateral Raise
('te023', 't005', 'b1309b6465e52cee22ad206cc955425d', 2, 3, 12), -- Front Raise
('te024', 't005', '4c399e8557a62e77607d7ceab13fc3b9', 3, 4, 15); -- Face Pull

-- 核心日 (Core Day)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t006', '核心日 Core Day', '腹肌和核心穩定訓練', 'Core', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te025', 't006', '66a3e31c2ad2a4192691f4f73f51311f', 0, 3, 60), -- Plank (seconds)
('te026', 't006', 'a4135d1886e3389486d925b3d174a8f0', 1, 4, 20), -- Crunch
('te027', 't006', '51145766052d34b34170ed869b11dad3', 2, 4, 15), -- Leg Raise
('te028', 't006', 'fc77802ac3f17ef63817d94b570dac54', 3, 3, 20); -- Russian Twist

-- 上半身推 (Upper Body Push)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t007', '上半身推 Push Day', 'PPL 分化中的推類動作', 'Chest', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te029', 't007', '5441368f567f60ae1b32a68f33a54382', 0, 4, 8),  -- Bench Press
('te030', 't007', '636152658c62d5e483cfdb138a9b270c', 1, 4, 8),  -- Overhead Press
('te031', 't007', '5943188bd5db3416ee1668cc01e2d727', 2, 3, 10), -- Incline Bench Press
('te032', 't007', '8f8dfb12d90940f08344e35435207af3', 3, 4, 15), -- Lateral Raise
('te033', 't007', 'b9f3b3ce595a72a38f785c2d83a5eb26', 4, 4, 15); -- Tricep Pushdown

-- 上半身拉 (Upper Body Pull)
INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count) VALUES
('t008', '上半身拉 Pull Day', 'PPL 分化中的拉類動作', 'Back', false, 0);

INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps) VALUES
('te034', 't008', 'c0d126289f7104e1077c355098e8aceb', 0, 4, 6),  -- Deadlift
('te035', 't008', '21f7cb35e65b5207d266cc5f41b4ba6c', 1, 4, 10), -- Barbell Row
('te036', 't008', 'f68d6aee65206a98953353ab969a6f57', 2, 4, 12), -- Lat Pulldown
('te037', 't008', '4c399e8557a62e77607d7ceab13fc3b9', 3, 4, 15), -- Face Pull
('te038', 't008', '8d77a3d4637dfc25724df03eba2aa1f8', 4, 4, 12); -- Bicep Curl
