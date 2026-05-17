/** Base URL for short links (browser uses current origin; server uses env / Vercel). */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/$/, "");
  }

  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function buildShortUrl(slug: string, baseUrl?: string): string {
  const base = (baseUrl ?? getBaseUrl()).replace(/\/$/, "");
  return `${base}/${slug}`;
}
