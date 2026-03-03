/**
 * Exercise image path mapping.
 *
 * Images are pre-generated and stored at:
 *   public/images/exercises/{slug}_demo.{ext}
 *   public/images/exercises/{slug}_anatomy.{ext}
 *
 * Slug is derived from exercise name: "Bench Press" → "bench_press"
 */

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function getExerciseDemoImage(exerciseName: string): string {
  return `/images/exercises/${toSlug(exerciseName)}_demo.png`;
}

export function getExerciseAnatomyImage(exerciseName: string): string {
  return `/images/exercises/${toSlug(exerciseName)}_anatomy.png`;
}
