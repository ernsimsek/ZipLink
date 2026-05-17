"use client";

import { useEffect, useState } from "react";
import { X, Download, QrCode } from "lucide-react";
import { generateQRCodeDataURL } from "@/lib/utils";

interface QRModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export function QRModal({ url, title, onClose }: QRModalProps) {
  const [qrData, setQrData] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQRCodeDataURL(url).then((data) => {
      setQrData(data);
      setLoading(false);
    });
  }, [url]);

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrData;
    a.download = `ziplink-qr-${title || "code"}.png`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(2,11,24,0.85)" }} onClick={onClose} />
      <div
        className="relative rounded-2xl p-8 max-w-sm w-full scan-container"
        style={{
          background: "rgba(0,10,30,0.95)",
          border: "1px solid rgba(0,212,255,0.25)",
          boxShadow: "0 0 60px rgba(0,212,255,0.15), 0 30px 60px rgba(0,0,0,0.5)",
          animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <QrCode size={18} style={{ color: "#00d4ff" }} />
            <span className="font-semibold text-white" style={{ fontFamily: "var(--font-body)" }}>QR Code</span>
          </div>
          <button
            onClick={onClose}
            className="transition-colors p-1 rounded-lg"
            style={{ color: "rgba(226,240,255,0.4)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00d4ff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(226,240,255,0.4)"; }}
          >
            <X size={18} />
          </button>
        </div>

        {title && (
          <p className="text-sm mb-2 truncate" style={{ color: "rgba(226,240,255,0.6)", fontFamily: "var(--font-body)" }}>{title}</p>
        )}
        <p className="text-xs mb-6 truncate" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "var(--font-mono)" }}>{url}</p>

        <div
          className="rounded-xl p-4 mb-6 flex items-center justify-center"
          style={{ background: "#f0f8ff" }}
        >
          {loading ? (
            <div className="w-[180px] h-[180px] skeleton rounded-lg" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrData} alt="QR Code" className="w-[180px] h-[180px] rounded-lg" />
          )}
        </div>

        <button
          onClick={downloadQR}
          disabled={loading}
          className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download size={16} />
          Download PNG
        </button>
      </div>
    </div>
  );
}
