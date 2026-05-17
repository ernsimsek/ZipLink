export interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  customSlug?: boolean;
  tags?: string[];
  clickHistory?: { date: string; count: number }[];
  isActive: boolean;
  password?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const STORAGE_KEY = "ziplink_urls";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

function generateSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getAllLinks(): ShortLink[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLinks(links: ShortLink[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function createLink(params: {
  originalUrl: string;
  customSlug?: string;
  title?: string;
  expiresAt?: string;
  tags?: string[];
  password?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): ShortLink | { error: string } {
  const links = getAllLinks();

  const slug = params.customSlug || generateSlug();

  if (params.customSlug) {
    const existing = links.find((l) => l.slug === params.customSlug);
    if (existing) {
      return { error: "This custom slug is already taken. Please choose another." };
    }
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(params.customSlug)) {
      return { error: "Slug must be 3–30 characters: letters, numbers, hyphens, underscores only." };
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
      // keep original if URL parsing fails
    }
  }

  const newLink: ShortLink = {
    id: `zl_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    slug,
    originalUrl: urlWithUtm,
    shortUrl: `${BASE_URL}/${slug}`,
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
  };

  links.unshift(newLink);
  saveLinks(links);
  return newLink;
}

export function getLinkBySlug(slug: string): ShortLink | null {
  const links = getAllLinks();
  return links.find((l) => l.slug === slug) || null;
}

export function incrementClicks(slug: string): void {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.slug === slug);
  if (idx === -1) return;

  links[idx].clicks += 1;

  const today = new Date().toISOString().split("T")[0];
  const history = links[idx].clickHistory || [];
  const todayEntry = history.find((h) => h.date === today);
  if (todayEntry) {
    todayEntry.count += 1;
  } else {
    history.push({ date: today, count: 1 });
  }
  links[idx].clickHistory = history;

  saveLinks(links);
}

export function deleteLink(id: string): void {
  const links = getAllLinks().filter((l) => l.id !== id);
  saveLinks(links);
}

export function updateLink(id: string, updates: Partial<ShortLink>): ShortLink | null {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  links[idx] = { ...links[idx], ...updates };
  saveLinks(links);
  return links[idx];
}

export function toggleLinkStatus(id: string): ShortLink | null {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  links[idx].isActive = !links[idx].isActive;
  saveLinks(links);
  return links[idx];
}

export function getStats() {
  const links = getAllLinks();
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter((l) => l.isActive).length;
  const topLink = links.sort((a, b) => b.clicks - a.clicks)[0] || null;

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
    l.shortUrl,
    l.originalUrl,
    l.title || "",
    l.clicks.toString(),
    new Date(l.createdAt).toLocaleDateString(),
    l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "",
    l.isActive ? "Active" : "Inactive",
  ]);
  return [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}
