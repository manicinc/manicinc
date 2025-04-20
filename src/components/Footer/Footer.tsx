// src/components/Footer.tsx
"use client"; // Make Footer a client component because it renders FooterBranding
import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaDiscord } from "react-icons/fa";
import Link from "next/link";
import ThemeToggle from "../Theme/ThemeToggle";
import FooterBranding from "./FooterBranding"; // Import the new branding component

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t
                       py-14 px-6 md:px-16 lg:py-20 /* Responsive Padding */
                       bg-[color:var(--bg-secondary)] /* Darker footer bg */
                       border-[color:var(--bg-tertiary)] /* Themed border */
                       text-[color:var(--text-secondary)] /* Default text */
                       ">
      {/* Optional: Subtle background texture/pattern */}
      <div className="absolute inset-0 bg-[url('/assets/images/footer-texture.png')] opacity-[0.02] bg-repeat -z-10"></div> {/* Replace with your texture */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top section Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-14">

          {/* Column 1: Locations */}
          <div>
            <h3 className="footer-heading">Locations</h3>
            <ul className="footer-list">
              <li>U.S.A</li>
              <li>Los Angeles, California</li>
              <li>Lagos, Nigeria</li>
              <li className="mt-3">
                  <a href="mailto:team@manic.agency" className="footer-link email-link"> {/* Added class */}
                      team@manic.agency
                  </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Creations */}
          <div>
            <h3 className="footer-heading">Creations</h3>
            <ul className="footer-list">
              <li><Link href="https://manicinc.github.io/portapack" className="footer-link">PortaPack</Link></li>
              <li><Link href="https://manic.agency/velvet" className="footer-link">Velvet Web</Link></li>
              <li><Link href="https://manicinc.github.io/logomaker" className="footer-link">Logomaker</Link></li>
              <li className="mt-3"><Link href="/projects" className="footer-link font-semibold text-[color:var(--accent-secondary)] hover:text-[color:var(--accent-highlight)]">All Projects &rarr;</Link></li>
            </ul>
          </div>

          {/* Column 3: Agency Links */}
          <div>
            <h3 className="footer-heading">Agency</h3>
            <ul className="footer-list">
               <li><Link href="/mission" className="footer-link">Mission</Link></li>
               <li><Link href="/projects" className="footer-link">Work</Link></li>
               <li><Link href="/process" className="footer-link">Process</Link></li>
               <li><Link href="/blog" className="footer-link">Blog</Link></li>
               <li><Link href="/contact" className="footer-link">Contact</Link></li>
               <li><Link href="/team" className="footer-link">Team</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect & Theme */}
          <div>
            <h3 className="footer-heading">Connect</h3>
            {/* Social Icons - Added no-underline */}
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-xl text-[color:var(--text-secondary)] mb-8">
                <a href="https://discord.gg/DzNgXdYm" aria-label="Discord" className="footer-icon-link no-underline" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
                <a href="https://github.com/manicinc" aria-label="GitHub" className="footer-icon-link no-underline" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                <a href="https://www.linkedin.com/company/manic-agency-llc/" aria-label="LinkedIn" className="footer-icon-link no-underline" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                <a href="https://x.com/manicagency" aria-label="Twitter" className="footer-icon-link no-underline" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="https://instagram.com/manic.agency" aria-label="Instagram" className="footer-icon-link no-underline" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>

             {/* Theme Toggle */}
             <div className="mt-4">
                 <h3 className="footer-heading mb-2">Display Mode</h3>
                 <ThemeToggle size="sm" />
             </div>
          </div>
        </div> {/* End Grid */}

        {/* Footer Bottom - Replaced static text with FooterBranding */}
        <div className="border-t border-[color:var(--bg-tertiary)] mt-10 pt-8 text-center">
           <FooterBranding /> {/* <<< Use the conditional branding component */}
          <p className="mt-4 text-xs font-meta-blog text-[color:var(--text-muted)] opacity-70">
            © {currentYear} Manic Agency LLC | All Rights Reserved
          </p>
        </div>
      </div> {/* End Max Width Container */}

      {/* Global Styles for Footer Elements (Move to CSS file ideally) */}
      <style jsx global>{`
        .footer-heading {
          font-family: var(--font-meta-blog); /* Lato */
          font-size: 0.8rem; /* 12.8px */
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--accent-highlight); /* Gold */
          margin-bottom: 1rem;
        }
        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          space-y: 0.6rem; /* Spacing between list items */
          font-family: var(--font-body); /* Main site Inter */
          font-size: 0.875rem; /* 14px */
          opacity: 0.9;
        }
        .footer-link, .email-link { /* Style for text links */
          color: var(--text-secondary);
          text-decoration: none !important; /* Force no underline */
          transition: color var(--transition-fast);
          border-bottom: 1px solid transparent; /* Prepare for hover */
        }
        .footer-link:hover, .email-link:hover {
          color: var(--accent-highlight); /* Gold */
          border-bottom-color: var(--accent-highlight); /* Underline on hover */
        }
        .footer-icon-link { /* Style for icon links */
          color: var(--text-secondary);
          transition: color var(--transition-fast), transform var(--transition-fast);
          text-decoration: none !important; /* Force no underline */
          display: inline-block; /* Prevents underline issues */
        }
        .footer-icon-link:hover {
          color: var(--accent-primary); /* Burgundy */
          transform: scale(1.15) rotate(-5deg);
        }
        /* Styles for the logo wrappers if needed */
        .footer-logo { /* Common styles */
            display: inline-block;
            cursor: pointer;
        }
        .looking-glass-logo-wrapper { /* Specific styles/animations */ }
        .standard-logo-wrapper { /* Specific styles/animations */ }

        /* Add subtle pulse animation if not already global */
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        .animate-subtle-pulse {
          animation: subtlePulse 3s infinite ease-in-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;