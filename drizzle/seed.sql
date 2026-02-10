-- Seed default exercises
-- Chest
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Bench Press', 'Strength', 'Chest', 0),
  (lower(hex(randomblob(16))), 'Incline Bench Press', 'Strength', 'Chest', 0),
  (lower(hex(randomblob(16))), 'Dumbbell Fly', 'Strength', 'Chest', 0),
  (lower(hex(randomblob(16))), 'Push Up', 'Strength', 'Chest', 0),
  (lower(hex(randomblob(16))), 'Cable Crossover', 'Strength', 'Chest', 0);

-- Back
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Deadlift', 'Strength', 'Back', 0),
  (lower(hex(randomblob(16))), 'Pull Up', 'Strength', 'Back', 0),
  (lower(hex(randomblob(16))), 'Lat Pulldown', 'Strength', 'Back', 0),
  (lower(hex(randomblob(16))), 'Barbell Row', 'Strength', 'Back', 0),
  (lower(hex(randomblob(16))), 'Seated Cable Row', 'Strength', 'Back', 0);

-- Legs
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Squat', 'Strength', 'Legs', 0),
  (lower(hex(randomblob(16))), 'Leg Press', 'Strength', 'Legs', 0),
  (lower(hex(randomblob(16))), 'Romanian Deadlift', 'Strength', 'Legs', 0),
  (lower(hex(randomblob(16))), 'Leg Curl', 'Strength', 'Legs', 0),
  (lower(hex(randomblob(16))), 'Leg Extension', 'Strength', 'Legs', 0),
  (lower(hex(randomblob(16))), 'Calf Raise', 'Strength', 'Legs', 0);

-- Shoulders
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Overhead Press', 'Strength', 'Shoulders', 0),
  (lower(hex(randomblob(16))), 'Lateral Raise', 'Strength', 'Shoulders', 0),
  (lower(hex(randomblob(16))), 'Front Raise', 'Strength', 'Shoulders', 0),
  (lower(hex(randomblob(16))), 'Face Pull', 'Strength', 'Shoulders', 0);

-- Arms
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Bicep Curl', 'Strength', 'Arms', 0),
  (lower(hex(randomblob(16))), 'Tricep Pushdown', 'Strength', 'Arms', 0),
  (lower(hex(randomblob(16))), 'Hammer Curl', 'Strength', 'Arms', 0),
  (lower(hex(randomblob(16))), 'Skull Crusher', 'Strength', 'Arms', 0);

-- Core
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Plank', 'Strength', 'Core', 0),
  (lower(hex(randomblob(16))), 'Crunch', 'Strength', 'Core', 0),
  (lower(hex(randomblob(16))), 'Leg Raise', 'Strength', 'Core', 0),
  (lower(hex(randomblob(16))), 'Russian Twist', 'Strength', 'Core', 0);

-- Cardio
INSERT INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  (lower(hex(randomblob(16))), 'Running', 'Cardio', 'Full Body', 0),
  (lower(hex(randomblob(16))), 'Cycling', 'Cardio', 'Legs', 0),
  (lower(hex(randomblob(16))), 'Rowing', 'Cardio', 'Full Body', 0),
  (lower(hex(randomblob(16))), 'Jump Rope', 'Cardio', 'Full Body', 0);
