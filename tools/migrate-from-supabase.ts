/**
 * 資料遷移腳本：從 Supabase 遷移訓練資料到 D1
 *
 * 使用方式：
 * 1. 設定環境變數 SUPABASE_URL 和 SUPABASE_ANON_KEY
 * 2. 執行：npx tsx scripts/migrate-from-supabase.ts
 *
 * 這個腳本會：
 * 1. 從 Supabase 讀取 exercises, workouts, workout_logs, workout_templates, workout_template_exercises
 * 2. 產生 SQL 檔案
 * 3. 執行 wrangler d1 execute 匯入資料
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://wraykmxzkmyczxgkkhtr.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

async function fetchFromSupabase(table: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return res.json();
}

function escapeSQL(value: string | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  return `'${value.replace(/'/g, "''")}'`;
}

async function main() {
  console.log("🚀 開始從 Supabase 遷移資料...\n");

  if (!SUPABASE_ANON_KEY) {
    console.error("❌ 請設定 SUPABASE_ANON_KEY 環境變數");
    process.exit(1);
  }

  // Fetch all data
  console.log("📥 讀取 Supabase 資料...");
  const [exercises, workouts, workoutLogs, templates, templateExercises] = await Promise.all([
    fetchFromSupabase("exercises"),
    fetchFromSupabase("workouts"),
    fetchFromSupabase("workout_logs"),
    fetchFromSupabase("workout_templates"),
    fetchFromSupabase("workout_template_exercises"),
  ]);

  console.log(`  - exercises: ${exercises.length} 筆`);
  console.log(`  - workouts: ${workouts.length} 筆`);
  console.log(`  - workout_logs: ${workoutLogs.length} 筆`);
  console.log(`  - workout_templates: ${templates.length} 筆`);
  console.log(`  - workout_template_exercises: ${templateExercises.length} 筆`);

  // Generate SQL
  let sql = "-- Migration from Supabase\n-- Generated: " + new Date().toISOString() + "\n\n";

  // Clear existing data (optional)
  sql += "-- Clear existing data\n";
  sql += "DELETE FROM workout_logs;\n";
  sql += "DELETE FROM workout_template_exercises;\n";
  sql += "DELETE FROM workouts;\n";
  sql += "DELETE FROM workout_templates;\n";
  sql += "DELETE FROM exercises;\n\n";

  // Insert exercises
  if (exercises.length > 0) {
    sql += "-- Exercises\n";
    for (const e of exercises) {
      sql += `INSERT INTO exercises (id, name, type, muscle_group, is_custom, created_at, deleted_at) VALUES (${escapeSQL(e.id)}, ${escapeSQL(e.name)}, ${escapeSQL(e.type)}, ${escapeSQL(e.muscle_group)}, ${e.is_custom ? 1 : 0}, ${escapeSQL(e.created_at)}, ${escapeSQL(e.deleted_at)});\n`;
    }
    sql += "\n";
  }

  // Insert workout_templates
  if (templates.length > 0) {
    sql += "-- Workout Templates\n";
    for (const t of templates) {
      sql += `INSERT INTO workout_templates (id, name, description, muscle_group, is_favorite, use_count, last_used_at, created_at, deleted_at) VALUES (${escapeSQL(t.id)}, ${escapeSQL(t.name)}, ${escapeSQL(t.description)}, ${escapeSQL(t.muscle_group)}, ${t.is_favorite ? 1 : 0}, ${t.use_count || 0}, ${escapeSQL(t.last_used_at)}, ${escapeSQL(t.created_at)}, ${escapeSQL(t.deleted_at)});\n`;
    }
    sql += "\n";
  }

  // Insert workout_template_exercises
  if (templateExercises.length > 0) {
    sql += "-- Workout Template Exercises\n";
    for (const te of templateExercises) {
      sql += `INSERT INTO workout_template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps, default_weight) VALUES (${escapeSQL(te.id)}, ${escapeSQL(te.template_id)}, ${escapeSQL(te.exercise_id)}, ${te.order_index || 0}, ${te.default_sets || 3}, ${te.default_reps || "NULL"}, ${te.default_weight || "NULL"});\n`;
    }
    sql += "\n";
  }

  // Insert workouts
  if (workouts.length > 0) {
    sql += "-- Workouts\n";
    for (const w of workouts) {
      sql += `INSERT INTO workouts (id, template_id, started_at, ended_at, note, created_at, deleted_at) VALUES (${escapeSQL(w.id)}, ${escapeSQL(w.template_id)}, ${escapeSQL(w.started_at)}, ${escapeSQL(w.ended_at)}, ${escapeSQL(w.note)}, ${escapeSQL(w.created_at)}, ${escapeSQL(w.deleted_at)});\n`;
    }
    sql += "\n";
  }

  // Insert workout_logs
  if (workoutLogs.length > 0) {
    sql += "-- Workout Logs\n";
    for (const l of workoutLogs) {
      sql += `INSERT INTO workout_logs (id, workout_id, exercise_id, set_order, weight, reps, distance_km, duration_minutes, note, created_at) VALUES (${escapeSQL(l.id)}, ${escapeSQL(l.workout_id)}, ${escapeSQL(l.exercise_id)}, ${l.set_order || 0}, ${l.weight || "NULL"}, ${l.reps || "NULL"}, ${l.distance_km || "NULL"}, ${l.duration_minutes || "NULL"}, ${escapeSQL(l.note)}, ${escapeSQL(l.created_at)});\n`;
    }
  }

  // Write SQL file
  const fs = await import("fs");
  const outputPath = "./drizzle/migrate-data.sql";
  fs.writeFileSync(outputPath, sql);
  console.log(`\n✅ SQL 檔案已產生: ${outputPath}`);

  console.log("\n📤 執行以下指令匯入資料到 D1:");
  console.log("  本地: npx wrangler d1 execute workout-db --local --file=./drizzle/migrate-data.sql");
  console.log("  遠端: npx wrangler d1 execute workout-db --remote --file=./drizzle/migrate-data.sql");
}

main().catch(console.error);
