export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function getFavicon(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return "";
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  return Promise.resolve();
}

export function generateQRCodeDataURL(text: string): Promise<string> {
  return import("qrcode").then((QRCode) => {
    return QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0e0e0c",
        light: "#f0f0ef",
      },
    });
  });
}

export const TAG_COLORS: Record<string, string> = {
  marketing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  social: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  campaign: "bg-acid/20 text-acid border-acid/30",
  product: "bg-ember/20 text-ember border-ember/30",
  personal: "bg-green-500/20 text-green-300 border-green-500/30",
  work: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] || "bg-ink-700/50 text-ink-300 border-ink-600/30";
}
