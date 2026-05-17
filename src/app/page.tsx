"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Download, SortAsc } from "lucide-react";
import { ShortLink, getAllLinks, getStats, exportLinksAsCSV } from "@/lib/store";
import { Header } from "@/components/Header";
import { ShortenForm } from "@/components/ShortenForm";
import { LinkCard } from "@/components/LinkCard";
import { SuccessBanner } from "@/components/SuccessBanner";
import { StatsBar } from "@/components/StatsBar";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TickerTape } from "@/components/TickerTape";
import { ToastContainer, useToast } from "@/components/Toast";
import { clsx } from "clsx";

type SortOption = "newest" | "oldest" | "most-clicks" | "alphabetical";
type FilterOption = "all" | "active" | "inactive" | "expired";

export default function Home() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [newLink, setNewLink] = useState<ShortLink | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const refreshLinks = useCallback(async () => {
    const list = await getAllLinks();
    setLinks(list);
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshLinks();
  }, [refreshLinks]);

  const stats = mounted ? getStats(links) : { totalLinks: 0, totalClicks: 0, activeLinks: 0 };

  const handleCreated = useCallback(
    (link: ShortLink) => {
      setNewLink(link);
      refreshLinks();
      addToast("Link zipped successfully!", "success");
    },
    [addToast, refreshLinks]
  );

  const handleDelete = useCallback(
    (_id: string) => {
      refreshLinks();
      addToast("Link deleted.", "info");
    },
    [addToast, refreshLinks]
  );

  const handleToggle = useCallback(() => {
    refreshLinks();
  }, [refreshLinks]);

  const handleCopy = useCallback((msg: string) => {
    addToast(msg, "success");
  }, [addToast]);

  const allTags = Array.from(new Set(links.flatMap((l) => l.tags || [])));

  const filtered = links
    .filter((link) => {
      if (filter === "active") return link.isActive && !(link.expiresAt && new Date(link.expiresAt) < new Date());
      if (filter === "inactive") return !link.isActive;
      if (filter === "expired") return link.expiresAt && new Date(link.expiresAt) < new Date();
      return true;
    })
    .filter((link) => {
      if (!selectedTag) return true;
      return link.tags?.includes(selectedTag);
    })
    .filter((link) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        link.slug.toLowerCase().includes(q) ||
        link.originalUrl.toLowerCase().includes(q) ||
        (link.title || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "most-clicks") return b.clicks - a.clicks;
      if (sort === "alphabetical") return a.slug.localeCompare(b.slug);
      return 0;
    });

  const handleExportCSV = () => {
    const csv = exportLinksAsCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ziplink-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported!", "success");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "#020b18" }}>
      {/* === BACKGROUND === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,212,255,0.08) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Big electric orbs */}
        <div
          className="absolute"
          style={{
            top: "-200px", left: "50%", transform: "translateX(-50%)",
            width: "900px", height: "500px",
            background: "radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "200px", right: "-150px",
            width: "500px", height: "500px",
            background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "0", left: "-100px",
            width: "500px", height: "400px",
            background: "radial-gradient(ellipse, rgba(255,45,120,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Horizontal scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 50%, transparent 100%)",
            animation: "scanFull 8s ease-in-out infinite",
            top: "30%",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes scanFull {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes float3d {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50% { transform: translateY(-12px) rotateX(2deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes particleFloat {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px) translateX(30px); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <Header />

      {/* === HERO === */}
      <main className="relative z-10 px-6 pt-8 pb-4 max-w-4xl mx-auto">
        <div className="text-center mb-12" style={{ animation: "float3d 6s ease-in-out infinite" }}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs tracking-widest uppercase"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "#00d4ff",
              fontFamily: "var(--font-mono)",
              boxShadow: "0 0 20px rgba(0,212,255,0.15)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" style={{ animation: "glowPulse 1.5s ease-in-out infinite", boxShadow: "0 0 6px #00d4ff" }} />
            Free URL Shortener — No signup required
          </div>

          {/* Title */}
          <h1
            className="leading-none text-white mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 10vw, 110px)",
              letterSpacing: "0.04em",
            }}
          >
            ZIP YOUR
            <br />
            <span className="gradient-text" style={{ display: "inline-block" }}>LINKS.</span>
          </h1>

          <p className="text-white/40 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Shorten, track & manage your URLs with analytics,
            QR codes, custom slugs, and more.
          </p>
        </div>

        {/* Shorten Form */}
        <ShortenForm onCreated={handleCreated} onError={(msg) => addToast(msg, "error")} />

        {/* Success Banner */}
        {newLink && (
          <div className="mt-4">
            <SuccessBanner
              link={newLink}
              onDismiss={() => setNewLink(null)}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* Stats */}
        {mounted && links.length > 0 && (
          <div className="mt-8">
            <StatsBar
              totalLinks={stats.totalLinks}
              totalClicks={stats.totalClicks}
              activeLinks={stats.activeLinks}
            />
          </div>
        )}
      </main>

      {/* Ticker tape */}
      <div className="relative z-10 mt-8">
        <TickerTape />
      </div>

      {/* Links section */}
      {mounted && links.length > 0 && (
        <section className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2
              className="text-3xl text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}
            >
              YOUR{" "}
              <span className="gradient-text-blue">LINKS</span>
              <span className="ml-3 text-lg" style={{ color: "rgba(226,240,255,0.3)", fontFamily: "var(--font-mono)" }}>
                ({filtered.length})
              </span>
            </h2>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-sm glass px-3 py-2 rounded-lg transition-all hover:border-[#00d4ff]/30"
              style={{ color: "rgba(226,240,255,0.5)", fontFamily: "var(--font-body)" }}
            >
              <Download size={13} />
              Export CSV
            </button>
          </div>

          {/* Filters toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,212,255,0.5)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search links..."
                className="zip-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} style={{ color: "rgba(226,240,255,0.3)" }} />
              {(["all", "active", "inactive", "expired"] as FilterOption[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-xs capitalize transition-all",
                    filter === f
                      ? ""
                      : "glass hover:border-white/15"
                  )}
                  style={
                    filter === f
                      ? {
                          background: "rgba(0,212,255,0.12)",
                          border: "1px solid rgba(0,212,255,0.35)",
                          color: "#00d4ff",
                          fontFamily: "var(--font-body)",
                        }
                      : { color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SortAsc size={14} style={{ color: "rgba(226,240,255,0.3)" }} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="zip-input px-3 py-2 rounded-xl text-xs cursor-pointer"
                style={{ fontFamily: "var(--font-body)", background: "rgba(0,15,40,0.8)" }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most-clicks">Most Clicks</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </div>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedTag("")}
                className="px-3 py-1 rounded-full text-xs border transition-all"
                style={
                  !selectedTag
                    ? { background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }
                    : { background: "transparent", color: "rgba(226,240,255,0.4)", borderColor: "rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }
                }
              >
                All tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className="px-3 py-1 rounded-full text-xs border transition-all"
                  style={
                    selectedTag === tag
                      ? { background: "rgba(0,212,255,0.12)", color: "#00d4ff", borderColor: "rgba(0,212,255,0.35)", fontFamily: "var(--font-body)" }
                      : { background: "transparent", color: "rgba(226,240,255,0.4)", borderColor: "rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }
                  }
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Links list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "rgba(226,240,255,0.3)" }}>
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p style={{ fontFamily: "var(--font-body)" }}>No links match your filters</p>
              </div>
            ) : (
              filtered.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  onCopy={handleCopy}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* Empty state */}
      {mounted && links.length === 0 && (
        <div className="relative z-10 text-center py-16 px-6 max-w-md mx-auto">
          <div
            className="text-5xl mb-4"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,212,255,0.6))", animation: "float3d 4s ease-in-out infinite" }}
          >
            ⚡
          </div>
          <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
            READY TO ZIP
          </h3>
          <p className="text-sm" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }}>
            Paste your first URL above to get started. Your links are stored locally in your browser.
          </p>
        </div>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <footer
        className="relative z-10 py-8 px-6 max-w-6xl mx-auto"
        style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00d4ff, #0099cc)" }}
            >
              <span className="text-[#020b18] text-xs font-bold">Z</span>
            </div>
            <span className="text-white/40 tracking-widest text-sm" style={{ fontFamily: "var(--font-display)" }}>
              ZIPLINK
            </span>
          </div>
          <p className="text-xs" style={{ color: "rgba(226,240,255,0.25)", fontFamily: "var(--font-body)" }}>
            © {new Date().getFullYear()} ZipLink. Links stored locally in your browser.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-xs transition-colors" style={{ color: "rgba(226,240,255,0.3)", fontFamily: "var(--font-body)" }}
                 onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#00d4ff"; }}
                 onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(226,240,255,0.3)"; }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
