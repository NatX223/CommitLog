"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import SignupModal from "../ui/SignupModal";

export default function Hero() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error during signup:", error);
      // You could show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(133,224,186,0.15)_0%,rgba(255,255,255,0)_100%)]"></div>

        <div className="max-w-[960px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-6">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Now in Open Beta
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
            Build in Public,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#578e77] to-primary">
              Effortlessly
            </span>
          </h1>

          <p className="text-lg md:text-xl text-brand-muted dark:text-gray-400 max-w-[700px] mx-auto mb-10 leading-relaxed">
            CommitLog turns your daily workflow into engaging social updates.
            Connect your tools, let AI synthesize your progress, and grow your
            audience while you code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary text-brand-text px-8 py-4 rounded-xl text-lg font-bold shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-text/30 border-t-brand-text rounded-full animate-spin"></div>
                  Signing up...
                </>
              ) : (
                "Get Started for Free"
              )}
            </button>
            {/* <button className="w-full sm:w-auto bg-white dark:bg-white/5 border border-[#d3e4dd] dark:border-white/10 px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button> */}
          </div>

          {/* Dashboard Preview */}
          {/* <div className="mt-20 relative">
            <div className="rounded-2xl border border-[#d3e4dd] dark:border-white/10 bg-white/50 dark:bg-white/5 p-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="bg-white dark:bg-[#1a1e22] rounded-xl overflow-hidden aspect-video relative flex items-center justify-center border border-[#d3e4dd] dark:border-white/10">
                <div className="absolute top-0 left-0 w-full h-8 bg-gray-50 dark:bg-black/20 flex items-center px-4 gap-2">
                  <div className="size-2 rounded-full bg-red-400"></div>
                  <div className="size-2 rounded-full bg-yellow-400"></div>
                  <div className="size-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex flex-col items-center gap-4 text-gray-400">
                  <span className="material-symbols-outlined text-6xl opacity-20">
                    dashboard
                  </span>
                  <p className="text-sm font-medium">
                    CommitLog Dashboard Interface
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </>
  );
}
