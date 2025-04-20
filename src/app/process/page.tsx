// app/process/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Rocket, BrainCircuit, Code2, Layers3, Search, Lightbulb, CheckCircle, Ship, Cpu, Bot, Terminal, Target, Palette, Speaker, DatabaseZap, Server, Cog, Timer, BookOpen, Archive,
    BarChartHorizontalBig, LockKeyhole, ArrowRight, GitBranch, Database, Cloud, ShieldCheck, Recycle, FileText, Gift, Users as UsersIcon // Renamed Users import
} from 'lucide-react';

// Import CSS Module
import styles from './ProcessPage.module.css';

// Import the ASCII Placeholder Component
// CRITICAL: Ensure this path is correct and the component file starts with "use client";
import AsciiArtPlaceholder from '@/lib/asciiPlaceholders';

// Import your standard Button component - Assume it's theme-aware
import { Button } from '@/components/ui/button'; // Example import path

// --- Stylized Stopwatch SVG (Using CSS Variables) ---
const StylizedStopwatch: React.FC<{ className?: string }> = ({ className }) => (
    <motion.svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "backOut" }}
    >
        {/* Outer Ring */}
        <circle cx="32" cy="32" r="28" stroke="var(--text-secondary)" strokeWidth="1.5" opacity="0.6" />
        {/* Inner Face */}
        <circle cx="32" cy="32" r="24" fill="rgba(var(--bg-secondary-rgb), 0.4)" stroke="var(--text-muted)" strokeWidth="0.75" />
        {/* Top Button */}
        <path d="M32 4V8" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M29 6H35" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Ticks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
            <line
                key={`tick-${angle}`}
                x1="32" y1={angle % 90 === 0 ? "8" : "9"} // Longer ticks at quarters
                x2="32" y2="11"
                transform={`rotate(${angle} 32 32)`}
                stroke="var(--text-muted)"
                strokeWidth={angle % 90 === 0 ? "1" : "0.75"} // Thicker ticks at quarters
                opacity="0.8"
            />
        ))}
        {/* Second Hand */}
        <motion.line
            x1="32" y1="32" x2="32" y2="14"
            stroke="var(--accent-highlight)" // Use theme accent
            strokeWidth="1.5" strokeLinecap="round"
            style={{ transformOrigin: 'center center' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        {/* Center Pin */}
        <circle cx="32" cy="32" r="1.5" fill="var(--accent-primary)" /> {/* Use theme accent */}
    </motion.svg>
);

// --- Decrypting Text Component (No changes needed) ---
const DecryptingText: React.FC<{ text: string; isDecrypting: boolean; className?: string; onComplete?: () => void }> = ({ text, isDecrypting, className, onComplete }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#%&@$<>[]{}()"; // Added more chars
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [displayedText, setDisplayedText] = useState(text);

    useEffect(() => {
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (isDecrypting) {
            setDisplayedText(text.split("").map(() => letters[Math.floor(Math.random() * letters.length)]).join("")); // Start scrambled

            intervalRef.current = setInterval(() => {
                const newText = text.split("").map((_letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                }).join("");

                setDisplayedText(newText);

                if (iteration >= text.length) { // Stop when original length reached
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setDisplayedText(text); // Ensure final text is correct
                    if(onComplete) onComplete();
                }
                iteration += 1 / 3; // Control speed
            }, 35); // Interval duration
        } else {
            setDisplayedText(text);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isDecrypting, text, letters, onComplete]);

    return <span className={`${className} ${styles.decryptingText}`}>{displayedText}</span>;
};

// --- Framer Motion Variants (No changes needed) ---
const fadeIn = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

// --- ASCII Art Sets (Keep as is, ensure AsciiArtPlaceholder handles them) ---

// --- ASCII Art Sets ---
const manicArtSet = [
    `
           ███╗   ███╗ █████╗ ███╗   ██╗██╗ ██████╗
           ████╗ ████║██╔══██╗████╗  ██║██║██╔════╝
           ██╔████╔██║███████║██╔██╗ ██║██║██║  ███╗
           ██║╚██╔╝██║██╔══██║██║╚██╗██║██║██║   ██║
           ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║╚██████╔╝
           ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝
            << INTENSITY + METHODOLOGY >>`,
    `
          .--''''''--.
        .'           '.    // Strategic Chaos
       /   O      O    \\  // Engineered Results
      |    \\  ^^  /     | // Manic Focus
      |     '.__/.'      |
       \\    '----'     / << Processing >>
        '. ________ .'
          '--____--'
    `,
    `  ____________________ ___ ____________ __________
      /\\                 /\\ /\\             /\\         /\\
     /__\\_______________/__\\/__\\___________/__\\_______/__\\
     \\  \\ \\             /  /\\  \\ \\         /  /\\     /  /
      \\  \\ \\___________/  /  \\  \\ \\_______/  /  \\___/  /
       \\  \\/___________/  /    \\  \\/_______/  /    \\__/  /
        \\/______________/      \\/___________/      \\____/
         [ ARCHITECTING REALITY ] [ CODE IS POETRY ]`
    ];
    const techStackArtSet = [
    ` +---------------------------------------------------------+
     | LAYER         | CORE TECHNOLOGIES                     | EXAMPLES     |
     +=========================================================+
     | Presentation  | UI Frameworks, Rendering, State     | React, Vue    |
     | (FE/Mobile)   | Styling, Animation, Native Wrappers | Next, Nuxt, TS|
     |               |                                         | Tailwind, F-M |
     |               |                                         | Electron, Cap |
     +---------------------------------------------------------+
     | API / Backend | Server Logic, Data Access, Auth     | Node, Python  |
     |               | Protocols, Realtime, Microservices  | FastAPI, Go   |
     |               |                                         | GraphQL, gRPC |
     +---------------------------------------------------------+
     | Data          | Relational, NoSQL, Vector, Cache, ETL | PG, Mongo, Pine|
     |               | ORM/Query Builders                    | Redis, Prisma |
     +---------------------------------------------------------+
     | AI / ML / NLP | Training, Fine-tuning, Inference, Ops | PyTorch, TF   |
     |               | LLMs, GenAI, Pipelines, Vector Search | LangChain, HF |
     +---------------------------------------------------------+
     | Web3          | Smart Contracts, Indexing, Wallets    | Solidity, Eth |
     +---------------------------------------------------------+
     | DevOps / Cloud| IaC, CI/CD, Containers, Serverless    | AWS, GCP, K8s |
     |               | Monitoring, Logging                   | Docker, TF    |
     +---------------------------------------------------------+`,
    ];
    const flowArtSet = [
    ` [IDEA/REQ] -> {DISCOVERY} -> (Research/Workshops) --> [STRATEGIC BRIEF]
          ^             |                                         |
          | Feedback    v                                         |
          +-------- {BLUEPRINTING} -> (Arch/UX Flows/Tech Plan) -> [DESIGN SPEC]
          |             |                                         |
          | Iteration   v                                         ^ User Feedback
          +-------- {DESIGN/PROTOTYPE} -> (UI/Visuals/IXD/Test) -> [APPROVED DESIGN]
          |             |                                         |
          |             v                                         |
          +-------- {ENGINEERING} -> (Code/Build/Unit Test) ----> [WORKING SOFTWARE]
          |             | (Agile Sprints)                         ^
          |             v                                         | QA / Testing
          +-------- {VALIDATION} -> (QA/Security/Perf Test) -----> [RELEASE CANDIDATE]
                        |
                        v
                  [DEPLOYMENT] --> [MONITORING] --> [EVOLUTION] ---------> (Loop Back?)
                  (CI/CD/Cloud)   (Analytics)      (Iteration/Support)
    `,
    ];
    // --- End ASCII Art ---

// --- Main Page Component ---
const ProcessPage = () => {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleDecryptClick = () => {
    if (isDecrypting || isDecrypted) return;
    setIsDecrypting(true);
    setShowContent(false); // Hide content during decrypt
    setTimeout(() => {
      // setIsDecrypting(false); // DecryptingText handles its own state via onComplete
      // setIsDecrypted(true);
      // setTimeout(() => setShowContent(true), 250); // Show content after short delay
    }, 1800); // Duration guess based on DecryptingText speed/length
  };

  const handleDecryptComplete = () => {
    setIsDecrypting(false);
    setIsDecrypted(true);
    setTimeout(() => setShowContent(true), 150); // Shorter delay
  };

  // --- Data Definitions (No changes needed, keep as is) ---
  const processPhases = [
    { icon: Search, title: "1. Discovery & Immersion", description: "Initiating descent. We conduct deep contextual analysis via stakeholder workshops, user ethnography, market intelligence scans, and technical audits to unearth core objectives and define quantifiable success.", details: ["Stakeholder Symbiosis", "User Archetype Definition", "Competitive Matrix Analysis", "Goal & KPI Crystallization", "Technical Viability Assessment"] },
    { icon: BrainCircuit, title: "2. Strategic Blueprinting", description: "Architecting the pathways. Raw insight is transmuted into actionable strategy, mapping intricate user journeys, defining resilient information architectures, and forging the technical schematics.", details: ["Experience Cartography", "Information Architecture Design", "Content & Data Strategy", "Technology Stack Selection", "Lo-Fi Wireframing & Interaction Flow"] },
    { icon: Layers3, title: "3. Manic Design & Prototyping", description: "Where inspired 'mania' meets meticulous method. We craft visually arresting, paradigm-shifting interfaces aligned with nuanced brand identities, validated through rapid, high-fidelity prototyping and empirical user feedback.", details: ["UI/UX Design Systems", "Visual Identity & Narrative", "Hi-Fi Interactive Prototypes", "Microinteraction Alchemy", "Accessibility (A11y) by Design"] },
    { icon: Code2, title: "4. Precision Engineering", description: "Translating ethereal designs into tangible, robust code. Emphasis on clean architecture (supporting unified web/mobile via React/Next, Vue/Nuxt, Electron/Capacitor), modern practices, and seamless integration across the stack.", details: ["Frontend Artistry (Web/Mobile)", "Backend & API Sophistication", "Scalable Database Architecture", "Cloud-Native DevOps (IaC)", "AI/ML & Web3 System Integration"] },
    { icon: ShieldCheck, title: "5. Rigorous Validation", description: "Fortifying the creation. Exhaustive testing protocols – automated and manual – ensure functional integrity, peak performance, ironclad security, and seamless usability across all designated realities.", details: ["Automated Test Suites", "Manual & Exploratory QA", "Performance/Load/Stress Testing", "Security Audits & Pentesting", "User Acceptance Trials (UAT)"] },
    { icon: Ship, title: "6. Calculated Deployment", description: "Navigating the launch sequence. Leveraging mature CI/CD pipelines and infrastructure-as-code (IaC), we ensure smooth, predictable deployments to any target environment, coupled with vigilant post-launch monitoring.", details: ["Automated CI/CD Pipeline Strategy", "Infrastructure as Code (Terraform)", "Phased Staging & Production Rollout", "Real-time Observability Setup", "Documentation & Knowledge Transfer"] },
    { icon: Recycle, title: "7. Perpetual Evolution", description: "Digital entities are living systems. Post-launch, we engage in continuous analysis of performance metrics and user feedback, collaborating on data-driven iterations for sustained relevance and growth.", details: ["KPI Analytics & Insight Reporting", "Qualitative User Feedback Synthesis", "A/B Testing & Optimization", "Iterative Feature Roadmapping", "Proactive Maintenance & Support"] }
  ];
  const mvpTimeline = [
    { week: 1, title: "Week 1: Foundation & Vectoring", tasks: ["Deep Dive Workshop & Goal Lock", "User Persona Definition", "Core Journey Mapping", "Initial Wireframes & Moodboards", "Tech Stack & Infra Plan"] },
    { week: 2, title: "Week 2: Design System & Architecture", tasks: ["Establish UI Kit & Style Guide", "Hi-Fi Mockups (Core Flows)", "API Spec & DB Schema Finalized", "Backend Boilerplate & Auth Setup", "Frontend Component Library Init"] },
    { week: 3, title: "Week 3: Manic Build Sprint", tasks: ["Implement P0 Features (FE & BE)", "Integrate Key APIs/Services", "Write Unit & Integration Tests", "Internal Alpha Demo & Feedback Cycle", "Accessibility Checkpoint"] },
    { week: 4, title: "Week 4: Polish, Validate & Deploy", tasks: ["E2E Testing & Bug Squashing", "UI/UX Polish & Microinteractions", "Security/Performance Review", "CI/CD Pipeline Confirmation", "Staging -> Production Rollout & Monitoring"] },
  ];
  const techStack = {
    frontend: ["React", "Next.js", "Vue", "Nuxt", "TypeScript", "Tailwind CSS", "SCSS", "Framer Motion", "Three.js", "D3.js", "PWAs", "Electron", "Capacitor", "Zustand", "RTK"],
    backend: ["Node.js", "Python", "Go", "FastAPI", "Django", "NestJS", "Express", "GraphQL", "REST APIs", "Celery", "Java", "Scala", "C#", "gRPC"],
    ai_ml: ["PyTorch", "TensorFlow", "Keras", "JAX", "scikit-learn", "spaCy", "LangChain", "Hugging Face", "OpenAI API", "Stable Diffusion", "Generative AI (Image/Video/Text)", "LLM Fine-tuning", "LLM Optimization (Quantization, etc.)", "RAG Implementations", "RLHF Pipelines", "Custom NLP Models", "SOTA Neural Networks", "OpenCV"],
    data_db: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "SQLAlchemy", "Elasticsearch", "Pinecone", "Weaviate", "GraphQL", "ETL Pipelines (Airflow, Dagster)", "Data Warehousing (Redshift)", "Web Scraping (Puppeteer, BS4)"], // Added Scraping
    devops_cloud: ["AWS (EC2, Lambda, S3, EKS, RDS, etc)", "GCP", "Vercel", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "CI/CD", "Linux", "Serverless Architectures"],
    web3: ["Solidity", "ethers.js", "HardHat", "Geth", "ERC Standards (20, 721, 1155)", "IPFS", "Blockchain Indexing"],
    design_tools: ["Figma", "Adobe Creative Suite (XD, AI, PS, AE)", "ProtoPie", "Spline", "Blender", "Principle"], // Added AE
    marketing_tools: ["Google Analytics 4", "Segment", "HubSpot / Salesforce", "Ahrefs / SEMrush", "Meta/Google/LinkedIn Ads", "Mailchimp / Klaviyo", "Social Listening Platforms", "Amplitude / Mixpanel"],
    automation_tools: ["n8n", "Make (Integromat)", "Zapier", "AI Agent Frameworks"],
    tools_other: []
    // Added AI Agents
  };
  // --- End Data ---

  return (
    // Ensure root div uses theme background/text
    <div className="min-h-screen bg-[--bg-primary] text-[--text-primary] overflow-x-hidden">
      {/* --- Hero Section --- */}
      <section className="relative pt-20 md:pt-24 pb-10 md:pb-12 text-center overflow-hidden min-h-[45vh] md:min-h-[40vh] flex flex-col justify-center">
          {/* Background Elements using Theme Accents */}
          <div className="absolute inset-0 z-0 opacity-[0.06]"> {/* Reduced opacity */}
              <div className="absolute top-[5%] left-[5%] w-56 h-56 bg-[--accent-primary] rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-[5%] right-[5%] w-64 h-64 bg-[--accent-secondary] rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
              {/* Add a third element */}
              <div className="absolute top-[40%] right-[20%] w-48 h-48 bg-[--accent-highlight] rounded-xl filter blur-3xl animate-pulse animation-delay-4000 opacity-80"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
              <div className="relative inline-block max-w-full">
                  <motion.div className="mb-3 md:mb-4">
                      {/* Stopwatch uses theme vars now */}
                      <StylizedStopwatch className="w-16 h-16 md:w-20 md:h-20 mx-auto text-[--text-secondary]" />
                  </motion.div>

                  {/* Decrypt Interaction */}
                  <AnimatePresence mode="wait">
                      {!isDecrypted && !isDecrypting && (
                          <motion.div key="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                              {/* Use a theme-appropriate button style if available */}
                              {/* Example: Using a custom class 'rabbit-hole-btn' or standard Button */}
                              <Button
                                  onClick={handleDecryptClick}
                                //   className="rabbit-hole-btn" // Or use variant/size
                                  variant="outline" // Use standard outline variant
                                  size="lg"
                                  className="mt-2 font-mono text-sm md:text-base tracking-wider"
                              >
                                  <LockKeyhole className="w-4 h-4 mr-2" />
                                  Decrypt: The Manic Blueprint
                              </Button>
                          </motion.div>
                      )}

                      {isDecrypting && (
                          <motion.div key="decrypting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-base md:text-lg text-[--accent-secondary] font-mono flex items-center justify-center gap-2">
                              <motion.div
                                  className="w-4 h-4 border-2 border-dashed border-[--accent-secondary] rounded-full animate-spin"
                                  style={{ borderTopColor: 'transparent', animationDuration: '0.8s' }}
                              /> {/* Simple spinner */}
                              <DecryptingText
                                  text="INITIATING DECRYPTION PROTOCOL..." // Longer text
                                  isDecrypting={isDecrypting}
                                  className="tracking-widest"
                                  onComplete={handleDecryptComplete} // Trigger state change on completion
                              />
                          </motion.div>
                      )}

                      {isDecrypted && !isDecrypting && ( // Ensure decrypting text is gone
                          <motion.div key="decrypted" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                              <p className="text-xs font-semibold uppercase tracking-wider leading-7 text-[--accent-primary] mt-4 opacity-90">
                                  :: Blueprint Accessed :: {/* More thematic */}
                              </p>
                              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-4xl font-display text-[--text-heading]"> {/* Use text-heading */}
                                  The Manic Blueprint
                              </h1>
                          </motion.div>
                      )}
                  </AnimatePresence>

                  {/* Overlay during decryption */}
                  <AnimatePresence>
                      {isDecrypting && (
                          <motion.div
                              key="overlay"
                              className={styles.decryptOverlay}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                          >
                              Processing...
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

              {/* Logo Link */}
              <div>
                <a href="/" aria-label="Return to homepage">
                    <img
                        src="/logo-transparent.png" // Ensure this path is correct
                        alt="Manic Process Logo" // Add alt text
                        style={{
                            maxWidth: 'clamp(280px, 40vw, 400px)', // Responsive width
                            height: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            margin: '1.5rem auto 0', // Adjusted margin
                            filter: 'drop-shadow(0 2px 5px rgba(var(--shadow-color), 0.3))' // Subtle shadow
                        }}
                    />
                </a>
              </div>
          </div>
      </section>


      {/* --- Main Content --- */}
      <AnimatePresence>
          {showContent && (
              // Apply documentWrapper class for max-width etc.
              <motion.div
                  key="process-content-main"
                  initial={{ opacity: 0, y: 20 }} // Add subtle slide-up
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`${styles.documentWrapper} container mx-auto px-4`} // Added wrapper
              >

                  {/* --- Philosophy --- */}
                  <section className={`pt-10 md:pt-12 lg:pt-16 pb-8 md:pb-10 ${styles.documentSection}`}>
                      <motion.div className="max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                          <motion.h2 variants={fadeIn} className={`${styles.sectionTitle} text-center`}>Philosophy: Engineered Serendipity</motion.h2>
                          {/* Apply refined quote style */}
                          <motion.blockquote variants={fadeIn} className={`${styles.quote} text-base md:text-lg`}>
                              The "Manic Blueprint" is our signature methodology: harnessing the intense, kinetic energy of creative 'mania' within a <strong>rigorous, adaptive framework</strong>. We don't merely execute tasks; we architect holistic digital realities, forging innovation through <strong>disciplined chaos</strong>. This allows us to navigate extreme complexity and deliver exceptional results with remarkable velocity – often materializing a feature-rich <strong>Minimum Viable Product in under four weeks</strong>.
                          </motion.blockquote>
                          <motion.p variants={fadeIn} className="text-base md:text-lg text-[--text-muted] leading-relaxed mt-8"> {/* Increased margin */}
                              Our process is a dialectic between visionary exploration and pragmatic execution. We believe groundbreaking solutions arise from controlled friction, where the structured Blueprint guides the volatile brilliance of 'mania'. This fosters emergent strategies and allows us to engineer serendipitous breakthroughs while maintaining unwavering project momentum and architectural integrity. We operate remotely, collaborating globally from our nexus in <strong>Los Angeles, California</strong>.
                          </motion.p>
                      </motion.div>
                  </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- Ascii Art & Mania Method --- */}
                  <section className={`py-10 md:py-12 lg:py-16 bg-gradient-to-br from-[--bg-secondary]/10 via-[--bg-secondary]/30 to-[--bg-secondary]/10 ${styles.documentSection}`}>
                      <div className="container mx-auto px-4">
                          <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-20 items-center"> {/* Increased gap */}
                              <motion.div
                                  className="md:col-span-1 mb-10 md:mb-0 md:pr-8"
                                  initial={{ opacity: 0, filter: 'blur(8px)' }} // Stronger initial blur
                                  whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                  transition={{ duration: 0.9, delay: 0.2 }} // Slower transition
                                  viewport={{ once: true }}
                              >
                                  {/* Apply wrapper class for styling */}
                                  <div className={styles.asciiPlaceholderWrapper}>
                                    <AsciiArtPlaceholder
                                      artSet={manicArtSet} // Provide the art set
                                      animate={true} // Enable animation if desired
                                      animationInterval={3500} // Adjust interval
                                      className="!bg-transparent !border-none" // Remove internal styling if wrapper handles it
                                      preClassName="!text-xs" // Ensure small font if needed
                                      />
                                  </div>
                              </motion.div>
                              <motion.div
                                  className="md:col-span-1"
                                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
                              >
                                  <motion.h3 variants={fadeIn} className={`${styles.sectionTitle} !text-2xl md:!text-3xl !mb-4 text-left`}>The 'Mania' Method</motion.h3>
                                  <motion.p variants={fadeIn} className="text-base md:text-lg text-[--text-secondary] mb-4 leading-relaxed">
                                      Our workflow is a dynamic, obsessive cycle refined by cross-disciplinary expertise. <strong>Hyper-focused iteration</strong>, transparent feedback loops, and the relentless pursuit of elegance in function and form define our approach to complex problem-solving.
                                  </motion.p>
                                  <motion.p variants={fadeIn} className="text-base md:text-lg text-[--text-muted] mb-6 leading-relaxed"> {/* Adjusted spacing */}
                                      This 'manic' intensity, channeled through the Blueprint, cultivates emergent strategies and creative breakthroughs while rigorously maintaining project velocity and architectural soundness. We synthesize complexity into clarity, materializing the future, <strong>faster and smarter</strong>.
                                  </motion.p>
                                  <motion.div variants={fadeIn} className="mt-8">
                                      {/* Use a styled button - e.g., rabbit-trail */}
                                      <Button asChild variant="outline" size="default" className="rabbit-trail">
                                        <Link href="/contact">
                                            Initiate Dialogue
                                            {/* Arrow is handled by CSS */}
                                        </Link>
                                      </Button>
                                  </motion.div>
                              </motion.div>
                          </div>
                      </div>
                  </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- Phased Breakdown --- */}
                  <section className={`py-10 md:py-12 lg:py-16 ${styles.documentSection}`}>
                      <div className="container mx-auto px-4">
                          <motion.div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                              <motion.h2 variants={fadeIn} className={`${styles.sectionTitle}`}>Blueprint Phases</motion.h2>
                              <motion.p variants={fadeIn} className={`${styles.sectionSubtitle}`}>Methodical descent through the creative labyrinth, ensuring comprehensive coverage and iterative refinement.</motion.p>
                          </motion.div>
                          {/* Apply card styles via module */}
                          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
                              {processPhases.map((phase) => (
                                  <motion.div key={phase.title} variants={fadeIn} className={styles.processStepCard}>
                                      <div className="flex items-center gap-3"> {/* Wrapper for icon and title */}
                                          <div className="p-2 rounded-lg bg-gradient-to-br from-[--accent-primary]/10 to-[--accent-secondary]/10 border border-[--accent-primary]/20 shadow-inner">
                                              <phase.icon className="w-7 h-7 text-[--accent-primary]" strokeWidth={1.5} />
                                          </div>
                                          <h3 /* className added via module */ >{phase.title}</h3>
                                      </div>
                                      <p /* className added via module */ >{phase.description}</p>
                                      <ul /* className added via module */ >
                                          {phase.details.map(detail => (
                                              <li key={detail} /* className added via module */ >
                                                  <CheckCircle /* className added via module */ strokeWidth={2} /> {detail}
                                              </li>
                                          ))}
                                      </ul>
                                  </motion.div>
                              ))}
                          </motion.div>
                      </div>
                  </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- Example Timeline --- */}
                  <section className={`py-10 md:py-12 lg:py-16 bg-[--bg-secondary]/20 ${styles.documentSection}`}>
                       <div className="container mx-auto px-4">
                           <motion.div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                               <motion.h2 variants={fadeIn} className={`${styles.sectionTitle}`}>Velocity Example: 4-Week MVP</motion.h2>
                               <motion.p variants={fadeIn} className={`${styles.sectionSubtitle}`}>Illustrating rapid, high-value delivery through intensive, parallelized workstreams.</motion.p>
                           </motion.div>
                           {/* Apply timeline styles via module */}
                           <div className={styles.timelineContainer}>
                               {mvpTimeline.map((item) => (
                                   <motion.div
                                       key={`week-${item.week}`}
                                       className={styles.timelineItem}
                                       variants={fadeIn} // Use simple fade-in for timeline items
                                       initial="hidden"
                                       whileInView="visible"
                                       viewport={{ once: true, amount: 0.2 }}
                                   >
                                       <div className={styles.timelineDot}></div>
                                       <div className={styles.timelineContent}>
                                           <span className={styles.timelineWeek}>Week {item.week}</span>
                                           <h4 className={styles.timelineTitle}>{item.title}</h4>
                                           <ul className={styles.timelineTaskList}>
                                               {item.tasks.map(task => (
                                                   <li key={task} className={styles.timelineTaskItem}>
                                                       <ArrowRight /* className handled by module */ /> {task}
                                                   </li>
                                               ))}
                                           </ul>
                                       </div>
                                   </motion.div>
                               ))}
                           </div>
                           <motion.p variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center text-xs text-[--text-muted] mt-8 opacity-80 font-mono">
                               Note: Timelines dynamically scale with scope & complexity; core velocity principles persist.
                           </motion.p>
                       </div>
                  </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- Technology Arsenal & Capabilities --- */}
                  <section className={`py-10 md:py-12 lg:py-16 ${styles.documentSection}`}>
                      <div className="container mx-auto px-4">
                          <motion.div className="max-w-4xl mx-auto text-center mb-12 md:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                              <motion.h2 variants={fadeIn} className={`${styles.sectionTitle}`}>Full-Spectrum Arsenal</motion.h2>
                              <motion.p variants={fadeIn} className={`${styles.sectionSubtitle}`}>
                                  Our integrated, multi-disciplinary teams operate at the convergence of design, advanced engineering, and strategic growth. We wield a comprehensive, state-of-the-art technology stack. Meet the{' '}
                                  {/* Use styled link */}
                                  <Link href="/team" legacyBehavior>
                                      <a className={styles.styledLink}>Core Architects <ArrowRight /></a>
                                  </Link>.
                              </motion.p>
                          </motion.div>
                          {/* Technology Grid */}
                          <motion.div
                              variants={staggerContainer} // Stagger children
                              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} // Adjust viewport amount
                          >
                              <div className={styles.techGrid}>
                                  {/* Render Categories using map for cleaner code */}
                                  {[
                                      { title: "Design Tools", icon: Palette, items: techStack.design_tools },
                                      { title: "Frontend", icon: Layers3, items: techStack.frontend },
                                      { title: "Backend & API", icon: Server, items: techStack.backend },
                                      { title: "AI/ML/NLP", icon: Bot, items: techStack.ai_ml },
                                      { title: "Data & Databases", icon: DatabaseZap, items: techStack.data_db },
                                      { title: "Web3 & Blockchain", icon: Gift, items: techStack.web3 },
                                      { title: "DevOps & Cloud", icon: Cloud, items: techStack.devops_cloud },
                                      { title: "Marketing Tech", icon: Target, items: techStack.marketing_tools },
                                      { title: "Automation & Tools", icon: Cog, items: [...techStack.automation_tools, ...techStack.tools_other] },
                                  ].map((category) => (
                                      <motion.div key={category.title} variants={fadeIn} className={styles.techCategoryCard}>
                                          <h4 className={styles.techCategoryTitle}><category.icon /> {category.title}</h4>
                                          <ul className={styles.techList}>
                                              {category.items.map(tech => <li key={tech} className={styles.techItem}>{tech}</li>)}
                                          </ul>
                                      </motion.div>
                                  ))}

                                  {/* ASCII Placeholders */}
                                  <motion.div variants={fadeIn} className={`${styles.techCategoryCard} md:col-span-2 lg:col-span-1 bg-[--bg-tertiary]/30`}>
                                      <h4 className={styles.techCategoryTitle}><Terminal/> Conceptual Stack</h4>
                                      <div className={styles.asciiPlaceholderWrapper}>
                                          <AsciiArtPlaceholder artSet={techStackArtSet} animate={false} className="!bg-transparent !border-none" />
                                      </div>
                                  </motion.div>
                                  <motion.div variants={fadeIn} className={`${styles.techCategoryCard} md:col-span-2 lg:col-span-2 bg-[--bg-tertiary]/30`}>
                                      <h4 className={styles.techCategoryTitle}><GitBranch/> Conceptual Workflow</h4>
                                      <div className={styles.asciiPlaceholderWrapper}>
                                          <AsciiArtPlaceholder artSet={flowArtSet} animate={false} className="!bg-transparent !border-none" />
                                      </div>
                                  </motion.div>
                              </div>
                          </motion.div>
                      </div>
                  </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- AI & Automation Focus --- */}
                   <section className={`py-10 md:py-12 lg:py-16 bg-[--bg-secondary]/20 ${styles.documentSection}`}>
                       <div className="container mx-auto px-4">
                           <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-20 items-center"> {/* Increased gap */}
                               <motion.div className="md:col-span-1 mb-10 md:mb-0" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} >
                                   <motion.h3 variants={fadeIn} className={`${styles.sectionTitle} !text-2xl md:!text-3xl !mb-4 text-left`}>Intelligence & Automation Core</motion.h3>
                                   <motion.p variants={fadeIn} className="text-base md:text-lg text-[--text-secondary] mb-4 leading-relaxed">
                                       We architect intelligent systems, specializing in <strong>E2E ML infrastructure</strong>, sophisticated data pipelines (ETL/ELT), custom deep learning model training (SOTA NNs), and <strong>advanced prompt engineering</strong> for foundational LLMs.
                                   </motion.p>
                                   <motion.p variants={fadeIn} className="text-base md:text-lg text-[--text-muted] mb-4 leading-relaxed">
                                       Our capabilities encompass Retrieval-Augmented Generation (RAG), Reinforcement Learning from Human Feedback (RLHF), comprehensive <strong>LLM optimization</strong> (quantization, specialized fine-tuning), state-of-the-art NLP, and generative AI across modalities (Stable Diffusion, etc.).
                                   </motion.p>
                                   <motion.p variants={fadeIn} className="text-base md:text-lg text-[--text-muted] leading-relaxed">
                                       We build custom <strong>AI agents</strong>, develop intricate automations (n8n, Zapier, bespoke Python workflows), and deploy robust web scraping/crawling solutions for complex data acquisition challenges.
                                   </motion.p>
                               </motion.div>
                               <motion.div
                                   className="md:col-span-1"
                                   initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                                   transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} viewport={{ once: true }}
                               >
                                   {/* ASCII Placeholder for AI/Data Flow */}
                                   {/* You can provide a relevant artSet here if you have one */}
                                   <div className={styles.asciiPlaceholderWrapper}>
                                      <AsciiArtPlaceholder height="380px" className="!bg-transparent !border-none" />
                                   </div>
                               </motion.div>
                           </div>
                       </div>
                   </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- Software Pillars --- */}
                   <section className={`py-10 md:py-12 lg:py-16 ${styles.documentSection}`}>
                        <div className="container mx-auto px-4">
                           <motion.div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} >
                               <motion.h2 variants={fadeIn} className={`${styles.sectionTitle}`}>Design & Engineering Pillars</motion.h2>
                               <motion.p variants={fadeIn} className={`${styles.sectionSubtitle}`}>Our foundational principles for crafting enduring digital value.</motion.p>
                           </motion.div>
                           <motion.div className={styles.pillarGrid} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} >
                               {/* Pillar Cards using module styles */}
                               {/* Note: Added text-[color] utility classes for icon colors directly */}
                               <motion.div variants={fadeIn} className={styles.pillarCard}>
                                   <div className={styles.pillarIconWrapper}> <Recycle className={`${styles.pillarIcon} text-[--accent-secondary]`} /> </div>
                                   <h4 className={styles.pillarTitle}>Sustainability</h4>
                                   <p className={styles.pillarText}>Architecting for maintainability, adaptability, and future evolution. Minimizing technical debt, maximizing lifespan.</p>
                               </motion.div>
                               <motion.div variants={fadeIn} className={styles.pillarCard}>
                                   <div className={styles.pillarIconWrapper}> <Gift className={`${styles.pillarIcon} text-[--accent-primary]`} /> </div>
                                   <h4 className={styles.pillarTitle}>True Ownership</h4>
                                   <p className={styles.pillarText}>You own your intellectual property. We deliver clean codebases and offer flexible, transparent licensing (incl. open-source).</p>
                               </motion.div>
                               <motion.div variants={fadeIn} className={styles.pillarCard}>
                                   <div className={styles.pillarIconWrapper}> <GitBranch className={`${styles.pillarIcon} text-[--accent-highlight]`} /> </div>
                                   <h4 className={styles.pillarTitle}>Portability</h4>
                                   <p className={styles.pillarText}>Building on established standards, avoiding vendor lock-in, ensuring your freedom and future technological agility.</p>
                               </motion.div>
                               <motion.div variants={fadeIn} className={styles.pillarCard}>
                                    {/* Assuming --brand-cyan is defined in theme or globals */}
                                   <div className={styles.pillarIconWrapper}> <Archive className={`${styles.pillarIcon} text-[var(--brand-cyan,var(--accent-cool))]`} /> </div>
                                   <h4 className={styles.pillarTitle}>Retro-Consideration</h4>
                                   <p className={styles.pillarText}>Balancing cutting-edge digital design with the tactile assurance of robust, backwards-compatible engineering. Functionality that feels solid.</p>
                               </motion.div>
                           </motion.div>
                        </div>
                   </section>
                  <hr className={styles.sectionDivider} />

                  {/* --- Explore Further --- */}
                  <section className={`py-10 md:py-12 lg:py-16 text-center ${styles.documentSection}`}>
                       <div className="container mx-auto px-4">
                           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                               <motion.h2 variants={fadeIn} className={`${styles.sectionTitle} mb-8 md:mb-10`}>Descend Further</motion.h2>
                               <motion.div variants={fadeIn} className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-10">
                                   <Link href="/projects" legacyBehavior><a className={styles.styledLink}> [ Our Creations ] <ArrowRight /> </a></Link>
                                   <Link href="/blog" legacyBehavior><a className={styles.styledLink}> [ The Æther Log ] <ArrowRight /> </a></Link>
                                   <span className={`${styles.styledLink} ${styles.comingSoon}`}> [ Case Studies ] <ArrowRight /> </span> {/* Apply coming soon styles */}
                               </motion.div>
                           </motion.div>
                       </div>
                  </section>

                  {/* --- Final CTA --- */}
                  <section className="py-16 md:py-20 lg:py-24">
                    <motion.div>
                        <h3>Ready to Initiate Your Blueprint?</h3>
                        <Button asChild variant="default" size="lg" className="group text-base btn-synthetic">
                            <Link href="/contact" className="inline-flex items-center gap-2">
                                <>
                                    Engage Contact Protocol
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"/>
                                </>
                            </Link>
                        </Button>
                    </motion.div>
                </section>
              </motion.div> // End documentWrapper
          )}
      </AnimatePresence>
    </div> // End root div
  );
};

export default ProcessPage;