import { getBaseUrl, buildShortUrl } from "./base-url";
import { getRedis, isRedisConfigured, linkKey, ownerKey } from "./redis";
import type { CreateLinkParams, PublicLinkResponse, ShortLink } from "./types";

function generateSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isExpired(link: ShortLink): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt) < new Date();
}

export function toPublicLink(link: ShortLink): PublicLinkResponse {
  const expired = isExpired(link);
  return {
    slug: link.slug,
    isActive: link.isActive,
    isExpired: expired,
    hasPassword: Boolean(link.password),
    originalUrl: link.password ? undefined : link.originalUrl,
  };
}

export async function getLinkBySlug(slug: string): Promise<ShortLink | null> {
  const redis = getRedis();
  if (!redis) return null;
  const link = await redis.get<ShortLink>(linkKey(slug));
  return link ?? null;
}

export async function getLinksByOwner(ownerId: string): Promise<ShortLink[]> {
  const redis = getRedis();
  if (!redis) return [];
  const slugs = (await redis.smembers(ownerKey(ownerId))) as string[];
  if (!slugs?.length) return [];
  const keys = slugs.map((s) => linkKey(s));
  const links = (await redis.mget(...keys)) as (ShortLink | null)[];
  return links.filter((l): l is ShortLink => l != null).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createLinkServer(
  ownerId: string,
  params: CreateLinkParams
): Promise<ShortLink | { error: string }> {
  const redis = getRedis();
  if (!redis) {
    return {
      error:
        "Server storage is not configured. Add Upstash Redis (see README) and redeploy.",
    };
  }

  let slug: string;

  if (params.customSlug) {
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(params.customSlug)) {
      return { error: "Slug must be 3–30 characters: letters, numbers, hyphens, underscores only." };
    }
    const taken = await redis.get(linkKey(params.customSlug));
    if (taken) {
      return { error: "This custom slug is already taken. Please choose another." };
    }
    slug = params.customSlug;
  } else {
    let attempts = 0;
    do {
      slug = generateSlug();
      attempts += 1;
    } while ((await redis.get(linkKey(slug))) && attempts < 10);
    if (attempts >= 10) {
      return { error: "Could not generate a unique slug. Please try again." };
    }
  }

  let urlWithUtm = params.originalUrl;
  if (params.utmSource || params.utmMedium || params.utmCampaign) {
    try {
      const url = new URL(params.originalUrl);
      if (params.utmSource) url.searchParams.set("utm_source", params.utmSource);
      if (params.utmMedium) url.searchParams.set("utm_medium", params.utmMedium);
      if (params.utmCampaign) url.searchParams.set("utm_campaign", params.utmCampaign);
      urlWithUtm = url.toString();
    } catch {
      // keep original
    }
  }

  const base = getBaseUrl();
  const newLink: ShortLink = {
    id: `zl_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    slug,
    originalUrl: urlWithUtm,
    shortUrl: buildShortUrl(slug, base),
    title: params.title,
    clicks: 0,
    createdAt: new Date().toISOString(),
    expiresAt: params.expiresAt,
    customSlug: !!params.customSlug,
    tags: params.tags || [],
    clickHistory: [],
    isActive: true,
    password: params.password,
    utmSource: params.utmSource,
    utmMedium: params.utmMedium,
    utmCampaign: params.utmCampaign,
    ownerId,
  };

  await redis.set(linkKey(slug), newLink);
  await redis.sadd(ownerKey(ownerId), slug);
  return newLink;
}

async function persistLink(link: ShortLink): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(linkKey(link.slug), link);
}

export async function incrementClicksServer(slug: string): Promise<ShortLink | null> {
  const link = await getLinkBySlug(slug);
  if (!link) return null;

  link.clicks += 1;
  const today = new Date().toISOString().split("T")[0];
  const history = link.clickHistory || [];
  const todayEntry = history.find((h) => h.date === today);
  if (todayEntry) todayEntry.count += 1;
  else history.push({ date: today, count: 1 });
  link.clickHistory = history;

  await persistLink(link);
  return link;
}

export async function deleteLinkServer(slug: string, ownerId: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const link = await getLinkBySlug(slug);
  if (!link || link.ownerId !== ownerId) return false;
  await redis.del(linkKey(slug));
  await redis.srem(ownerKey(ownerId), slug);
  return true;
}

export async function toggleLinkServer(slug: string, ownerId: string): Promise<ShortLink | null> {
  const link = await getLinkBySlug(slug);
  if (!link || link.ownerId !== ownerId) return null;
  link.isActive = !link.isActive;
  await persistLink(link);
  return link;
}

export async function verifyPasswordServer(
  slug: string,
  password: string
): Promise<{ ok: true; originalUrl: string } | { ok: false }> {
  const link = await getLinkBySlug(slug);
  if (!link || link.password !== password) return { ok: false };
  await incrementClicksServer(slug);
  return { ok: true, originalUrl: link.originalUrl };
}

export { isRedisConfigured };
