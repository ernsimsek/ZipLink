"use client";

import { useState } from "react";
import { Link2, ChevronDown, Tag, Calendar, Lock, Zap, BarChart2, Plus, X } from "lucide-react";
import { createLink, ShortLink } from "@/lib/store";
import { isValidUrl } from "@/lib/utils";
import { clsx } from "clsx";

const PRESET_TAGS = ["marketing", "social", "campaign", "product", "personal", "work"];

interface ShortenFormProps {
  onCreated: (link: ShortLink) => void;
  onError: (msg: string) => void;
}

export function ShortenForm({ onCreated, onError }: ShortenFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUTM, setShowUTM] = useState(false);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("Please enter a URL");
      return;
    }

    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    if (!isValidUrl(normalized)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate async

    const result = createLink({
      originalUrl: normalized,
      customSlug: customSlug.trim() || undefined,
      title: title.trim() || undefined,
      expiresAt: expiresAt || undefined,
      password: password.trim() || undefined,
      tags,
      utmSource: utmSource.trim() || undefined,
      utmMedium: utmMedium.trim() || undefined,
      utmCampaign: utmCampaign.trim() || undefined,
    });

    setLoading(false);

    if ("error" in result) {
      onError(result.error);
    } else {
      onCreated(result);
      // Reset form
      setUrl("");
      setTitle("");
      setCustomSlug("");
      setExpiresAt("");
      setPassword("");
      setTags([]);
      setUtmSource("");
      setUtmMedium("");
      setUtmCampaign("");
      setShowAdvanced(false);
      setShowUTM(false);
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const t = customTag.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setCustomTag("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Main URL input */}
      <div className="animated-border rounded-2xl">
        <div className="glass-strong rounded-2xl p-2 flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500">
              <Link2 size={18} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError("");
              }}
              placeholder="Paste your long URL here..."
              className="zip-input w-full pl-11 pr-4 py-4 rounded-xl text-base font-body"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-4 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
            ) : (
              <Zap size={16} />
            )}
            {loading ? "Zipping..." : "Zip It"}
          </button>
        </div>
      </div>

      {urlError && (
        <p className="text-ember text-sm mt-2 ml-1">{urlError}</p>
      )}

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-200 transition-colors mt-4 ml-1"
      >
        <ChevronDown
          size={15}
          className={clsx("transition-transform", showAdvanced && "rotate-180")}
        />
        Advanced options
        {(customSlug || password || expiresAt || tags.length > 0) && (
          <span className="w-2 h-2 rounded-full bg-acid" />
        )}
      </button>

      {showAdvanced && (
        <div className="mt-4 space-y-4 animate-slide-up">
          {/* Row 1: Title + Custom Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider mb-1.5 block">
                Link Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Campaign"
                className="zip-input w-full px-4 py-3 rounded-xl text-sm font-body"
              />
            </div>
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider mb-1.5 block">
                Custom Slug
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 text-sm font-mono">
                  zl/
                </span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-link"
                  className="zip-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Expiry + Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar size={11} />
                Expiry Date
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="zip-input w-full px-4 py-3 rounded-xl text-sm font-body"
              />
            </div>
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock size={11} />
                Password Protect
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty for no protection"
                className="zip-input w-full px-4 py-3 rounded-xl text-sm font-body"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-ink-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag size={11} />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs border transition-all font-body",
                    tags.includes(tag)
                      ? "bg-acid/15 text-acid border-acid/30"
                      : "glass text-ink-400 border-white/8 hover:border-white/15 hover:text-ink-200"
                  )}
                >
                  {tag}
                </button>
              ))}
              {/* Custom tag */}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                  placeholder="custom..."
                  className="zip-input w-24 px-3 py-1.5 rounded-full text-xs font-body"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="text-ink-500 hover:text-acid transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            {/* Selected custom tags */}
            {tags.filter((t) => !PRESET_TAGS.includes(t)).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border glass text-ink-300 border-white/10 mt-2 mr-2"
              >
                {tag}
                <button type="button" onClick={() => toggleTag(tag)}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>

          {/* UTM Builder */}
          <div>
            <button
              type="button"
              onClick={() => setShowUTM(!showUTM)}
              className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-200 transition-colors"
            >
              <BarChart2 size={14} />
              UTM Parameters
              <ChevronDown
                size={13}
                className={clsx("transition-transform", showUTM && "rotate-180")}
              />
              {(utmSource || utmMedium || utmCampaign) && (
                <span className="w-2 h-2 rounded-full bg-acid" />
              )}
            </button>
            {showUTM && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {[
                  { label: "Source", value: utmSource, setter: setUtmSource, placeholder: "google" },
                  { label: "Medium", value: utmMedium, setter: setUtmMedium, placeholder: "cpc" },
                  { label: "Campaign", value: utmCampaign, setter: setUtmCampaign, placeholder: "summer-sale" },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label}>
                    <label className="text-xs text-ink-600 mb-1 block">utm_{label.toLowerCase()}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className="zip-input w-full px-3 py-2.5 rounded-xl text-sm font-mono"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
