"use client";

import { Zap, Github } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9">
          <div className="absolute inset-0 rounded-lg bg-[#00d4ff] opacity-20 blur-md animate-pulse" />
          <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: "linear-gradient(135deg, #00d4ff, #0099cc)", boxShadow: "0 0 20px rgba(0,212,255,0.5)" }}>
            <Zap size={18} className="text-[#020b18]" fill="currentColor" />
          </div>
        </div>
        <span className="font-display text-xl tracking-widest text-white" style={{ textShadow: "0 0 20px rgba(0,212,255,0.5)" }}>
          ZIPLINK
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {["Features", "Docs", "Pricing"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm text-white/40 hover:text-[#00d4ff] transition-all font-body tracking-wide hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/8 text-white/40 hover:text-[#00d4ff] transition-all text-sm hover:border-[#00d4ff]/30"
        >
          <Github size={15} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <button className="btn-primary px-5 py-2 rounded-lg text-sm tracking-wide">
          Get Started
        </button>
      </div>
    </header>
  );
}
