"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BountyBanner from "@/components/ui/BountyBanner";

export default function BountyPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <BountyBanner />
      <main className="pt-16 min-h-screen bg-background-light dark:bg-background-dark">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <span className="material-symbols-outlined text-lg">emoji_events</span>
              ACTIVE BOUNTY
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              $10 Claude Credits Bounty
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Commit consistently, get rewarded. We're giving away $10 in Claude credits to 2 users who show dedication to building in public.
            </p>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-[1000px] mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-center mb-12">How to Win</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl soft-shadow">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-white">commit</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Commit Consistently</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Make 10+ commits per week for 2 consecutive weeks. Quality matters - meaningful commits to real projects.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl soft-shadow">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-white">link</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Connect GitHub</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Link your GitHub account to CommitLog so we can track your commits automatically.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl soft-shadow">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-white">public</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Build in Public</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use CommitLog to share your progress. Show the world what you're building!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-center mb-12">Bounty Timeline</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Week 1: Start Strong</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sign up for CommitLog, connect your GitHub, and start making consistent commits. Aim for 10+ commits this week.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Week 2: Keep Going</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Maintain the momentum! Another 10+ commits this week to qualify for the bounty.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Winners Announced</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We'll review all qualifying participants and select 2 winners based on consistency and commit quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-center mb-12">Rules & Guidelines</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl soft-shadow">
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Commits can be to public or private repositories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Quality over quantity - meaningful commits count more than trivial changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Must be an active CommitLog user during the bounty period</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Winners will be contacted via email associated with their GitHub account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Claude credits will be provided as gift codes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>CommitLog team reserves the right to verify commit authenticity</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-[600px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-extrabold mb-6">Ready to Start?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join CommitLog today and start your journey to consistent coding. The bounty period is active now!
            </p>
            <button 
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="bg-primary text-[#101915] px-10 py-4 rounded-2xl text-lg font-bold soft-shadow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#101915]/30 border-t-[#101915] rounded-full animate-spin"></div>
                  Signing up...
                </>
              ) : (
                "Get Started for Free"
              )}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}