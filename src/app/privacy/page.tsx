// src/app/privacy/page.tsx
import type { Metadata } from 'next';

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
                url: '/og-default.png',
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
            url: '/og-default.png',
            alt: 'Manic Agency Privacy Policy'
        }]
    },
    robots: {
        index: true,
        follow: true
    }
};

// Basic page structure - use your standard layout components
export default function PrivacyPolicyPage() {
  const effectiveDate = "April 20, 2025"; // <-- Update if needed

  return (
    <div className="container mx-auto px-4 py-12"> {/* Example container */}
      <article className="prose dark:prose-invert lg:prose-xl mx-auto"> {/* Style with prose classes */}
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> {effectiveDate}</p>

        <h2>1. Introduction</h2>
        <p>Welcome to Manic Agency ("we," "us," or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL] (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>

        <h2>2. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
        <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you fill out a contact form or interact with other features of the Site.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</li>
            <li><strong>Cookies and Tracking Data:</strong> We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. [Explain briefly what cookies are used for - e.g., analytics, functionality]. You can typically remove or reject cookies via your browser settings.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
        <ul>
            <li>Respond to your inquiries and provide customer support.</li>
            <li>Send you newsletters, marketing, or promotional materials [if applicable, mention opt-out].</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            <li>Comply with legal and regulatory requirements.</li>
            <li>[Add any other specific uses relevant to Manic Agency]</li>
        </ul>

        <h2>4. How We Share Your Information</h2>
        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
        <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance. [List types of providers if possible, e.g., hosting, analytics].</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li>[Specify other sharing, e.g., with affiliates, partners, if applicable]</li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>5. Data Security</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

        <h2>6. Data Retention</h2>
        <p>We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. [Be more specific if possible, linking retention to purpose].</p>

        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information. These may include the right to:</p>
        <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of the personal data that we hold about you.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request the transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
        </ul>
        <p>To exercise these rights, please contact us using the contact information provided below. [Note: Specific rights depend heavily on location, e.g., GDPR, CCPA. Consult a lawyer].</p>

        <h2>8. Cookies and Tracking Technologies</h2>
        <p>[Expand on cookie usage. Mention types like essential, performance, functional, marketing. Explain how users can manage cookies via browser settings. Link to a separate Cookie Policy if you have one].</p>
        <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience.</p>

        <h2>9. Children's Privacy</h2>
        <p>Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under age 13 without verification of parental consent, we will take steps to remove that information from our servers.</p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Effective Date" and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.</p>

        <h2>11. Contact Us</h2>
        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
        <p>
          Manic Agency<br />
          {/* [Your Physical Address, if applicable]<br /> */}
          team@manic.agency<br />
          {/* [Your Contact Phone Number, optional] */}
        </p>
      </article>
    </div>
  );
}