import { NextRequest, NextResponse } from "next/server";
import {
  getLinkBySlug,
  isExpired,
  isRedisConfigured,
  verifyPasswordServer,
} from "@/lib/link-server";

type RouteContext = { params: { slug: string } };

export async function POST(req: NextRequest, { params }: RouteContext) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }

  const link = await getLinkBySlug(params.slug);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (isExpired(link)) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }
  if (!link.isActive) {
    return NextResponse.json({ error: "inactive" }, { status: 403 });
  }

  const { password } = (await req.json()) as { password?: string };
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const result = await verifyPasswordServer(params.slug, password);
  if (!result.ok) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  return NextResponse.json({ originalUrl: result.originalUrl });
}
