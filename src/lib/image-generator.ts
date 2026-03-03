/**
 * Exercise Image Generator
 *
 * 透過 OpenAI 相容 Chat Completions API 呼叫 Gemini 模型生成運動示範圖片。
 * 參考: ai_video_project/tools/imagecreater/generate_image.py
 *
 * 環境變數:
 *   IMAGE_API_BASE  - API 端點 (預設: http://localhost:8317/v1)
 *   IMAGE_API_KEY   - API 金鑰 (預設: quotio-local-716AEC5B)
 *   IMAGE_MODEL     - 圖片模型 (預設: gemini-3-pro-image-preview)
 */

// ── Config ──────────────────────────────────────────────────────
const DEFAULT_API_BASE = "http://localhost:8317/v1";
const DEFAULT_API_KEY = "quotio-local-716AEC5B";
const DEFAULT_MODEL = "gemini-3.1-flash-image";

export interface ImageGeneratorConfig {
  apiBase?: string;
  apiKey?: string;
  model?: string;
}

export interface GenerateResult {
  /** base64-encoded image data (without the data URI prefix) */
  base64: string;
  /** MIME type, e.g. "image/jpeg" or "image/png" */
  mimeType: string;
}

// ── Prompt builder ──────────────────────────────────────────────

/**
 * 根據運動名稱和肌群，產生英文圖片 prompt。
 */
export function buildExercisePrompt(
  exerciseName: string,
  muscleGroup?: string | null,
): string {
  const muscles = muscleGroup ? ` targeting the ${muscleGroup.toLowerCase()}` : "";

  return [
    `Generate a clear, professional exercise demonstration illustration`,
    `showing the proper form for "${exerciseName}"${muscles}.`,
    `Show a fit athletic person performing the exercise with correct posture and technique.`,
    `Use a clean white background. The illustration style should be simple, modern, and easy to understand.`,
    `Include subtle arrows or highlight lines to indicate the movement direction.`,
    `Do NOT include any text or labels in the image.`,
  ].join(" ");
}

/**
 * 根據運動名稱和肌群，產生肌肉解剖圖 prompt。
 */
export function buildAnatomyPrompt(
  exerciseName: string,
  muscleGroup?: string | null,
): string {
  const muscles = muscleGroup ? ` (${muscleGroup})` : "";

  return [
    `Generate a clean anatomical muscle diagram for the exercise "${exerciseName}"${muscles}.`,
    `Show the human body in an anatomical illustration style.`,
    `Highlight the PRIMARY muscles used in bright red, and SECONDARY muscles in light pink.`,
    `Use a clean white background. The style should be medical-illustration quality but accessible.`,
    `Include a simple front or back view (whichever best shows the target muscles).`,
    `Do NOT include any text or labels.`,
  ].join(" ");
}

// ── Generator ───────────────────────────────────────────────────

/**
 * 呼叫 OpenAI 相容 Chat Completions API 取得圖片。
 *
 * 回應格式 (choices[].message.images[]):
 *   { type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } }
 */
export async function generateImage(
  prompt: string,
  config: ImageGeneratorConfig = {},
): Promise<GenerateResult> {
  const apiBase = config.apiBase || DEFAULT_API_BASE;
  const apiKey = config.apiKey || DEFAULT_API_KEY;
  const model = config.model || DEFAULT_MODEL;

  const url = `${apiBase}/chat/completions`;

  const body = {
    model,
    messages: [
      { role: "user", content: `請生成一張圖片：${prompt}` },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image API error ${res.status}: ${text}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as any;

  // 解析回應中的圖片 (same structure as Python reference)
  for (const choice of data.choices ?? []) {
    const images = choice.message?.images ?? [];
    for (const img of images) {
      if (img.type === "image_url") {
        const dataUrl: string = img.image_url?.url ?? "";
        const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          return { mimeType: match[1], base64: match[2] };
        }
      }
    }
  }

  throw new Error("No image found in API response.");
}
