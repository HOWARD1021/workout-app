/**
 * Shared UI sound effects, powered by uisfx (https://uisfx.com).
 *
 * uisfx synthesizes every cue locally through a tiny Web Audio runtime, so
 * nothing is fetched over the network — a good fit for the offline-capable PWA.
 * Audio is CC0, code is MIT.
 *
 * The user controls three things from the settings card: on/off, which "feel"
 * (pack) to use, and the volume. We own persistence here (rather than uisfx's
 * built-in preferences) so the defaults and storage key stay under our control.
 */
import { createUISFX, type PackName, type UISFXPlayer } from "uisfx";

/** Selectable "feels". One pack covers every cue across the whole app. */
export const SFX_PACKS: ReadonlyArray<{ value: PackName; label: string }> = [
  { value: "arcade", label: "電玩感" },
  { value: "soft", label: "溫暖柔和" },
  { value: "glass", label: "清脆高級" },
  { value: "rubber", label: "俏皮彈性" },
  { value: "minimal", label: "極簡精準" },
  { value: "organic", label: "自然溫潤" },
  { value: "dreamy", label: "夢幻飄逸" },
  { value: "scifi", label: "科幻電子" },
  { value: "mechanical", label: "機械質感" },
  { value: "cinematic", label: "電影史詩" },
  { value: "studio", label: "錄音室" },
  { value: "zen", label: "禪意平靜" },
];

const VALID_PACKS = new Set<PackName>(SFX_PACKS.map((p) => p.value));

export interface SfxSettings {
  enabled: boolean;
  pack: PackName;
  volume: number; // 0..1
}

export const SFX_DEFAULTS: SfxSettings = {
  enabled: true,
  pack: "arcade",
  volume: 0.8,
};

const SETTINGS_KEY = "workout-sfx-settings";

/** How long the rest-end "loading" pulse plays before we stop the loop (ms). */
const REST_END_PULSE_MS = 2400;

function clampVolume(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return SFX_DEFAULTS.volume;
  return Math.min(1, Math.max(0, n));
}

function readSettings(): SfxSettings {
  if (typeof window === "undefined") return { ...SFX_DEFAULTS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...SFX_DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<SfxSettings>;
    return {
      enabled:
        typeof parsed.enabled === "boolean"
          ? parsed.enabled
          : SFX_DEFAULTS.enabled,
      pack:
        typeof parsed.pack === "string" && VALID_PACKS.has(parsed.pack)
          ? parsed.pack
          : SFX_DEFAULTS.pack,
      volume: clampVolume(parsed.volume),
    };
  } catch {
    return { ...SFX_DEFAULTS };
  }
}

// `settings` is treated as immutable: every change replaces the whole object,
// so its reference is a valid snapshot for useSyncExternalStore.
let settings: SfxSettings = readSettings();
let player: UISFXPlayer | null = null;

const listeners = new Set<() => void>();

/** Subscribe to settings changes (for React's useSyncExternalStore). */
export function subscribeSfx(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Stable defaults object for server rendering (never mutated). */
export function getSfxServerSnapshot(): SfxSettings {
  return SFX_DEFAULTS;
}

function commit(next: SfxSettings): void {
  settings = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Storage may be unavailable (private mode, quota) — stays in-memory.
    }
  }
  listeners.forEach((l) => l());
}

function getPlayer(): UISFXPlayer | null {
  if (typeof window === "undefined") return null;
  if (!player) {
    try {
      player = createUISFX({
        pack: settings.pack,
        volume: settings.volume,
        enabled: settings.enabled,
      });
    } catch {
      return null;
    }
  }
  return player;
}

/**
 * Current settings. Returns a stable reference that only changes when a setter
 * runs, so it is safe as a useSyncExternalStore snapshot. Treat it as read-only.
 */
export function getSfxSettings(): SfxSettings {
  return settings;
}

export function setSfxEnabled(enabled: boolean): void {
  commit({ ...settings, enabled });
  try {
    getPlayer()?.setEnabled(enabled);
  } catch {
    /* best-effort */
  }
}

export function setSfxPack(pack: PackName): void {
  if (!VALID_PACKS.has(pack)) return;
  commit({ ...settings, pack });
  try {
    getPlayer()?.setPack(pack);
  } catch {
    /* best-effort */
  }
}

export function setSfxVolume(volume: number): void {
  const v = clampVolume(volume);
  commit({ ...settings, volume: v });
  try {
    getPlayer()?.setVolume(v);
  } catch {
    /* best-effort */
  }
}

/**
 * Prime the audio engine from a trusted user gesture so later cues are allowed
 * to play. Safe to call more than once.
 */
export function unlockSfx(): void {
  try {
    void getPlayer()
      ?.unlock()
      .catch(() => {});
  } catch {
    /* best-effort */
  }
}

/** One-shot celebration when a workout is completed. */
export function playRewardSfx(): void {
  try {
    getPlayer()?.play("reward");
  } catch {
    // Audio is best-effort; never let a missing engine break the UI.
  }
}

/**
 * Rest-is-over alert. Uses the "loading" pulse the way the product asked for,
 * bounded to a short burst instead of an endless loop. Noticeability still
 * comes from vibration + notification + toast at the call site.
 */
export function playRestEndSfx(): void {
  try {
    const handle = getPlayer()?.play("loading", { loop: true });
    if (handle) {
      setTimeout(() => handle.stop(), REST_END_PULSE_MS);
    }
  } catch {
    // Best-effort; the vibration/notification/toast still fire at the call site.
  }
}

/**
 * Play a short sample so the user can hear the current pack/volume while
 * adjusting settings. Also unlocks the engine (the button click is a gesture).
 */
export function previewSfx(): void {
  unlockSfx();
  try {
    getPlayer()?.play("reward");
  } catch {
    /* best-effort */
  }
}
