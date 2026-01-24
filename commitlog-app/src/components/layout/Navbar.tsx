"use client";

import React from "react";
import { signIn } from "next-auth/react";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e9f1ee] dark:border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white">
              terminal
            </span>
          </div>
          <h2 className="text-lg font-extrabold tracking-tight">CommitLog</h2>
        </div>

        {/* <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
          <a href="#community" className="text-sm font-medium hover:text-primary transition-colors">Community</a>
        </nav> */}

        <div className="flex items-center gap-4">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="hidden sm:block text-sm font-bold"
          >
            Log in
          </button>

          {/* <button className="bg-primary text-[#101915] px-5 py-2 rounded-lg text-sm font-bold soft-shadow hover:brightness-105 transition-all">
            Get Started
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
