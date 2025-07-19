// src/app/sitemap/page.tsx
import type { Metadata } from 'next';
import "./sitemap.css"

export const metadata: Metadata = {
    title: 'Site Architecture - Manic Agency',
    description: 'Complete sitemap for Manic Agency - Experimental Creative Development & Design Studio. Navigate our digital ecosystem of AI experiments, creative tools, and mystical innovations.',
    keywords: [
        'sitemap',
        'site navigation',
        'manic agency pages',
        'experimental development',
        'creative tools',
        'AI projects'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/sitemap'
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/sitemap',
        siteName: 'Manic Agency',
        title: 'Site Architecture - Manic Agency',
        description: 'Complete navigation map for Manic Agency\'s experimental digital ecosystem.',
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function SitemapPage() {
    return (
        <div className="sitemap-container">
            
            
            <header className="sitemap-header">
                <h1>Site Architecture</h1>
                <p className="subtitle">
                    A comprehensive guide through our experimental digital realm—
                    where creative development meets mystical innovation.
                </p>
            </header>
            
            <div className="sitemap-grid">
                {/* Core Experience */}
                <div className="sitemap-section priority-critical">
                    <div className="section-header">
                        <span className="section-icon">🏛️</span>
                        <h2>Foundation</h2>
                    </div>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/mission">Our Mission</a></li>
                        <li><a href="/team">The Collective</a></li>
                        <li><a href="/process">Our Process</a></li>
                        <li><a href="/contact">Establish Connection</a></li>
                    </ul>
                </div>
                
                {/* Project Ecosystem */}
                <div className="sitemap-section priority-critical">
                    <div className="section-header">
                        <span className="section-icon">⚗️</span>
                        <h2>Experimental Works</h2>
                    </div>
                    <span className="experimental-badge">Active</span>
                    <ul>
                        <li><a href="/projects">All Experiments</a></li>
                        <li><a href="/projects/ai">AI Consciousness</a></li>
                        <li><a href="/projects/social">Social Realms</a></li>
                        <li><a href="/projects/tools">Digital Instruments</a></li>
                    </ul>
                </div>
                
                {/* Featured Creations */}
                <div className="sitemap-section priority-high">
                    <div className="section-header">
                        <span className="section-icon">✨</span>
                        <h2>Manifestations</h2>
                    </div>
                    <ul>
                        <li><a href="/velvet">Velvet Platform</a></li>
                        <li><a href="/projects/social/velvet">Velvet Social</a></li>
                        <li><a href="/projects/tools/logomaker">LogoMaker: Vibe Coding</a></li>
                        <li><a href="/projects/tools/portapack">PortaPack Bundler</a></li>
                    </ul>
                </div>
                
                {/* Knowledge Base */}
                <div className="sitemap-section priority-high">
                    <div className="section-header">
                        <span className="section-icon">📜</span>
                        <h2>Grimoire</h2>
                    </div>
                    <ul>
                        <li><a href="/blog">Latest Insights</a></li>
                        <li><a href="/blog/thinkpieces">Philosophical Musings</a></li>
                        <li><a href="/blog/tutorials">Sacred Tutorials</a></li>
                    </ul>
                </div>
                
                {/* Research Papers */}
                <div className="sitemap-section priority-high">
                    <div className="section-header">
                        <span className="section-icon">🔮</span>
                        <h2>Arcane Studies</h2>
                    </div>
                    <ul>
                        <li><a href="/blog/thinkpieces/ai-sociopaths">AI Consciousness & Sociopathy</a></li>
                        <li><a href="/blog/thinkpieces/logomaker-an-experiment-in-human-computer-interaction-vibe-coding">The Art of Vibe Coding</a></li>
                        <li><a href="/blog/thinkpieces/the-meat-interface">The Meat Interface Theory</a></li>
                        <li><a href="/blog/tutorials/contribute">Contribution Rituals</a></li>
                    </ul>
                </div>
                
                {/* Open Source */}
                <div className="sitemap-section priority-medium">
                    <div className="section-header">
                        <span className="section-icon">🌐</span>
                        <h2>Open Mysteries</h2>
                    </div>
                    <ul>
                        <li><a href="/open-source">OSS Contributions</a></li>
                        <li><a href="/tags">Taxonomies</a></li>
                    </ul>
                </div>
                
                {/* Research Topics */}
                <div className="sitemap-section priority-medium">
                    <div className="section-header">
                        <span className="section-icon">🏷️</span>
                        <h2>Esoteric Tags</h2>
                    </div>
                    <ul>
                        <li><a href="/tags/ai">Artificial Intelligence</a></li>
                        <li><a href="/tags/consciousness">Digital Consciousness</a></li>
                        <li><a href="/tags/ethics">Techno-Ethics</a></li>
                        <li><a href="/tags/featured">Featured Wisdom</a></li>
                        <li><a href="/tags/guide">Implementation Guides</a></li>
                        <li><a href="/tags/llms">Language Models</a></li>
                        <li><a href="/tags/open%20source">Open Source Philosophy</a></li>
                        <li><a href="/tags/vibe%20coding">Vibe Coding Arts</a></li>
                        <li><a href="/tags/writing">Technical Scrolls</a></li>
                    </ul>
                </div>
                
                {/* System Pages */}
                <div className="sitemap-section priority-low">
                    <div className="section-header">
                        <span className="section-icon">⚖️</span>
                        <h2>Legal Codex</h2>
                    </div>
                    <ul>
                        <li><a href="/privacy">Privacy Covenant</a></li>
                        <li><a href="/terms">Terms of Engagement</a></li>
                    </ul>
                </div>
            </div>
            
            <footer className="sitemap-footer">
                <div className="footer-brand">Manic Agency</div>
                <div className="footer-tagline">Where Digital Ether Becomes Reality</div>
                <div className="last-updated">Architectural Map • Last Transcribed: July 20, 2025</div>
            </footer>
        </div>
    );
}