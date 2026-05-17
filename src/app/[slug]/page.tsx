"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLinkBySlug, incrementClicks, isExpired } from "@/lib/store";
import { Zap, Lock, AlertTriangle, ExternalLink } from "lucide-react";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [status, setStatus] = useState<"loading" | "redirecting" | "expired" | "inactive" | "notfound" | "password">("loading");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [destination, setDestination] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!slug) return;
    const link = getLinkBySlug(slug);

    if (!link) { setStatus("notfound"); return; }
    if (isExpired(link)) { setStatus("expired"); return; }
    if (!link.isActive) { setStatus("inactive"); return; }
    if (link.password) { setStatus("password"); setDestination(link.originalUrl); return; }

    incrementClicks(slug);
    setDestination(link.originalUrl);
    setStatus("redirecting");
  }, [slug]);

  useEffect(() => {
    if (status !== "redirecting") return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          window.location.href = destination;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, destination]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = getLinkBySlug(slug);
    if (!link) return;
    if (password === link.password) {
      incrementClicks(slug);
      window.location.href = link.originalUrl;
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const Card = ({ children, borderColor = "rgba(0,212,255,0.2)" }: { children: React.ReactNode; borderColor?: string }) => (
    <div
      className="glass-strong rounded-2xl p-8 max-w-md w-full scan-container"
      style={{ borderColor }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#020b18" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,212,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-lg" style={{ background: "#00d4ff", opacity: 0.2, filter: "blur(8px)" }} />
            <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #00d4ff, #0099cc)", boxShadow: "0 0 20px rgba(0,212,255,0.5)" }}>
              <Zap size={18} className="text-[#020b18]" fill="currentColor" />
            </div>
          </div>
          <span className="text-white tracking-widest text-xl" style={{ fontFamily: "var(--font-display)" }}>ZIPLINK</span>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div>
            <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
                 style={{ borderColor: "rgba(0,212,255,0.3)", borderTopColor: "#00d4ff" }} />
            <p style={{ color: "rgba(226,240,255,0.5)", fontFamily: "var(--font-body)" }}>Looking up your link...</p>
          </div>
        )}

        {/* Redirecting */}
        {status === "redirecting" && (
          <Card>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "2px solid rgba(0,212,255,0.3)",
                boxShadow: "0 0 40px rgba(0,212,255,0.3)",
              }}
            >
              <span className="text-4xl font-bold" style={{ color: "#00d4ff", fontFamily: "var(--font-display)", textShadow: "0 0 20px rgba(0,212,255,0.8)" }}>
                {countdown}
              </span>
            </div>
            <h1 className="text-3xl text-white mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
              REDIRECTING
            </h1>
            <p className="text-sm mb-4" style={{ color: "rgba(226,240,255,0.5)", fontFamily: "var(--font-body)" }}>
              You&apos;ll be taken to:
            </p>
            <p className="text-xs break-all rounded-lg px-4 py-3 mb-6"
               style={{ color: "rgba(226,240,255,0.5)", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", fontFamily: "var(--font-mono)" }}>
              {destination}
            </p>
            <button
              onClick={() => { window.location.href = destination; }}
              className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ExternalLink size={15} />
              Go Now
            </button>
          </Card>
        )}

        {/* Password */}
        {status === "password" && (
          <Card borderColor="rgba(124,58,237,0.3)">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}
            >
              <Lock size={24} style={{ color: "#7c3aed" }} />
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              PASSWORD REQUIRED
            </h1>
            <p className="text-sm mb-6" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }}>
              This link is password protected. Enter the password to continue.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="zip-input w-full px-4 py-3 rounded-xl text-center text-sm"
                style={{
                  fontFamily: "var(--font-mono)",
                  borderColor: passwordError ? "rgba(255,45,120,0.6)" : undefined,
                }}
                autoFocus
              />
              {passwordError && (
                <p className="text-sm" style={{ color: "#ff2d78" }}>Incorrect password. Try again.</p>
              )}
              <button type="submit" className="btn-primary w-full py-3 rounded-xl">
                Unlock
              </button>
            </form>
          </Card>
        )}

        {/* Expired */}
        {status === "expired" && (
          <Card borderColor="rgba(255,45,120,0.3)">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(255,45,120,0.1)", border: "1px solid rgba(255,45,120,0.3)" }}
            >
              <AlertTriangle size={24} style={{ color: "#ff2d78" }} />
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>LINK EXPIRED</h1>
            <p className="text-sm mb-6" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }}>
              This link has passed its expiration date and is no longer active.
            </p>
            <button onClick={() => router.push("/")} className="btn-primary w-full py-3 rounded-xl">
              Create a New Link
            </button>
          </Card>
        )}

        {/* Inactive */}
        {status === "inactive" && (
          <Card>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: "rgba(226,240,255,0.05)", border: "1px solid rgba(226,240,255,0.1)" }}>
              <span className="text-2xl">⏸</span>
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>LINK PAUSED</h1>
            <p className="text-sm mb-6" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }}>
              This link has been temporarily paused by its owner.
            </p>
            <button onClick={() => router.push("/")} className="btn-primary w-full py-3 rounded-xl">
              Go to ZipLink
            </button>
          </Card>
        )}

        {/* Not found */}
        {status === "notfound" && (
          <Card>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: "rgba(226,240,255,0.04)", border: "1px solid rgba(226,240,255,0.08)" }}>
              <span className="text-3xl" style={{ color: "rgba(226,240,255,0.3)", fontFamily: "var(--font-display)" }}>?</span>
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>NOT FOUND</h1>
            <p className="text-sm mb-2" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-body)" }}>
              The link <span style={{ fontFamily: "var(--font-mono)", color: "rgba(226,240,255,0.7)" }}>/{slug}</span> doesn&apos;t exist or has been deleted.
            </p>
            <p className="text-xs mb-6" style={{ color: "rgba(226,240,255,0.25)", fontFamily: "var(--font-body)" }}>
              Note: Links are stored locally in the browser where they were created.
            </p>
            <button onClick={() => router.push("/")} className="btn-primary w-full py-3 rounded-xl">
              Create a New Link
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
