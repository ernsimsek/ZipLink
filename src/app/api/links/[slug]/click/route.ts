import { NextResponse } from "next/server";
import {
  getLinkBySlug,
  incrementClicksServer,
  isExpired,
  isRedisConfigured,
} from "@/lib/link-server";

type RouteContext = { params: { slug: string } };

export async function POST(_req: Request, { params }: RouteContext) {
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
  if (link.password) {
    return NextResponse.json({ error: "password_required" }, { status: 401 });
  }

  await incrementClicksServer(params.slug);
  return NextResponse.json({ originalUrl: link.originalUrl });
}
