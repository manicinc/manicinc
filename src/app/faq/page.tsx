// src/app/faq/page.tsx
import type { Metadata } from 'next';
import FAQSchema from '@/components/SEO/FAQSchema';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Manic Agency',
  description: 'Common questions about Manic Agency: software development, AI engineering, design, and our open-source projects.',
  keywords: ['FAQ', 'questions', 'Manic Agency', 'software development', 'AI development', 'web development', 'design', 'open source'],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ - Manic Agency',
    description: 'Answers to common questions about our software, AI, and design services.',
    type: 'website',
  }
};

const faqData = [
  {
    question: "What is Manic Agency and what services do you offer?",
    answer: "Manic Agency is a software and design studio. We build custom web, AI, and interactive applications for clients, and we develop our own portfolio of software products and developer tools. Our work spans full-stack development, AI integration, web3, AR/VR, and brand and product design."
  },
  {
    question: "Are your projects open source?",
    answer: "Yes. We maintain an active open-source portfolio of libraries, tools, and experiments at github.com/manicinc, and we contribute to the wider ecosystem."
  },
  {
    question: "How can I get started with your AI development services?",
    answer: "Contact us through our website at manic.agency/contact. We offer consultation on AI integration, custom development services, and can help you leverage our open-source ecosystem for your specific needs."
  },
  {
    question: "Do you offer training or documentation for your tools?",
    answer: "Yes, we provide comprehensive documentation and tutorials through our blog and project repositories. Our Chronicles from the Looking-Glass blog features in-depth guides, case studies, and technical insights about our tools and methodologies."
  },
  {
    question: "What makes your approach to AI development different?",
    answer: "We pair senior full-stack engineering with strong design. Every developer is full-stack with at least one specialization, so we take projects from concept through deployment without handoffs. Because we also ship our own products, we build with the same standards we recommend to clients."
  },
  {
    question: "Can I hire Manic Agency for custom development projects?",
    answer: "Absolutely! We work with clients on custom AI implementations, web applications, and creative technology projects. Our expertise spans the entire development lifecycle from concept to deployment and maintenance."
  },
  {
    question: "How do I stay updated on your latest developments?",
    answer: "Follow our blog at manic.agency/blog for the latest insights and updates. You can also join our Discord community, follow us on social media, or subscribe to our newsletter for regular updates about new features and releases."
  },
  {
    question: "What technologies do you primarily work with?",
    answer: "We work extensively with Next.js, React, TypeScript, Python, and modern AI/ML frameworks. Our stack is designed for performance, scalability, and seamless integration with AI services and APIs."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <FAQSchema faqs={faqData} />
      
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Common questions about Manic Agency and our software, AI, and design services.
          </p>
        </header>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <details 
              key={index}
              className="group bg-[var(--bg-secondary)] border border-[var(--accent-primary)] border-opacity-20 rounded-lg overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] pr-4">
                  {faq.question}
                </h3>
                <ChevronDown className="w-5 h-5 text-[var(--accent-primary)] group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6">
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center p-8 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-lg border border-[var(--accent-primary)] border-opacity-20">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Still have questions?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            We're here to help! Reach out to us directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
            <a
              href="https://discord.gg/DzNgXdYm"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold rounded-lg hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
