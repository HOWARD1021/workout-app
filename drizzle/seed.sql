-- Seed default exercises (fixed IDs to match workout templates)
-- Chest
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('5441368f567f60ae1b32a68f33a54382', 'Bench Press', 'Strength', 'Chest', 0),
  ('5943188bd5db3416ee1668cc01e2d727', 'Incline Bench Press', 'Strength', 'Chest', 0),
  ('18032c79ada497d5426716434baa6a32', 'Dumbbell Fly', 'Strength', 'Chest', 0),
  ('56db3dbd7afa3e6fcf688cbbbfd661aa', 'Push Up', 'Strength', 'Chest', 0),
  ('0cca6ce13f9048aeb3f181fab42ac53f', 'Cable Crossover', 'Strength', 'Chest', 0);

-- Back
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('c0d126289f7104e1077c355098e8aceb', 'Deadlift', 'Strength', 'Back', 0),
  ('806613ce15ce8771377a17993e595c5e', 'Pull Up', 'Strength', 'Back', 0),
  ('f68d6aee65206a98953353ab969a6f57', 'Lat Pulldown', 'Strength', 'Back', 0),
  ('21f7cb35e65b5207d266cc5f41b4ba6c', 'Barbell Row', 'Strength', 'Back', 0),
  ('d7752864dc923696ccb110ba42ac627d', 'Seated Cable Row', 'Strength', 'Back', 0);

-- Legs
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('a2539596e6b498e01c879efe884f5584', 'Squat', 'Strength', 'Legs', 0),
  ('74bc3be1dbba1a9d984abb68d6e4fb7b', 'Leg Press', 'Strength', 'Legs', 0),
  ('dcd57f20c04d18f0008e7083b165a427', 'Romanian Deadlift', 'Strength', 'Legs', 0),
  ('e3a556c97838682d57d067aba459b28a', 'Leg Curl', 'Strength', 'Legs', 0),
  ('68033523b6d8cc234ed1d228b26d932e', 'Leg Extension', 'Strength', 'Legs', 0),
  ('9599b4aee8dc2e10ab28a2cda1145ced', 'Calf Raise', 'Strength', 'Legs', 0);

-- Shoulders
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('636152658c62d5e483cfdb138a9b270c', 'Overhead Press', 'Strength', 'Shoulders', 0),
  ('8f8dfb12d90940f08344e35435207af3', 'Lateral Raise', 'Strength', 'Shoulders', 0),
  ('b1309b6465e52cee22ad206cc955425d', 'Front Raise', 'Strength', 'Shoulders', 0),
  ('4c399e8557a62e77607d7ceab13fc3b9', 'Face Pull', 'Strength', 'Shoulders', 0);

-- Arms
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('8d77a3d4637dfc25724df03eba2aa1f8', 'Bicep Curl', 'Strength', 'Arms', 0),
  ('b9f3b3ce595a72a38f785c2d83a5eb26', 'Tricep Pushdown', 'Strength', 'Arms', 0),
  ('74ef4895b9778388951af636c4361c62', 'Hammer Curl', 'Strength', 'Arms', 0),
  ('df662ce739f712b344815b524c03fdf2', 'Skull Crusher', 'Strength', 'Arms', 0);

-- Core
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('66a3e31c2ad2a4192691f4f73f51311f', 'Plank', 'Strength', 'Core', 0),
  ('a4135d1886e3389486d925b3d174a8f0', 'Crunch', 'Strength', 'Core', 0),
  ('51145766052d34b34170ed869b11dad3', 'Leg Raise', 'Strength', 'Core', 0),
  ('fc77802ac3f17ef63817d94b570dac54', 'Russian Twist', 'Strength', 'Core', 0);

-- Cardio
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('c4rd10001000000000000000running01', 'Running', 'Cardio', 'Full Body', 0),
  ('c4rd10002000000000000000cycling01', 'Cycling', 'Cardio', 'Legs', 0),
  ('c4rd10003000000000000000rowing001', 'Rowing', 'Cardio', 'Full Body', 0),
  ('c4rd10004000000000000000jumprope1', 'Jump Rope', 'Cardio', 'Full Body', 0);
