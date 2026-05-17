import { NextRequest, NextResponse } from "next/server";
import {
  deleteLinkServer,
  getLinkBySlug,
  isRedisConfigured,
  toPublicLink,
  toggleLinkServer,
} from "@/lib/link-server";

type RouteContext = { params: { slug: string } };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }

  const link = await getLinkBySlug(params.slug);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPublicLink(link));
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }

  const ownerId = req.headers.get("x-owner-id");
  if (!ownerId) {
    return NextResponse.json({ error: "Missing owner id" }, { status: 400 });
  }

  const link = await toggleLinkServer(params.slug, ownerId);
  if (!link) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }

  const ownerId = req.headers.get("x-owner-id");
  if (!ownerId) {
    return NextResponse.json({ error: "Missing owner id" }, { status: 400 });
  }

  const ok = await deleteLinkServer(params.slug, ownerId);
  if (!ok) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
