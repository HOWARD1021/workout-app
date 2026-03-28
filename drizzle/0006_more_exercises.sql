-- Additional exercises to expand the exercise library
-- Chest
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_decbp_001', 'Decline Bench Press', 'Strength', 'Chest', 0),
  ('ex_chestm_001', 'Chest Press Machine', 'Strength', 'Chest', 0),
  ('ex_pecdeck_001', 'Pec Deck', 'Strength', 'Chest', 0),
  ('ex_incdbfly_001', 'Incline Dumbbell Fly', 'Strength', 'Chest', 0),
  ('ex_dbpress_001', 'Dumbbell Bench Press', 'Strength', 'Chest', 0);

-- Back
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_tbar_001', 'T-Bar Row', 'Strength', 'Back', 0),
  ('ex_sadbrow_001', 'Single Arm Dumbbell Row', 'Strength', 'Back', 0),
  ('ex_revfly_001', 'Reverse Fly', 'Strength', 'Back', 0),
  ('ex_hyperext_001', 'Hyperextension', 'Strength', 'Back', 0),
  ('ex_straightpd_001', 'Straight Arm Pulldown', 'Strength', 'Back', 0),
  ('ex_meadow_001', 'Meadows Row', 'Strength', 'Back', 0);

-- Legs
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_hipthrust_001', 'Hip Thrust', 'Strength', 'Legs', 0),
  ('ex_walklunge_001', 'Walking Lunge', 'Strength', 'Legs', 0),
  ('ex_hacksquat_001', 'Hack Squat', 'Strength', 'Legs', 0),
  ('ex_gobletsq_001', 'Goblet Squat', 'Strength', 'Legs', 0),
  ('ex_sumodl_001', 'Sumo Deadlift', 'Strength', 'Legs', 0),
  ('ex_glutekb_001', 'Glute Kickback', 'Strength', 'Legs', 0),
  ('ex_stepup_001', 'Step Up', 'Strength', 'Legs', 0),
  ('ex_seatedcc_001', 'Seated Calf Raise', 'Strength', 'Legs', 0),
  ('ex_legpress45_001', 'Leg Press (45°)', 'Strength', 'Legs', 0),
  ('ex_goodmorn_001', 'Good Morning', 'Strength', 'Legs', 0);

-- Shoulders
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_arnoldp_001', 'Arnold Press', 'Strength', 'Shoulders', 0),
  ('ex_revpd_001', 'Reverse Pec Deck', 'Strength', 'Shoulders', 0),
  ('ex_uprightrow_001', 'Upright Row', 'Strength', 'Shoulders', 0),
  ('ex_shrug_001', 'Barbell Shrug', 'Strength', 'Shoulders', 0),
  ('ex_dbshrug_001', 'Dumbbell Shrug', 'Strength', 'Shoulders', 0),
  ('ex_dblr_001', 'Dumbbell Lateral Raise', 'Strength', 'Shoulders', 0),
  ('ex_dbohp_001', 'Dumbbell Overhead Press', 'Strength', 'Shoulders', 0),
  ('ex_rearraise_001', 'Rear Delt Raise', 'Strength', 'Shoulders', 0);

-- Arms
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_preacher_001', 'Preacher Curl', 'Strength', 'Arms', 0),
  ('ex_conccurl_001', 'Concentration Curl', 'Strength', 'Arms', 0),
  ('ex_ohtriext_001', 'Overhead Tricep Extension', 'Strength', 'Arms', 0),
  ('ex_tridip_001', 'Tricep Dip', 'Strength', 'Arms', 0),
  ('ex_cablecurl_001', 'Cable Curl', 'Strength', 'Arms', 0),
  ('ex_revgrip_001', 'Reverse Grip Curl', 'Strength', 'Arms', 0),
  ('ex_diamondpu_001', 'Diamond Push Up', 'Strength', 'Arms', 0),
  ('ex_closegrip_001', 'Close Grip Bench Press', 'Strength', 'Arms', 0),
  ('ex_ropepd_001', 'Rope Pushdown', 'Strength', 'Arms', 0),
  ('ex_ezbar_001', 'EZ Bar Curl', 'Strength', 'Arms', 0);

-- Core
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_abwheel_001', 'Ab Wheel Rollout', 'Strength', 'Core', 0),
  ('ex_cabcrunch_001', 'Cable Crunch', 'Strength', 'Core', 0),
  ('ex_deadbug_001', 'Dead Bug', 'Strength', 'Core', 0),
  ('ex_hanglr_001', 'Hanging Leg Raise', 'Strength', 'Core', 0),
  ('ex_woodchop_001', 'Woodchop', 'Strength', 'Core', 0),
  ('ex_mtnclimb_001', 'Mountain Climber', 'Strength', 'Core', 0),
  ('ex_sideplank_001', 'Side Plank', 'Strength', 'Core', 0),
  ('ex_bicycle_001', 'Bicycle Crunch', 'Strength', 'Core', 0);

-- Cardio
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_stairclimb_001', 'Stair Climber', 'Cardio', 'Full Body', 0),
  ('ex_elliptical_001', 'Elliptical', 'Cardio', 'Full Body', 0),
  ('ex_battlerope_001', 'Battle Rope', 'Cardio', 'Full Body', 0),
  ('ex_swimming_001', 'Swimming', 'Cardio', 'Full Body', 0),
  ('ex_treadmill_001', 'Treadmill Walk', 'Cardio', 'Full Body', 0),
  ('ex_burpee_001', 'Burpee', 'Cardio', 'Full Body', 0);

-- Flexibility / Stretching
INSERT OR IGNORE INTO exercises (id, name, type, muscle_group, is_custom) VALUES
  ('ex_foamroll_001', 'Foam Rolling', 'Flexibility', 'Full Body', 0),
  ('ex_yoga_001', 'Yoga Flow', 'Flexibility', 'Full Body', 0),
  ('ex_hipstretch_001', 'Hip Flexor Stretch', 'Flexibility', 'Legs', 0);
