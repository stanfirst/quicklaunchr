"use client";

import { useEffect, useState } from "react";

// Typing animation component
function TypingText({ text, delay = 0, speed = 100 }: { text: string; delay?: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setShowCursor(false);
    setIsTyping(false);
    
    const timeout = setTimeout(() => {
      setIsTyping(true);
      setShowCursor(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setShowCursor(false);
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <>
      {displayedText}
      {showCursor && isTyping && <span className="animate-blink ml-1">|</span>}
    </>
  );
}

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Startups create comprehensive profiles showcasing their vision, team, and traction. Fill out your application with all necessary details about your startup.",
    icon: "Profile",
  },
  {
    number: "02",
    title: "Wait for Approval",
    description:
      "Our team reviews and audits your application to ensure quality and authenticity. We verify your startup details before approval.",
    icon: "Approval",
  },
  {
    number: "03",
    title: "Discover Matching Investors",
    description:
      "Our platform matches you with investors based on industry, stage, investment criteria, and your startup's requirements.",
    icon: "Match",
  },
  {
    number: "04",
    title: "Pitch & Close Deal",
    description:
      "Present your startup to matched investors, conduct due diligence, and negotiate terms to close successful investment deals.",
    icon: "Deal",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Step 0 (form filling) takes ~11 seconds, others take 4 seconds
    const stepDurations = [12000, 4000, 4000, 4000];
    
    let timeoutId: NodeJS.Timeout;
    const scheduleNextStep = (step: number) => {
      const duration = stepDurations[step] || 4000;
      timeoutId = setTimeout(() => {
        const nextStep = (step + 1) % steps.length;
        setActiveStep(nextStep);
        scheduleNextStep(nextStep);
      }, duration);
    };
    
    scheduleNextStep(0);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section id="how-it-works" className="py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A streamlined process designed to connect startups and investors
            efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 cursor-pointer ${
                  activeStep === index
                    ? "opacity-100 scale-105"
                    : "opacity-60 scale-100"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`flex gap-6 p-6 rounded-lg border-2 transition-all duration-300 ${
                    activeStep === index
                      ? "border-orange-600 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                        activeStep === index
                          ? "bg-orange-600 dark:bg-orange-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 transition-colors ${
                        activeStep === index ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`transition-colors ${
                        activeStep === index ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Animated visualization */}
          <div className="relative h-[600px] bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full max-w-md">
              {/* Step 1: Form Filling Animation */}
              {activeStep === 0 && (
                <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border-2 border-orange-600 dark:border-orange-500">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">Startup Application</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Company Name</label>
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center px-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            <TypingText text="TechInnovate Solutions" delay={0} speed={100} />
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Industry</label>
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center px-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            <TypingText text="SaaS Technology" delay={2500} speed={100} />
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Funding Stage</label>
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center px-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            <TypingText text="Seed Round" delay={5000} speed={100} />
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-3">
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            <TypingText text="We are building innovative SaaS solutions for modern businesses..." delay={7000} speed={60} />
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-orange-600 dark:bg-orange-500 text-white py-2 rounded text-sm font-medium mt-4 submit-button">
                        Submit Application
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Approval Process Animation */}
              {activeStep === 1 && (
                <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm border-2 border-orange-600 dark:border-orange-500">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 mx-auto mb-4 relative">
                        <div className="absolute inset-0 border-4 border-orange-200 dark:border-orange-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-orange-600 dark:border-orange-500 rounded-full border-t-transparent animate-spin-slow"></div>
                        <div className="absolute inset-4 flex items-center justify-center">
                          <div className="w-8 h-8 bg-orange-600 dark:bg-orange-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-2">Reviewing Application</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Our team is auditing your startup details</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-600 dark:bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Verifying company details</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-600 dark:bg-orange-500 rounded-full animate-pulse delay-200"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Checking financial records</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-600 dark:bg-orange-500 rounded-full animate-pulse delay-400"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Validating team credentials</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">Approved!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Investor Matching Animation */}
              {activeStep === 2 && (
                <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border-2 border-orange-600 dark:border-orange-500">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">Finding Matches</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="w-12 h-12 bg-orange-600 dark:bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          I1
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-black dark:text-white">Tech Ventures Fund</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">SaaS • Seed Stage • 95% Match</div>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 opacity-60">
                        <div className="w-12 h-12 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                          I2
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">Capital Partners</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">FinTech • Series A • 78% Match</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 animate-slide-in">
                        <div className="w-12 h-12 bg-orange-600 dark:bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          I3
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-black dark:text-white">Innovation Capital</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">SaaS • Seed Stage • 92% Match</div>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span>12 Matches Found</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Pitch & Close Deal Animation */}
              {activeStep === 3 && (
                <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border-2 border-orange-600 dark:border-orange-500">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">Pitch & Negotiate</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-600 dark:bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              P
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-black dark:text-white">Pitch Meeting</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Scheduled</div>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Due Diligence Complete</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Terms Negotiated</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-500 dark:border-green-400">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-black dark:text-white">Deal Closed!</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Investment Secured</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="font-bold text-black dark:text-white">$500K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes show-button {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .submit-button {
          opacity: 0;
          animation: show-button 0.5s 10.5s forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out 0.3s both;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </section>
  );
}

