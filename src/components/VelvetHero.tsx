"use client";

import Link from 'next/link';
import Image from 'next/image';
import velvetLogo from "../images/velvet-web-logo.png"
import styles from './VelvetHero.module.css'
import bgImage from "@/images/velvet-bg.jpg";
import { motion } from "framer-motion";

export default function VelvetHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        {/* Theme-responsive background elements */}
        <div className={styles.bgGradient}></div>
        <div className={styles.bgPattern}></div>
        <div className={styles.bgGlow1}></div>
        <div className={styles.bgGlow2}></div>
      </div>
      
      <div className={styles.heroContent}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroText}
        >
          <h1 className={styles.heroTitle}>
            Velvet <span className={styles.accent}>Web</span>
          </h1>
          <p className={styles.heroSubtitle}>
            AI-Powered Community for Innovators
          </p>
          <p className={styles.heroDescription}>
            Join an innovative community of founders, creators, and developers. 
            Get AI-powered insights, project management, advanced code analysis tools, 
            and curated crypto/tech news.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.heroActions}
        >
          <a 
            href="https://discord.gg/velvetweb" 
            className={styles.ctaButton}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Join Discord Community
          </a>
          <a 
            href="#features" 
            className={styles.secondaryButton}
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
