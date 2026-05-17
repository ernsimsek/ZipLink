"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  QrCode,
  Trash2,
  ExternalLink,
  BarChart2,
  Power,
  ChevronDown,
  Tag,
  Calendar,
  Lock,
} from "lucide-react";
import { ShortLink, resolveShortUrl, toggleLinkStatus, deleteLink } from "@/lib/store";
import { copyToClipboard, getFavicon, getDomain, timeAgo, getTagColor, formatNumber } from "@/lib/utils";
import { QRModal } from "./QRModal";
import { StatsChart } from "./StatsChart";
import { clsx } from "clsx";

interface LinkCardProps {
  link: ShortLink;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onCopy: (msg: string) => void;
}

export function LinkCard({ link, onDelete, onToggle, onCopy }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  const shortUrl = resolveShortUrl(link);

  const handleCopy = async () => {
    await copyToClipboard(shortUrl);
    setCopied(true);
    onCopy("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await deleteLink(link.id);
      onDelete(link.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleToggle = async () => {
    await toggleLinkStatus(link.id);
    onToggle(link.id);
  };

  return (
    <>
      <div
        className={clsx(
          "link-card glass rounded-2xl border p-4 sm:p-5",
          link.isActive && !isExpired
            ? "border-white/8"
            : "border-white/4 opacity-60"
        )}
      >
        {/* Top Row */}
        <div className="flex items-start gap-3">
          {/* Favicon */}
          <div className="w-8 h-8 rounded-lg bg-ink-800 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFavicon(link.originalUrl)}
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-acid font-mono text-sm font-medium">
                zl/{link.slug}
              </span>
              {link.customSlug && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-acid/10 text-acid/70 border border-acid/20 font-body">
                  custom
                </span>
              )}
              {link.password && (
                <Lock size={12} className="text-ink-500" />
              )}
              {isExpired && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-ember/10 text-ember border border-ember/20">
                  expired
                </span>
              )}
              {!link.isActive && !isExpired && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-ink-700 text-ink-400 border border-ink-600">
                  paused
                </span>
              )}
            </div>

            <p className="text-ink-400 text-xs mt-0.5 truncate">
              {getDomain(link.originalUrl)}
            </p>

            {link.title && (
              <p className="text-ink-200 text-sm mt-1 font-medium truncate">
                {link.title}
              </p>
            )}
          </div>

          {/* Stats badge */}
          <div className="text-right shrink-0">
            <div className="text-lg font-display text-acid leading-none">
              {formatNumber(link.clicks)}
            </div>
            <div className="text-xs text-ink-500 mt-0.5">clicks</div>
          </div>
        </div>

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {link.tags.map((tag) => (
              <span
                key={tag}
                className={clsx(
                  "text-[11px] px-2 py-0.5 rounded-full border font-body flex items-center gap-1",
                  getTagColor(tag)
                )}
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={handleCopy}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              copied
                ? "bg-acid/15 text-acid border border-acid/30"
                : "glass hover:bg-white/8 text-ink-300 hover:text-ink-100 border border-white/5"
            )}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/8 text-ink-300 hover:text-ink-100 border border-white/5 transition-all"
          >
            <QrCode size={13} />
            QR
          </button>

          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/8 text-ink-300 hover:text-ink-100 border border-white/5 transition-all"
          >
            <ExternalLink size={13} />
            Visit
          </a>

          <button
            onClick={handleToggle}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              link.isActive
                ? "glass hover:bg-white/8 text-ink-300 hover:text-ink-100 border-white/5"
                : "bg-acid/10 text-acid border-acid/20 hover:bg-acid/20"
            )}
          >
            <Power size={13} />
            {link.isActive ? "Pause" : "Resume"}
          </button>

          <button
            onClick={handleDelete}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ml-auto",
              confirmDelete
                ? "bg-ember/20 text-ember border-ember/30"
                : "glass hover:bg-ember/10 text-ink-500 hover:text-ember border-white/5"
            )}
          >
            <Trash2 size={13} />
            {confirmDelete ? "Confirm?" : "Delete"}
          </button>

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={clsx(
              "flex items-center gap-1 text-xs text-ink-500 hover:text-ink-300 transition-all ml-1",
            )}
          >
            <BarChart2 size={13} />
            <ChevronDown
              size={12}
              className={clsx("transition-transform", expanded && "rotate-180")}
            />
          </button>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-ink-600">
            <Calendar size={11} />
            {timeAgo(link.createdAt)}
          </div>
          {link.expiresAt && !isExpired && (
            <div className="flex items-center gap-1.5 text-xs text-ink-600">
              <span>Expires {new Date(link.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
          )}
          {(link.utmSource || link.utmMedium || link.utmCampaign) && (
            <div className="text-xs text-ink-600 flex items-center gap-1">
              <span className="text-ink-700">UTM</span>
              <span className="text-acid/60">active</span>
            </div>
          )}
        </div>

        {/* Expanded chart */}
        {expanded && <StatsChart link={link} />}
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
