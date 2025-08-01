// src/components/TaglineSection.tsx
'use client';

import React from 'react';
import { AnimatedAscii } from './Icons';
import styles from './TaglineSection.module.css';

const TaglineSection: React.FC = () => {
    return (
        <section className={styles.taglineSection}>
            <div className={styles.container}>
                <div className={styles.taglineWrapper}>
                    <AnimatedAscii chars={['>', '_', '|', '█', '▒']} interval={200} />
                    <span className={styles.taglineText}>Metaverses intersect here</span>
                </div>
            </div>
        </section>
    );
};

export default TaglineSection;
