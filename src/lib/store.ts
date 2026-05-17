import { buildShortUrl } from "./base-url";
import { getOwnerId } from "./owner";
import type { CreateLinkParams, ShortLink } from "./types";

export type { ShortLink, CreateLinkParams } from "./types";

function ownerHeaders(): HeadersInit {
  return { "x-owner-id": getOwnerId(), "Content-Type": "application/json" };
}

/** Always use the live site origin for display, QR, and copy (fixes localhost on Vercel). */
export function resolveShortUrl(link: Pick<ShortLink, "slug" | "shortUrl">): string {
  if (typeof window !== "undefined") {
    return buildShortUrl(link.slug);
  }
  return link.shortUrl;
}

export function withResolvedUrls(links: ShortLink[]): ShortLink[] {
  return links.map((l) => ({ ...l, shortUrl: resolveShortUrl(l) }));
}

export async function getAllLinks(): Promise<ShortLink[]> {
  try {
    const res = await fetch("/api/links", { headers: ownerHeaders(), cache: "no-store" });
    if (res.ok) {
      const links = (await res.json()) as ShortLink[];
      return withResolvedUrls(links);
    }
  } catch {
    // offline / misconfigured
  }
  return [];
}

export async function createLink(
  params: CreateLinkParams
): Promise<ShortLink | { error: string }> {
  try {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: ownerHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Failed to create link" };
    }
    const link = data as ShortLink;
    return { ...link, shortUrl: resolveShortUrl(link) };
  } catch {
    return { error: "Network error. Check your connection and try again." };
  }
}

export async function deleteLink(id: string): Promise<void> {
  const links = await getAllLinks();
  const link = links.find((l) => l.id === id);
  if (!link) return;
  await fetch(`/api/links/${link.slug}`, { method: "DELETE", headers: ownerHeaders() });
}

export async function toggleLinkStatus(id: string): Promise<ShortLink | null> {
  const links = await getAllLinks();
  const link = links.find((l) => l.id === id);
  if (!link) return null;
  const res = await fetch(`/api/links/${link.slug}`, {
    method: "PATCH",
    headers: ownerHeaders(),
  });
  if (!res.ok) return null;
  const updated = (await res.json()) as ShortLink;
  return { ...updated, shortUrl: resolveShortUrl(updated) };
}

export function getStats(links: ShortLink[]) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter((l) => l.isActive).length;
  const topLink = [...links].sort((a, b) => b.clicks - a.clicks)[0] || null;
  return { totalLinks, totalClicks, activeLinks, topLink };
}

export function isExpired(link: ShortLink): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt) < new Date();
}

export function exportLinksAsCSV(links: ShortLink[]): string {
  const headers = ["Slug", "Short URL", "Original URL", "Title", "Clicks", "Created At", "Expires At", "Status"];
  const rows = links.map((l) => [
    l.slug,
    resolveShortUrl(l),
    l.originalUrl,
    l.title || "",
    l.clicks.toString(),
    new Date(l.createdAt).toLocaleDateString(),
    l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "",
    l.isActive ? "Active" : "Inactive",
  ]);
  return [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}
