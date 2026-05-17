"use client";

import { useState } from "react";
import { Check, Copy, QrCode, X, ExternalLink } from "lucide-react";
import { ShortLink, resolveShortUrl } from "@/lib/store";
import { copyToClipboard } from "@/lib/utils";
import { QRModal } from "./QRModal";

interface SuccessBannerProps {
  link: ShortLink;
  onDismiss: () => void;
  onCopy: (msg: string) => void;
}

export function SuccessBanner({ link, onDismiss, onCopy }: SuccessBannerProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const shortUrl = resolveShortUrl(link);

  const handleCopy = async () => {
    await copyToClipboard(shortUrl);
    setCopied(true);
    onCopy("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="relative rounded-2xl p-5 overflow-hidden scan-container"
        style={{
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.25)",
          boxShadow: "0 0 40px rgba(0,212,255,0.1)",
          animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, transparent 60%)" }} />

        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.35)",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            }}
          >
            <Check size={18} style={{ color: "#00d4ff" }} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(0,212,255,0.7)", fontFamily: "var(--font-mono)" }}>
              ✓ Link created successfully
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-medium" style={{ color: "#00d4ff", fontFamily: "var(--font-mono)", textShadow: "0 0 20px rgba(0,212,255,0.5)" }}>
                {shortUrl}
              </span>
            </div>
            <p className="text-xs mt-1 truncate" style={{ color: "rgba(226,240,255,0.35)", fontFamily: "var(--font-body)" }}>
              {link.originalUrl}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  copied
                    ? { background: "rgba(0,212,255,0.15)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.4)" }
                    : { background: "linear-gradient(135deg,#00d4ff,#0099cc)", color: "#020b18", border: "none", fontFamily: "var(--font-body)" }
                }
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium glass transition-all"
                style={{ color: "rgba(226,240,255,0.6)", fontFamily: "var(--font-body)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00d4ff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(226,240,255,0.6)"; }}
              >
                <QrCode size={14} />
                QR Code
              </button>

              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium glass transition-all"
                style={{ color: "rgba(226,240,255,0.6)", fontFamily: "var(--font-body)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00d4ff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(226,240,255,0.6)"; }}
              >
                <ExternalLink size={14} />
                Preview
              </a>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="transition-colors shrink-0 p-1"
            style={{ color: "rgba(226,240,255,0.3)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(226,240,255,0.3)"; }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showQR && (
        <QRModal
          url={shortUrl}
          title={link.title || link.slug}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}
