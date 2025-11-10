// src/app/faq/page.tsx
import type { Metadata } from 'next';
import FAQSchema from '@/components/SEO/FAQSchema';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Manic Agency',
  description: 'Common questions about Manic Agency services, Frame.dev ecosystem, AI development, and our open-source projects including Voice Chat Assistant and AgentOS.',
  keywords: ['FAQ', 'questions', 'Frame.dev', 'AI development', 'Voice Chat Assistant', 'AgentOS', 'OpenStrand', 'Manic Agency'],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ - Manic Agency',
    description: 'Get answers to common questions about our AI development services and open-source ecosystem.',
    type: 'website',
  }
};

const faqData = [
  {
    question: "What is Manic Agency and what services do you offer?",
    answer: "Manic Agency is a digital innovation studio specializing in emergent AI technologies. We build Frame.dev and the Framers AI ecosystem, including Voice Chat Assistant, AgentOS, and OpenStrand. Our services include AI development, web applications, and creative technology solutions."
  },
  {
    question: "What is Frame.dev and how does it relate to your other projects?",
    answer: "Frame.dev is our flagship open-source AI development platform. It's the foundation of our Framers AI ecosystem, which includes Voice Chat Assistant (VCA) for natural language coding, AgentOS for AI orchestration, and OpenStrand for collaborative knowledge management. We're also developing HomeOS, WebOS, SafeOS, MyOS, and WorkOS."
  },
  {
    question: "How can Voice Chat Assistant help with development?",
    answer: "Voice Chat Assistant (VCA.chat) enables natural language coding through voice commands. It integrates with AgentOS to provide intelligent assistance for software development, making coding more accessible and efficient through conversational interfaces."
  },
  {
    question: "What is AgentOS and how does it work?",
    answer: "AgentOS (agentos.sh) is a modular runtime for AI applications that provides orchestration capabilities for intelligent systems. It enables developers to build, deploy, and manage AI agents with seamless integration across different platforms and services."
  },
  {
    question: "How does OpenStrand support collaborative knowledge management?",
    answer: "OpenStrand (openstrand.ai) is inspired by Zettelkasten methodology and provides tools for organizing, connecting, and discovering knowledge collaboratively. It helps teams build interconnected knowledge bases that grow more valuable over time."
  },
  {
    question: "Are your projects open source?",
    answer: "Yes! We're committed to open-source development. Frame.dev, Voice Chat Assistant, AgentOS, and OpenStrand are all open-source projects. You can find our repositories on GitHub at github.com/manicinc and contribute to the ecosystem."
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
    answer: "We focus on making AI agency emergent, adaptive, and permanent. Rather than building isolated tools, we create interconnected systems that learn and evolve. Our 'denoising the web' philosophy emphasizes clarity and intelligent automation over complexity."
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
            Common questions about Manic Agency, Frame.dev ecosystem, and our AI development services.
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
