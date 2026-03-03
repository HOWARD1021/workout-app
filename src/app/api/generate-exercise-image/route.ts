import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import {
  generateImage,
  buildExercisePrompt,
  buildAnatomyPrompt,
  type ImageGeneratorConfig,
} from "@/lib/image-generator";

interface RequestBody {
  exerciseName: string;
  muscleGroup?: string | null;
  /** "demo" = 動作示範圖, "anatomy" = 肌肉解剖圖 */
  type?: "demo" | "anatomy";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.exerciseName) {
      return NextResponse.json(
        { error: "exerciseName is required" },
        { status: 400 },
      );
    }

    // 從 Cloudflare env 讀取設定（fallback 到預設值）
    let config: ImageGeneratorConfig = {};
    try {
      const { env } = getCloudflareContext();
      config = {
        apiBase: env.IMAGE_API_BASE,
        apiKey: env.IMAGE_API_KEY,
        model: env.IMAGE_MODEL,
      };
    } catch {
      // local dev without Cloudflare context — use defaults
    }

    // 根據 type 選擇 prompt
    const imageType = body.type || "demo";
    const prompt =
      imageType === "anatomy"
        ? buildAnatomyPrompt(body.exerciseName, body.muscleGroup)
        : buildExercisePrompt(body.exerciseName, body.muscleGroup);

    const result = await generateImage(prompt, config);

    return NextResponse.json({
      exerciseName: body.exerciseName,
      muscleGroup: body.muscleGroup ?? null,
      type: imageType,
      mimeType: result.mimeType,
      base64: result.base64,
    });
  } catch (error) {
    console.error("Failed to generate exercise image:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate image: ${message}` },
      { status: 500 },
    );
  }
}
