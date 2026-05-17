"use client";

import { ShortLink } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

interface StatsChartProps {
  link: ShortLink;
}

export function StatsChart({ link }: StatsChartProps) {
  const history = link.clickHistory || [];

  // Build last 14 days
  const days: { date: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const entry = history.find((h) => h.date === dateStr);
    days.push({
      date: dateStr,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: entry?.count || 0,
    });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-1 h-20">
        {days.map((day, i) => {
          const heightPct = (day.count / maxCount) * 100;
          const isToday = i === days.length - 1;
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              {/* Tooltip */}
              {day.count > 0 && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                  <div className="glass-strong rounded-lg px-2 py-1 whitespace-nowrap text-xs text-ink-200 border border-white/10">
                    <span className="font-semibold text-acid">{day.count}</span>
                    <span className="text-ink-500 ml-1">{day.label}</span>
                  </div>
                </div>
              )}
              <div className="w-full flex items-end justify-center h-16">
                <div
                  className={`w-full rounded-t-sm chart-bar transition-all ${
                    isToday ? "bg-acid" : "bg-acid/30 group-hover:bg-acid/60"
                  }`}
                  style={{
                    height: `${Math.max(heightPct, day.count > 0 ? 4 : 0)}%`,
                    animationDelay: `${i * 30}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-ink-600">14 days ago</span>
        <span className="text-xs text-ink-400">
          Total <span className="text-acid font-semibold">{formatNumber(link.clicks)}</span> clicks
        </span>
        <span className="text-xs text-ink-600">today</span>
      </div>
    </div>
  );
}
