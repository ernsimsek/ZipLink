import {
  Zap,
  BarChart2,
  QrCode,
  Lock,
  Tag,
  Clock,
  MousePointerClick,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Zipping",
    desc: "Shorten any URL in milliseconds. Blazing-fast redirects with 99.9% uptime.",
    color: "#00d4ff",
    border: "rgba(0,212,255,0.2)",
    glow: "rgba(0,212,255,0.1)",
  },
  {
    icon: BarChart2,
    title: "Click Analytics",
    desc: "Track every click with a 14-day history chart. See exactly when your links perform.",
    color: "#7c3aed",
    border: "rgba(124,58,237,0.2)",
    glow: "rgba(124,58,237,0.1)",
  },
  {
    icon: QrCode,
    title: "QR Code Generator",
    desc: "Auto-generate downloadable QR codes for every link. Perfect for print & offline use.",
    color: "#00d4ff",
    border: "rgba(0,212,255,0.2)",
    glow: "rgba(0,212,255,0.1)",
  },
  {
    icon: Lock,
    title: "Password Protection",
    desc: "Add a password to sensitive links. Only authorized users can access the destination.",
    color: "#ff2d78",
    border: "rgba(255,45,120,0.2)",
    glow: "rgba(255,45,120,0.1)",
  },
  {
    icon: Tag,
    title: "Smart Tagging",
    desc: "Organize links with custom tags. Filter and manage campaigns at a glance.",
    color: "#7c3aed",
    border: "rgba(124,58,237,0.2)",
    glow: "rgba(124,58,237,0.1)",
  },
  {
    icon: Clock,
    title: "Link Expiry",
    desc: "Set automatic expiration dates. Links become inactive exactly when you want.",
    color: "#00d4ff",
    border: "rgba(0,212,255,0.2)",
    glow: "rgba(0,212,255,0.1)",
  },
  {
    icon: MousePointerClick,
    title: "UTM Builder",
    desc: "Append UTM parameters automatically. Perfect for Google Analytics campaigns.",
    color: "#ff2d78",
    border: "rgba(255,45,120,0.2)",
    glow: "rgba(255,45,120,0.1)",
  },
  {
    icon: Sparkles,
    title: "Custom Slugs",
    desc: "Create memorable, branded short links with your own custom slug names.",
    color: "#7c3aed",
    border: "rgba(124,58,237,0.2)",
    glow: "rgba(124,58,237,0.1)",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p
          className="text-xs uppercase tracking-[0.4em] mb-4"
          style={{ color: "rgba(0,212,255,0.6)", fontFamily: "var(--font-mono)" }}
        >
          ◆ Everything you need ◆
        </p>
        <h2
          className="text-5xl sm:text-6xl text-white mb-4"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}
        >
          NOT JUST A{" "}
          <span className="gradient-text">SHORTENER</span>
        </h2>
        <p className="text-white/40 text-lg mt-4 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
          ZipLink packs everything you need to create, manage, and measure your links — without the complexity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, title, desc, color, border, glow }) => (
          <div
            key={title}
            className="glass rounded-2xl p-5 transition-all group cursor-default scan-container"
            style={{ borderColor: border }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.5), 0 0 30px ${glow}`;
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <h3 className="font-semibold text-white mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
