'use client';

import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Gamify from "@/components/sections/Gamify";
import Testimonials from "@/components/sections/Testimonials";
import SignupModal from "@/components/ui/SignupModal";

export default function LandingPage() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <HowItWorks />
        <Gamify />
        <Testimonials />
        
        {/* Final CTA Section */}
        <section className="py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <span className="material-symbols-outlined text-[200px]">terminal</span>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#101915] mb-6">
                  Ready to start building in public?
                </h2>
                <p className="text-lg text-[#101915]/70 max-w-[600px] mx-auto mb-10 font-medium">
                  Join the movement. Automate your growth and focus on what you do best: building amazing products.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setIsSignupModalOpen(true)}
                    className="w-full sm:w-auto bg-[#101915] text-white px-10 py-5 rounded-2xl text-xl font-bold soft-shadow hover:scale-105 transition-all"
                  >
                    Get Started for Free
                  </button>
                  <p className="text-[#101915]/50 text-sm font-bold">No credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </>
  );
}