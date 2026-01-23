"use client";

import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('https://commitlog.up.railway.app/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        // Handle error - you might want to show an error message to the user
        console.error('Waitlist signup failed:', data.message);
        alert(data.message || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light-dash text-text-charcoal min-h-screen flex items-center justify-center font-space-grotesk p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-dashboard-primary rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[32px] font-bold">
                terminal
              </span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold tracking-tight text-text-charcoal">
                CommitLog
              </h1>
              <p className="text-sm text-dashboard-primary font-bold tracking-widest uppercase">
                Build in Public
              </p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-text-charcoal mb-4 leading-tight">
            Join the Future of <br />
            <span className="text-dashboard-primary">Developer Storytelling</span>
          </h2>
          
          <p className="text-lg text-text-muted leading-relaxed max-w-xl mx-auto">
            Be among the first to experience CommitLog - the platform that transforms your code commits into engaging social content and helps you build in public effortlessly.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="bg-white border border-border-light rounded-3xl p-8 card-shadow">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-text-charcoal mb-2">
                  Get Early Access
                </h3>
                <p className="text-text-muted">
                  Join our waitlist and be the first to know when we launch
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-text-charcoal mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-4 border border-border-light rounded-xl text-text-charcoal placeholder:text-text-muted focus:ring-2 focus:ring-dashboard-primary focus:border-dashboard-primary transition-all bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className="w-full bg-dashboard-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 card-shadow"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Joining Waitlist...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">
                        rocket_launch
                      </span>
                      Join CommitLog Waitlist
                    </>
                  )}
                </button>
              </form>

              {/* Features Preview */}
              <div className="mt-12 pt-8 border-t border-border-light">
                <h4 className="text-lg font-bold text-text-charcoal mb-6 text-center">
                  What to Expect
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-dashboard-primary text-[24px]">
                        auto_awesome
                      </span>
                    </div>
                    <h5 className="font-bold text-text-charcoal mb-2">AI-Powered Posts</h5>
                    <p className="text-sm text-text-muted">
                      Automatically generate engaging social media content from your commits
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-dashboard-primary text-[24px]">
                        schedule
                      </span>
                    </div>
                    <h5 className="font-bold text-text-charcoal mb-2">Smart Scheduling</h5>
                    <p className="text-sm text-text-muted">
                      Schedule posts across multiple platforms with optimal timing
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-dashboard-primary text-[24px]">
                        insights
                      </span>
                    </div>
                    <h5 className="font-bold text-text-charcoal mb-2">Progress Tracking</h5>
                    <p className="text-sm text-text-muted">
                      Track your building journey with detailed analytics and insights
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-600 text-[40px]">
                  check_circle
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-charcoal mb-4">
                You're on the list! 🎉
              </h3>
              <p className="text-text-muted mb-6 leading-relaxed">
                Thanks for joining our waitlist! We'll notify you as soon as CommitLog is ready for early access. 
                Keep building amazing things in the meantime.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://twitter.com/commitlog"
                  className="flex items-center gap-2 text-dashboard-primary hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Follow us on X
                </a>
                <span className="text-border-light">•</span>
                <a
                  href="/"
                  className="flex items-center gap-2 text-dashboard-primary hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  Back to Home
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            Already have an account?{" "}
            <a href="/dashboard" className="text-dashboard-primary font-bold hover:opacity-80 transition-opacity">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}