import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(() => ({ env: { DB: {} } })),
}));

const templateRow = {
  id: "template-1",
  userId: "user-1",
};

const templateExerciseRow = {
  id: "template-exercise-1",
  exerciseId: "exercise-1",
  orderIndex: 0,
  defaultSets: 3,
  defaultReps: 8,
  defaultWeight: 60,
  exercise: {
    id: "exercise-1",
    name: "Bench Press",
    nameZh: "槓鈴臥推",
    type: "Strength",
    muscleGroup: "Chest",
    imageUrl: "https://example.com/bench.jpg",
    gifUrl: "https://example.com/bench.gif",
  },
};

function projectTemplateExercise(selection: Record<string, unknown>) {
  const projected: Record<string, unknown> = {};

  for (const key of Object.keys(selection)) {
    if (key === "exercise") {
      const exerciseSelection = selection.exercise as Record<string, unknown>;
      projected.exercise = Object.fromEntries(
        Object.keys(exerciseSelection).map((exerciseKey) => [
          exerciseKey,
          templateExerciseRow.exercise[
            exerciseKey as keyof typeof templateExerciseRow.exercise
          ],
        ])
      );
      continue;
    }

    projected[key] =
      templateExerciseRow[key as keyof Omit<typeof templateExerciseRow, "exercise">];
  }

  return projected;
}

vi.mock("@/lib/db", () => {
  const table = new Proxy(
    {},
    {
      get: (_target, property) => String(property),
    }
  );

  const makeChain = (selection?: Record<string, unknown>) => ({
    from: () => makeChain(selection),
    leftJoin: () => makeChain(selection),
    where: () =>
      selection
        ? makeChain(selection)
        : Promise.resolve([templateRow]),
    orderBy: () => Promise.resolve([projectTemplateExercise(selection ?? {})]),
  });

  return {
    getDb: () => ({
      select: (selection?: Record<string, unknown>) => makeChain(selection),
    }),
    workoutTemplates: table,
    workoutTemplateExercises: table,
    exercises: table,
  };
});

describe("template details API", () => {
  it("returns localized names and exercise media for template exercises", async () => {
    const { GET } = await import("@/app/api/templates/[id]/route");

    const response = await GET(new Request("https://example.com/api/templates/template-1"), {
      params: Promise.resolve({ id: "template-1" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      expect.objectContaining({
        exercise: expect.objectContaining({
          name: "Bench Press",
          nameZh: "槓鈴臥推",
          imageUrl: "https://example.com/bench.jpg",
          gifUrl: "https://example.com/bench.gif",
        }),
      }),
    ]);
  });
});
