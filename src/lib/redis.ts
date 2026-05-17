import { Redis } from "@upstash/redis";

export function isRedisConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;
  if (!client) {
    client = new Redis({
      url: (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)!,
      token: (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)!,
    });
  }
  return client;
}

export const linkKey = (slug: string) => `ziplink:link:${slug}`;
export const ownerKey = (ownerId: string) => `ziplink:owner:${ownerId}`;
