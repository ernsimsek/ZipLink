"use client";

const items = [
  { emoji: "🔗", text: "LINKS SHORTENED" },
  { emoji: "⚡", text: "INSTANT REDIRECTS" },
  { emoji: "📊", text: "CLICK ANALYTICS" },
  { emoji: "🎯", text: "UTM TRACKING" },
  { emoji: "🔒", text: "PASSWORD PROTECT" },
  { emoji: "📱", text: "QR CODES" },
  { emoji: "🏷️", text: "SMART TAGGING" },
  { emoji: "⏰", text: "AUTO EXPIRY" },
  { emoji: "✨", text: "CUSTOM SLUGS" },
  { emoji: "🚀", text: "99.9% UPTIME" },
];

export function TickerTape() {
  // doubled for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="border-y py-3 overflow-hidden relative"
      style={{
        borderColor: "rgba(0,212,255,0.15)",
        background: "linear-gradient(90deg, rgba(0,212,255,0.03), rgba(124,58,237,0.03), rgba(0,212,255,0.03))",
      }}
    >
      {/* left/right fade */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to right, #020b18, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to left, #020b18, transparent)" }} />

      <div className="ticker-wrap">
        <div className="ticker-inner gap-0">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] whitespace-nowrap px-6"
              style={{ color: "rgba(0,212,255,0.6)", fontFamily: "var(--font-mono)" }}
            >
              <span className="text-base">{item.emoji}</span>
              {item.text}
              <span className="opacity-30 mx-2">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
