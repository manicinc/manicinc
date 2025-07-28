// src/app/terms/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service - User Agreement & Legal Terms | Manic Agency',
    description: 'Read Manic Agency\'s Terms of Service including user agreements, intellectual property rights, prohibited activities, and legal terms governing website usage.',
    keywords: [
        'terms of service',
        'user agreement',
        'legal terms',
        'terms and conditions',
        'intellectual property',
        'website terms',
        'user rights',
        'legal agreement',
        'service terms',
        'user responsibilities'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/terms'
    },
    openGraph: {
        type: 'website',
        url: '/terms',
        title: 'Terms of Service - User Agreement & Legal Terms | Manic Agency',
        description: 'Read Manic Agency\'s Terms of Service including user agreements, intellectual property rights, and legal terms governing website usage.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Terms of Service'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms of Service - User Agreement & Legal Terms | Manic Agency',
        description: 'Read Manic Agency\'s Terms of Service including user agreements, intellectual property rights, and legal terms governing website usage.',
        images: [{
            url: '/og-default.webp',
            alt: 'Manic Agency Terms of Service'
        }]
    },
    robots: {
        index: true,
        follow: true
    }
};

export default function TermsOfServicePage() {
  const effectiveDate = "January 1, 2025";
  const lastUpdated = "January 28, 2025";

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-border">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <pattern id="legal-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10,0 L0,0 L0,10" fill="none" stroke="var(--text-muted)" strokeWidth="0.5"/>
              <circle cx="10" cy="10" r="0.5" fill="var(--accent-highlight)" opacity="0.3"/>
            </pattern>
            <rect width="100" height="100" fill="url(#legal-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-burgundy/10 border border-accent-burgundy/20 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 6H16M8 10H16M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-mono text-accent-burgundy uppercase tracking-wider">
              Legal Agreement
            </span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
            Terms of Service
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Digital protocols and agreements governing your interaction with Manic Agency&apos;s platforms and services.
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

      {/* Table of Contents - FIXED */}
      <nav className="sticky top-[60px] z-40 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
            <span className="text-sm font-mono text-text-secondary whitespace-nowrap">Quick Navigation:</span>
            {[
              { href: '#agreement', label: 'Agreement' },
              { href: '#intellectual-property', label: 'IP Rights' },
              { href: '#user-conduct', label: 'User Conduct' },
              { href: '#privacy', label: 'Privacy' },
              { href: '#disclaimers', label: 'Disclaimers' },
              { href: '#contact', label: 'Contact' }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-text-secondary hover:text-accent-burgundy transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="legal-content space-y-12">
          {/* Section 1: Agreement to Terms */}
          <section id="agreement" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">1</span>
              </div>
              Agreement to Terms
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                By accessing or using any services provided by Manic Agency (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), 
                including our website at <Link href="https://manic.agency" className="text-accent-burgundy hover:text-accent-highlight">manic.agency</Link>, 
                The Looking Glass blog, and any associated platforms, applications, or services 
                (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
              </p>
              <p>
                If you disagree with any part of these terms, you do not have permission to access our Services. 
                Your continued use of our Services will be regarded as acceptance of our terms.
              </p>
              <div className="bg-accent-burgundy/5 border border-accent-burgundy/20 rounded-xl p-4 mt-4">
                <p className="text-sm font-medium text-accent-burgundy">
                  Important: These Terms contain a binding arbitration provision and class action waiver, 
                  which affect your legal rights. Please read carefully.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Intellectual Property Rights */}
          <section id="intellectual-property" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">2</span>
              </div>
              Intellectual Property Rights
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                The Services and their original content, features, and functionality are and will remain 
                the exclusive property of Manic Agency and its licensors. The Services are protected by 
                copyright, trademark, and other laws of both the United States and foreign countries. 
                Our trademarks and trade dress may not be used in connection with any product or service 
                without our prior written consent.
              </p>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Open Source Contributions</h3>
              <p>
                Certain portions of our codebase are available under open source licenses. 
                Content published on The Looking Glass blog is licensed under Creative Commons 
                Attribution 4.0 International (CC BY 4.0) unless otherwise specified. 
                You are free to share and adapt this content with proper attribution.
              </p>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">User-Generated Content</h3>
              <p>
                By submitting content to our Services, including but not limited to comments, feedback, 
                testimonials, or any other materials, you grant us a worldwide, non-exclusive, 
                royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, 
                translate, distribute, and display your content in connection with our Services and 
                marketing activities. You retain all rights to your content.
              </p>
              <p>
                We may use your publicly posted comments, feedback, or testimonials on our social media 
                channels or other platforms for promotional purposes, with appropriate attribution to 
                your username or handle as it appears on the original platform.
              </p>
            </div>
          </section>

          {/* Section 3: User Conduct */}
          <section id="user-conduct" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">3</span>
              </div>
              User Conduct & Prohibited Activities
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                You agree to use our Services only for lawful purposes and in accordance with these Terms. 
                You agree not to use our Services:
              </p>
              <ul className="space-y-2 mt-4">
                {[
                  'To violate any applicable law or regulation',
                  'To transmit any harmful code, malware, or disruptive technologies',
                  'To engage in unauthorized data mining, scraping, or harvesting',
                  'To attempt to gain unauthorized access to any portion of our Services',
                  'To impersonate or attempt to impersonate another user or entity',
                  'To use our Services for any form of automated abuse or spam',
                  'To interfere with or disrupt the integrity or performance of our Services',
                  'To attempt to reverse engineer any aspect of our Services'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-alert flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: Privacy & Data */}
          <section id="privacy" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">4</span>
              </div>
              Privacy & Data Protection
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Your use of our Services is also governed by our Privacy Policy, which is incorporated 
                into these Terms by reference. Please review our{' '}
                <Link href="/privacy" className="text-accent-burgundy hover:text-accent-highlight">
                  Privacy Policy
                </Link>
                {' '}to understand our practices.
              </p>
              <p>
                We are committed to protecting your privacy and maintaining the security of any 
                personal information received from you. We strictly adhere to GDPR requirements 
                and other applicable data protection regulations.
              </p>
            </div>
          </section>

          {/* Section 5: Services & Modifications */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">5</span>
              </div>
              Services & Modifications
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, 
                any part of our Services with or without notice. We shall not be liable to 
                you or any third party for any modification, suspension, or discontinuance 
                of the Services.
              </p>
              <p>
                We may update these Terms from time to time. The updated version will be 
                indicated by an updated &quot;Last Updated&quot; date. Your continued use of the 
                Services after any such changes constitutes your acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Section 6: Disclaimers & Limitations */}
          <section id="disclaimers" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">6</span>
              </div>
              Disclaimers & Limitations of Liability
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
                <p className="font-mono text-sm uppercase tracking-wider text-text-primary">
                  Disclaimer of Warranties
                </p>
                <p className="text-sm">
                  THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT 
                  WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT 
                  PERMISSIBLE PURSUANT TO APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS 
                  OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, 
                  FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>
              
              <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4 mt-4">
                <p className="font-mono text-sm uppercase tracking-wider text-text-primary">
                  Limitation of Liability
                </p>
                <p className="text-sm">
                  IN NO EVENT SHALL MANIC AGENCY, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, 
                  SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF 
                  PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Indemnification */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">7</span>
              </div>
              Indemnification
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                You agree to defend, indemnify, and hold harmless Manic Agency and its affiliates, 
                licensors, and service providers from and against any claims, liabilities, damages, 
                judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) 
                arising out of or relating to your violation of these Terms or your use of the Services.
              </p>
            </div>
          </section>

          {/* Section 8: Governing Law & Dispute Resolution */}
          <section className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">8</span>
              </div>
              Governing Law & Dispute Resolution
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of 
                the State of California, without regard to its conflict of law provisions. 
                Our failure to enforce any right or provision of these Terms will not be 
                considered a waiver of those rights.
              </p>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Arbitration Agreement</h3>
              <p>
                Any dispute arising out of or related to these Terms or the Services shall be 
                resolved through binding arbitration in accordance with the rules of the American 
                Arbitration Association. The arbitration shall be conducted in Los Angeles, California, 
                and judgment on the award may be entered in any court having jurisdiction.
              </p>
              
              <div className="bg-accent-sage/10 border border-accent-sage/20 rounded-xl p-4 mt-4">
                <p className="text-sm font-medium text-accent-sage">
                  Class Action Waiver: You agree that any dispute resolution proceedings will be 
                  conducted only on an individual basis and not in a class, consolidated, or 
                  representative action.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9: Contact Information */}
          <section id="contact" className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-text-primary mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-burgundy/10 border border-accent-burgundy/20 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold text-accent-burgundy">9</span>
              </div>
              Contact Information
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary leading-relaxed">
              <p>
                For questions about these Terms or our Services, please contact us through:
              </p>
              <div className="bg-bg-secondary border border-border rounded-xl p-6 mt-4">
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
                    <a href="mailto:legal@manic.agency" className="text-accent-burgundy hover:text-accent-highlight">
                      legal@manic.agency
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
                      <path d="M12 21C12 21 19 15 19 10C19 5.58172 15.4183 2 11 2C6.58172 2 3 5.58172 3 10C3 15 10 21 10 21" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="11" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>Los Angeles, California</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Agreement Acknowledgment */}
          <section className="mt-16 pt-8 border-t border-border">
            <div className="bg-gradient-to-br from-accent-rose/5 to-accent-blue/5 rounded-2xl p-8 border border-accent-rose/10">
              <h3 className="text-lg font-display font-semibold text-text-primary mb-3">
                Acknowledgment of Agreement
              </h3>
              <p className="text-text-secondary mb-6">
                By using our Services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-burgundy hover:bg-accent-highlight text-white font-medium rounded-xl transition-all duration-300"
                >
                  Contact Legal Team
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-white font-medium rounded-xl transition-all duration-300"
                >
                  View Privacy Policy
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}