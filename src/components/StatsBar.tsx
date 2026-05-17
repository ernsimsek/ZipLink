"use client";

import { formatNumber } from "@/lib/utils";
import { Link2, MousePointerClick, Activity } from "lucide-react";

interface StatsBarProps {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
}

export function StatsBar({ totalLinks, totalClicks, activeLinks }: StatsBarProps) {
  const stats = [
    { label: "Links Created", value: formatNumber(totalLinks), icon: Link2, color: "#00d4ff", glow: "rgba(0,212,255,0.4)" },
    { label: "Total Clicks", value: formatNumber(totalClicks), icon: MousePointerClick, color: "#ff2d78", glow: "rgba(255,45,120,0.4)" },
    { label: "Active Links", value: formatNumber(activeLinks), icon: Activity, color: "#7c3aed", glow: "rgba(124,58,237,0.4)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, icon: Icon, color, glow }) => (
        <div
          key={label}
          className="glass rounded-xl p-4 text-center scan-container"
          style={{ borderColor: `${color}22` }}
        >
          <div className="flex items-center justify-center mb-2" style={{ color }}>
            <Icon size={14} />
          </div>
          <div
            className="font-display text-2xl mb-0.5"
            style={{ color, textShadow: `0 0 20px ${glow}`, fontFamily: "var(--font-display)" }}
          >
            {value}
          </div>
          <div className="text-xs mt-0.5 tracking-wider uppercase" style={{ color: "rgba(226,240,255,0.4)", fontFamily: "var(--font-mono)" }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
