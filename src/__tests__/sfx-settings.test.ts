import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const KEY = "workout-sfx-settings";

describe("sfx settings store", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
    });
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns defaults when nothing is stored", async () => {
    const sfx = await import("@/lib/sfx");
    expect(sfx.getSfxSettings()).toEqual(sfx.SFX_DEFAULTS);
    expect(sfx.SFX_DEFAULTS).toEqual({
      enabled: true,
      pack: "arcade",
      volume: 0.8,
    });
  });

  it("persists enabled/pack/volume and reloads them in a fresh module", async () => {
    let sfx = await import("@/lib/sfx");
    sfx.setSfxEnabled(false);
    sfx.setSfxPack("soft");
    sfx.setSfxVolume(0.5);

    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      enabled: false,
      pack: "soft",
      volume: 0.5,
    });

    vi.resetModules();
    sfx = await import("@/lib/sfx");
    expect(sfx.getSfxSettings()).toEqual({
      enabled: false,
      pack: "soft",
      volume: 0.5,
    });
  });

  it("clamps volume into the 0..1 range", async () => {
    const sfx = await import("@/lib/sfx");
    sfx.setSfxVolume(5);
    expect(sfx.getSfxSettings().volume).toBe(1);
    sfx.setSfxVolume(-2);
    expect(sfx.getSfxSettings().volume).toBe(0);
  });

  it("ignores an unknown pack", async () => {
    const sfx = await import("@/lib/sfx");
    sfx.setSfxPack("nonsense" as never);
    expect(sfx.getSfxSettings().pack).toBe(sfx.SFX_DEFAULTS.pack);
  });

  it("falls back to defaults when stored JSON is malformed", async () => {
    localStorage.setItem(KEY, "{ not valid json");
    const sfx = await import("@/lib/sfx");
    expect(sfx.getSfxSettings()).toEqual(sfx.SFX_DEFAULTS);
  });

  it("ignores an out-of-enum stored pack but keeps valid fields", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ enabled: false, pack: "bogus", volume: 0.3 })
    );
    const sfx = await import("@/lib/sfx");
    expect(sfx.getSfxSettings()).toEqual({
      enabled: false,
      pack: "arcade",
      volume: 0.3,
    });
  });
});
