"use client";

import React from "react";

const BountyBanner: React.FC = () => {
  return (
    <div className="fixed top-16 w-full z-40 bg-gradient-to-r from-primary to-primary/80 text-[#101915] py-3 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-white/20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-bold">
        <div className="flex items-center gap-2">
          <span>
            🎉 BOUNTY ALERT: $10 in Claude credits to 2 users who commit 10+
            times/week for the next 2 weeks!
          </span>
        </div>
        <a
          href="/bounty"
          className="underline hover:no-underline transition-all whitespace-nowrap"
        >
          Learn more →
        </a>
      </div>
    </div>
  );
};

export default BountyBanner;
