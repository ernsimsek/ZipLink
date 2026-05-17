import { NextRequest, NextResponse } from "next/server";
import { createLinkServer, getLinksByOwner, isRedisConfigured } from "@/lib/link-server";
import type { CreateLinkParams } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 503 }
    );
  }

  const ownerId = req.headers.get("x-owner-id");
  if (!ownerId) {
    return NextResponse.json({ error: "Missing owner id" }, { status: 400 });
  }

  const links = await getLinksByOwner(ownerId);
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "Redis not configured. Connect Upstash on Vercel and redeploy." },
      { status: 503 }
    );
  }

  const ownerId = req.headers.get("x-owner-id");
  if (!ownerId) {
    return NextResponse.json({ error: "Missing owner id" }, { status: 400 });
  }

  const body = (await req.json()) as CreateLinkParams;
  const result = await createLinkServer(ownerId, body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
