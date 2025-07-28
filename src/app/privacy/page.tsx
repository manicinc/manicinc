// src/app/privacy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy - Data Protection & Privacy | Manic Agency',
    description: 'Learn how Manic Agency protects your privacy and handles your data. Read our comprehensive privacy policy covering data collection, cookies, and your rights.',
    keywords: [
        'privacy policy',
        'data protection',
        'privacy rights',
        'cookie policy',
        'data collection',
        'GDPR compliance',
        'user privacy',
        'data security',
        'personal information',
        'privacy practices'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/privacy'
    },
    openGraph: {
        type: 'website',
        url: '/privacy',
        title: 'Privacy Policy - Data Protection & Privacy | Manic Agency',
        description: 'Learn how Manic Agency protects your privacy and handles your data. Read our comprehensive privacy policy.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Privacy Policy'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy - Data Protection & Privacy | Manic Agency',
        description: 'Learn how Manic Agency protects your privacy and handles your data. Read our comprehensive privacy policy.',
        images: [{
            url: '/og-default.webp',
            alt: 'Manic Agency Privacy Policy'
        }]
    },
    robots: {
        index: true,
        follow: true
    }
};

export default function PrivacyPolicyPage() {
  const effectiveDate = "January 1, 2025";
  const lastUpdated = "January 28, 2025";

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-border">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <pattern id="privacy-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10,0 L0,0 L0,10" fill="none" stroke="var(--text-muted)" strokeWidth="0.5"/>
              <circle cx="5" cy="5" r="1" fill="var(--accent-sage)" opacity="0.2"/>
            </pattern>
            <rect width="100" height="100" fill="url(#privacy-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-sage/10 border border-accent-sage/20 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-mono text-accent-sage uppercase tracking-wider">
              Data Protection
            </span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
            Privacy Policy
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your privacy is paramount. Learn how we protect your data and respect your digital sovereignty.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 2V6M16 2V6M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Effective: {effectiveDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M21 6H19C17.8954 6 17 5.10457 17 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation - FIXED */}
      <nav className="sticky top-[60px] z-40 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
            <span className="text-sm font-mono text-text-secondary whitespace-nowrap">Navigate:</span>
            {[
              { href: '#overview', label: 'Overview' },
              { href: '#data-collection', label: 'Data Collection' },
              { href: '#data-usage', label: 'Usage' },
              { href: '#cookies', label: 'Cookies' },
              { href: '#your-rights', label: 'Your Rights' },
              { href: '#security', label: 'Security' },
              { href: '#contact', label: 'Contact' }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-text-secondary hover:text-accent-sage transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="privacy-content space-y-12">
          
          {/* Privacy Commitment Badge */}
          <div className="bg-gradient-to-br from-accent-sage/10 to-accent-secondary/10 rounded-2xl p-8 border border-accent-sage/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-sage/20 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 6V12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
                  Our Privacy Commitment
                </h3>
                <p className="text-text-secondary">
                  We operate on a zero-knowledge principle. Your data sovereignty is absolute. 
                  We collect minimal data, never sell your information, and provide complete 
                  transparency about our practices.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Overview */}
          <section id="overview" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">1</span>
              </div>
              Privacy Overview
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                This Privacy Policy describes how Manic Agency (&aquot;we,&aquot; &aquot;us,&aquot; or &aquot;our&aquot;) collects, 
                uses, and shares information about you when you use our services, including our 
                website at <Link href="https://manic.agency" className="text-accent-sage hover:text-accent-secondary">manic.agency</Link>, 
                The Looking Glass blog, and any related services (collectively, the &aquot;Services&aquot;).
              </p>
              <p>
                We are committed to protecting your privacy and complying with applicable data 
                protection laws, including the General Data Protection Regulation (GDPR) and 
                the California Consumer Privacy Act (CCPA).
              </p>
            </div>
          </section>

          {/* Section 2: Data Collection */}
          <section id="data-collection" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">2</span>
              </div>
              Information We Collect
            </h2>
            <div className="ml-11 space-y-6">
              {/* Information You Provide */}
              <div className="bg-bg-secondary rounded-xl p-6 border border-border">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M16 16C16 14 14 13 12 13C10 13 8 14 8 16V19H16V16Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Information You Provide
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Contact Information:</strong> Name, email address, company name when you contact us or subscribe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Account Data:</strong> Username, password, profile information if you create an account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Communications:</strong> Messages, feedback, and other content you send to us</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Project Information:</strong> Details about your projects when you engage our services</span>
                  </li>
                </ul>
              </div>

              {/* Automatically Collected */}
              <div className="bg-bg-secondary rounded-xl p-6 border border-border">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 9H17M7 12H14M7 15H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Information Automatically Collected
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Usage Data:</strong> Pages visited, time spent, clicks, and navigation paths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Log Data:</strong> IP address, access times, referring URLs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span><strong>Location:</strong> Approximate geographic location based on IP address</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Your Data */}
          <section id="data-usage" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">3</span>
              </div>
              How We Use Your Information
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>We use the information we collect for the following purposes:</p>
              <div className="grid gap-4 mt-6">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: 'Service Delivery',
                    desc: 'To provide, maintain, and improve our Services'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C10.2288 21 8.57623 20.4883 7.17661 19.6081L3 21L4.39183 16.8234C3.51193 15.4238 3 13.7712 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    ),
                    title: 'Communication',
                    desc: 'To respond to inquiries, send updates, and provide customer support'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12L8 7L12 11L21 2M21 2H15M21 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: 'Analytics',
                    desc: 'To understand usage patterns and improve user experience'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                      </svg>
                    ),
                    title: 'Security',
                    desc: 'To detect, prevent, and address technical issues and abuse'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7V12C2 18 7 22 12 22C17 22 22 18 22 12V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    ),
                    title: 'Legal Compliance',
                    desc: 'To comply with legal obligations and protect our rights'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12L7 7V10H13V14H7V17L2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M16 6V18M19 8V16M22 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ),
                    title: 'Marketing',
                    desc: 'To send newsletters and updates (with your consent)'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-bg-primary border border-border">
                    <div className="w-10 h-10 rounded-lg bg-accent-sage/10 flex items-center justify-center flex-shrink-0 text-accent-sage">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">{item.title}</h4>
                      <p className="text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Cookies */}
          <section id="cookies" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">4</span>
              </div>
              Cookies & Tracking Technologies
            </h2>
            <div className="ml-11 space-y-6">
              <p className="text-text-secondary">
                We use cookies and similar tracking technologies to enhance your experience. 
                You can control cookie preferences through our cookie consent banner.
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    type: 'Essential Cookies',
                    desc: 'Required for basic functionality and security. Cannot be disabled.',
                    examples: ['Session management', 'Security tokens', 'Theme preferences']
                  },
                  {
                    type: 'Analytics Cookies',
                    desc: 'Help us understand how visitors interact with our Services.',
                    examples: ['Google Analytics', 'Microsoft Clarity', 'Usage patterns']
                  },
                  {
                    type: 'Functional Cookies',
                    desc: 'Enable enhanced functionality and personalization.',
                    examples: ['Language preferences', 'Display settings', 'Form data']
                  },
                  {
                    type: 'Marketing Cookies',
                    desc: 'Used for newsletter subscriptions and social features.',
                    examples: ['Newsletter preferences', 'Social media integration', 'Comments']
                  }
                ].map((cookie, index) => (
                  <div key={index} className="bg-bg-secondary rounded-xl p-5 border border-border">
                    <h4 className="font-semibold text-text-primary mb-2">{cookie.type}</h4>
                    <p className="text-sm text-text-secondary mb-3">{cookie.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((example, i) => (
                        <span key={i} className="px-3 py-1 bg-bg-primary rounded-full text-xs text-text-secondary">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-accent-sage/10 border border-accent-sage/20 rounded-xl p-4">
                <p className="text-sm text-accent-sage">
                  You can manage your cookie preferences at any time through our cookie consent banner 
                  or by clicking <Link href="#" className="underline">here</Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Data Sharing */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">5</span>
              </div>
              How We Share Your Information
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <div className="bg-gradient-to-r from-accent-sage/10 to-accent-secondary/10 rounded-xl p-6 border border-accent-sage/20 mb-6">
                <p className="font-semibold text-text-primary flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  We do not sell, rent, or trade your personal information.
                </p>
              </div>
              
              <p>We may share your information in the following circumstances:</p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span><strong>Service Providers:</strong> With trusted third parties who assist in operating our Services (e.g., hosting, analytics)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span><strong>With Consent:</strong> When you explicitly consent to sharing</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Your Rights */}
          <section id="your-rights" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">6</span>
              </div>
              Your Privacy Rights
            </h2>
            <div className="ml-11 space-y-6">
              <p className="text-text-secondary">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              
              <div className="grid gap-4">
                {[
                  {
                    right: 'Right to Access',
                    desc: 'Request a copy of the personal information we hold about you'
                  },
                  {
                    right: 'Right to Rectification',
                    desc: 'Request correction of inaccurate or incomplete information'
                  },
                  {
                    right: 'Right to Erasure',
                    desc: 'Request deletion of your personal information'
                  },
                  {
                    right: 'Right to Portability',
                    desc: 'Receive your data in a structured, machine-readable format'
                  },
                  {
                    right: 'Right to Object',
                    desc: 'Object to processing of your personal information'
                  },
                  {
                    right: 'Right to Restrict',
                    desc: 'Request restriction of processing your personal information'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-bg-secondary border border-border">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-burgundy flex-shrink-0">
                      <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">{item.right}</h4>
                      <p className="text-sm text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-accent-burgundy/10 border border-accent-burgundy/20 rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-text-primary mb-2">How to Exercise Your Rights</h4>
                <p className="text-sm text-text-secondary mb-4">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:privacy@manic.agency" className="text-accent-burgundy hover:text-accent-highlight">
                    privacy@manic.agency
                  </a>. 
                  We will respond to your request within 30 days.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-accent-burgundy hover:text-accent-highlight font-medium"
                >
                  Submit Privacy Request
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 7: Data Security */}
          <section id="security" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">7</span>
              </div>
              Data Security
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="bg-bg-secondary rounded-xl p-6 border border-border mt-6">
                <h4 className="font-semibold text-text-primary mb-3">Security Measures Include:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Encryption of data in transit and at rest</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Access controls and authentication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Employee training on data protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Incident response procedures</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8: Data Retention */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">8</span>
              </div>
              Data Retention
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                We retain your personal information only for as long as necessary to fulfill 
                the purposes for which it was collected and to comply with legal obligations.
              </p>
              
              <div className="bg-bg-secondary rounded-xl p-6 border border-border mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-text-primary">Data Type</th>
                      <th className="text-left py-3 text-text-primary">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border">
                      <td className="py-3">Account Information</td>
                      <td className="py-3">Until account deletion + 90 days</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Contact Form Data</td>
                      <td className="py-3">2 years or until resolved</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Newsletter Subscriptions</td>
                      <td className="py-3">Until unsubscribe + 30 days</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Analytics Data</td>
                      <td className="py-3">26 months</td>
                    </tr>
                    <tr>
                      <td className="py-3">Legal Records</td>
                      <td className="py-3">As required by law</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 9: International Transfers */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">9</span>
              </div>
              International Data Transfers
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Your information may be transferred to and processed in countries other than 
                your country of residence. These countries may have data protection laws that 
                are different from the laws of your country.
              </p>
              <p>
                We ensure appropriate safeguards are in place to protect your information in 
                accordance with this Privacy Policy, including standard contractual clauses 
                approved by the European Commission.
              </p>
            </div>
          </section>

          {/* Section 10: Children's Privacy */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">10</span>
              </div>
              Children&apos;s Privacy
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Our Services are not directed to children under the age of 16. We do not 
                knowingly collect personal information from children under 16. If we become 
                aware that we have collected personal information from a child under 16, 
                we will take steps to delete such information.
              </p>
            </div>
          </section>

          {/* Section 11: Updates */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">11</span>
              </div>
              Updates to This Policy
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                any changes by posting the new Privacy Policy on this page and updating the 
                &aquot;Last Updated&aquot; date.
              </p>
              <p>
                For material changes, we will provide additional notice, such as adding a 
                statement to our homepage or sending you an email notification.
              </p>
            </div>
          </section>

          {/* Section 12: Contact Information */}
          <section id="contact" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-sage">12</span>
              </div>
              Contact Us
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                If you have questions about this Privacy Policy or our privacy practices, 
                please contact us:
              </p>
              
              <div className="bg-bg-secondary border border-border rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-text-primary mb-4">Privacy Team</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 9H15M9 12H15M9 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="font-semibold text-text-primary">Manic Agency LLC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <a href="mailto:privacy@manic.agency" className="text-accent-sage hover:text-accent-secondary">
                      privacy@manic.agency
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                      <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 17C8 15 10 14 12 14C14 14 16 15 16 17" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>Data Protection Officer Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                      <path d="M12 21C12 21 19 15 19 10C19 5.58172 15.4183 2 11 2C6.58172 2 3 5.58172 3 10C3 15 10 21 10 21" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="11" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>Los Angeles, California, USA</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h5 className="font-semibold text-text-primary mb-3">EU Representative</h5>
                  <p className="text-sm">
                    For EU residents, our representative can be contacted at{' '}
                    <a href="mailto:eu-privacy@manic.agency" className="text-accent-sage hover:text-accent-secondary">
                      eu-privacy@manic.agency
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Commitment */}
          <section className="mt-16 pt-8 border-t border-border">
            <div className="bg-gradient-to-br from-accent-sage/5 to-accent-secondary/5 rounded-2xl p-8 border border-accent-sage/10">
              <h3 className="text-lg font-display font-semibold text-text-primary mb-3">
                Our Commitment to Your Privacy
              </h3>
              <p className="text-text-secondary mb-6">
                We believe in transparent, ethical data practices. Your trust is essential to us, 
                and we&apos;re committed to protecting your privacy every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-sage hover:bg-accent-secondary text-white font-medium rounded-xl transition-all duration-300"
                >
                  Contact Privacy Team
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new Event('show-cookie-consent'))}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent-sage text-accent-sage hover:bg-accent-sage hover:text-white font-medium rounded-xl transition-all duration-300"
                >
                  Manage Cookies
                </button>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}