'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Users, Heart, Star, Sparkles, CheckCircle, ArrowRight, Quote } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Border from '@/components/Border';

interface NewsletterFormProps {
  onClose?: () => void;
  variant?: 'main' | 'blog';
  className?: string;
  compact?: boolean;
  inline?: boolean;
  onSignupSuccess?: () => void;
}

const testimonials = [
  {
    name: "Dariq",
    role: "Digital Pioneer",
    content: "This is gold.",
    rating: 5,
    avatar: "D"
  },
  {
    name: "FIFE1.btc",
    role: "Web3 Developer", 
    content: "The graphics explain it all",
    rating: 5,
    avatar: "F"
  },
  {
    name: "Brainard",
    role: "AI Researcher",
    content: "A distilled masterclass in AI agent design.",
    rating: 5,
    avatar: "B"
  },
  {
    name: "Legend",
    role: "Tech Strategist",
    content: "Straight to the point, practical, and actually battle-tested.",
    rating: 5,
    avatar: "L"
  }
];

const stats = [
  { number: "10K+", label: "Subscribers", icon: Users },
  { number: "98%", label: "Open Rate", icon: Mail },
  { number: "4.9/5", label: "Rating", icon: Star },
  { number: "100%", label: "Privacy", icon: Heart }
];

const features = [
  "Weekly industry insights and trends",
  "Exclusive behind-the-scenes content",
  "Early access to new tools and resources",
  "Community-driven discussions",
  "Expert interviews and case studies",
  "No spam, unsubscribe anytime"
];

export default function NewsletterForm({ 
  onClose, 
  variant = 'main', 
  className = '', 
  compact = false, 
  inline = false, 
  onSignupSuccess 
}: NewsletterFormProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    // Testimonial rotation
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Enhanced Sender form component with iframe fallback
  const SenderForm = ({ className = "" }) => {
    const formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID;
    const accountId = process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID;
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [useIframe, setUseIframe] = useState(false);
    
    useEffect(() => {
      if (!formId || !accountId) {
        setLoadError(true);
        return;
      }

      // Try JavaScript API first
      const checkSender = () => {
        if (typeof window !== 'undefined' && (window as any).sender) {
          try {
            // Try to embed the form using Sender's API
            (window as any).sender('embed', formId, {
              target: `.sender-form-${formId}`,
              width: '100%'
            });
            setIsLoaded(true);
          } catch (error) {
            console.warn('Sender JS API failed, falling back to iframe:', error);
            setUseIframe(true);
            setIsLoaded(true);
          }
        } else {
          // Keep checking for a while, then fall back to iframe
          const timeElapsed = Date.now() - checkStartTime;
          if (timeElapsed > 3000) { // 3 second timeout
            console.warn('Sender script timeout, using iframe fallback');
            setUseIframe(true);
            setIsLoaded(true);
          } else {
            setTimeout(checkSender, 100);
          }
        }
      };

      const checkStartTime = Date.now();
      const timeout = setTimeout(checkSender, 500);

      return () => {
        clearTimeout(timeout);
      };
    }, [formId, accountId]);
    
    if (!formId || !accountId) {
      return (
        <div className={`p-4 text-center text-gray-500 ${className}`}>
          <p>Newsletter form unavailable</p>
          <p className="text-xs">Configuration missing</p>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className={`p-4 text-center text-gray-500 ${className}`}>
          <p>Unable to load newsletter form</p>
          <p className="text-xs">Please try refreshing the page</p>
        </div>
      );
    }

    if (useIframe) {
      // Fallback iframe approach
      const iframeSrc = `https://app.sender.net/forms/${formId}/embed`;
      return (
        <div className={className}>
          <iframe
            src={iframeSrc}
            width="100%"
            height="400"
            style={{ border: 'none', borderRadius: '8px' }}
            title="Newsletter Signup"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className={className}>
        <div 
          className={`sender-form-${formId}`}
          style={{ minHeight: isLoaded ? 'auto' : '120px' }}
        >
          {!isLoaded && (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b66880]"></div>
              <span className="ml-2 text-gray-500">Loading form...</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // If no onClose is provided, render inline version
  if (!onClose) {
    return (
      <div className={`inline-newsletter-form ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#b66880] to-[#7ea196] bg-clip-text text-transparent">
              Subscribe Now
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Join our exclusive community and never miss an update
            </p>
          </div>

          <SenderForm className="min-h-[200px]" />

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-[#7ea196]" />
                <span>No spam</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-[#b66880]" />
                <span>Privacy first</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500 mt-2">
              <span>GDPR compliant</span>
              <span>•</span>
              <span>No sharing to third parties ever</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#b66880] to-[#7ea196] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-[#b88e62] to-[#b66880] rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-[#7ea196] to-[#b88e62] rounded-full blur-xl animate-bounce delay-2000"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
          </button>

          <div className="grid lg:grid-cols-2 gap-8 p-8 h-full overflow-y-auto">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center lg:text-left">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    className="inline-flex items-center px-4 py-2 mb-4 bg-gradient-to-r from-[#b66880]/20 to-[#7ea196]/20 rounded-full border border-[#b66880]/30"
                  >
                    <Sparkles className="h-4 w-4 text-[#b66880] mr-2" />
                    <span className="text-sm font-medium text-[#b66880]">Join Our Community</span>
                  </motion.div>
                  
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#b66880] via-[#7ea196] to-[#b88e62] bg-clip-text text-transparent">
                    Stay Ahead of the Curve
                  </h2>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Get exclusive insights, industry trends, and behind-the-scenes content delivered directly to your inbox. 
                    Join thousands of professionals who trust Manic for cutting-edge updates.
                  </p>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50 shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-[#b66880] to-[#7ea196] rounded-lg">
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What You&apos;ll Get:</h3>
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-[#7ea196] flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonials */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What Our Subscribers Say:</h3>
                  <div className="relative h-48 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTestimonial}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Border className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl">
                          <div className="flex items-start space-x-4">
                            <Quote className="h-6 w-6 text-[#b66880] flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                                &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#b66880] to-[#7ea196] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {testimonials[currentTestimonial].avatar}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                      {testimonials[currentTestimonial].name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {testimonials[currentTestimonial].role}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Border>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Testimonial Navigation Dots */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? 'bg-[#b66880] w-6'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-[#b66880]/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative"
                >
                  {/* Ornate Container */}
                  <div className="relative bg-gradient-to-br from-white via-gray-50/90 to-white dark:from-gray-800 dark:via-gray-700/90 dark:to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                    {/* Decorative corners */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#b66880] rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#7ea196] rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#b88e62] rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#b66880] rounded-br-lg"></div>

                    {/* Inner glow effect */}
                    <div className="absolute inset-4 bg-gradient-to-br from-[#b66880]/10 via-transparent to-[#7ea196]/10 rounded-2xl pointer-events-none"></div>

                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#b66880] to-[#7ea196] rounded-2xl mb-4 shadow-lg"
                        >
                          <Mail className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#b66880] to-[#7ea196] bg-clip-text text-transparent">
                          Subscribe Now
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400">
                          Join our exclusive community and never miss an update
                        </p>
                      </div>

                      {/* Sender.net Embed Form */}
                      <div className="relative">
                        <SenderForm className="min-h-[200px]" />
                      </div>

                      {/* Trust Indicators */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-[#7ea196]" />
                            <span>No spam</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-[#b66880]" />
                            <span>Privacy first</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ArrowRight className="h-4 w-4 text-[#b88e62]" />
                            <span>Unsubscribe anytime</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500 mt-2">
                          <span>GDPR compliant</span>
                          <span>•</span>
                          <span>No sharing to third parties ever</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
