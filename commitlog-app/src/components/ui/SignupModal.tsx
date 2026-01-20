'use client';

import React, { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGitHubSignup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://commitlog.up.railway.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'github'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // If the backend returns a redirect URL, redirect the user
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
      } else {
        console.error('Signup failed:', response.statusText);
        // You could show an error message here
      }
    } catch (error) {
      console.error('Error during signup:', error);
      // You could show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  const handleFigmaSignup = () => {
    // Add Figma OAuth logic here when ready
    console.log('Figma signup clicked');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-background-dark rounded-3xl p-8 max-w-md w-full mx-4 soft-shadow border border-[#d3e4dd] dark:border-white/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#578e77] hover:text-primary transition-colors"
          disabled={isLoading}
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">rocket_launch</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-2">Get Started with CommitLog</h2>
          <p className="text-[#578e77] dark:text-gray-400">Connect your tools and start building in public</p>
        </div>

        {/* Signup Options */}
        <div className="space-y-4">
          <button
            onClick={handleGitHubSignup}
            disabled={isLoading}
            className="w-full bg-[#24292e] hover:bg-[#1a1e22] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all soft-shadow"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>

          <button
            onClick={handleFigmaSignup}
            disabled={isLoading}
            className="w-full bg-white dark:bg-white/5 border-2 border-[#d3e4dd] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-[#101915] dark:text-white px-6 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm7.704 0c-2.476 0-4.49 2.015-4.49 4.49s2.014 4.49 4.49 4.49 4.49-2.015 4.49-4.49-2.014-4.49-4.49-4.49zm0 7.509c-1.665 0-3.019-1.355-3.019-3.019s1.355-3.019 3.019-3.019 3.019 1.354 3.019 3.019-1.355 3.019-3.019 3.019z"/>
            </svg>
            Continue with Figma
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#e9f1ee] dark:border-white/10">
          <p className="text-xs text-[#578e77] text-center leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;