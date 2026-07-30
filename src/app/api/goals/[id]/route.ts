import { GET as getGoals, PATCH as patchGoals } from "@/app/api/goals/route";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);
  url.searchParams.set("id", id);
  return getGoals(new Request(url, request));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  return patchGoals(
    new Request(request.url, {
      method: "PATCH",
      headers: request.headers,
      body: JSON.stringify({ ...(body && typeof body === "object" ? body : {}), id }),
    })
  );
}
