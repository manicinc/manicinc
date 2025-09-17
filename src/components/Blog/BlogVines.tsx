// src/components/Blog/BlogVines.tsx
// OPTIMIZED VERSION - Improved performance while keeping visual effects
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './BlogVines.module.css';

// --- Configuration (DECORATIVE & RESPONSIVE) ---
const NUM_MAIN_VINES = 12; // More vines for fuller coverage
const MAX_BRANCH_DEPTH = 5; // Deeper branching for richness
const BRANCH_PROBABILITY = 0.65; // Higher branching for fuller look
const SEGMENTS_PER_VINE = 15; // More segments for intricate detail
const SPREAD_FACTOR = 60; // Wider spread for better coverage
const CURVE_FACTOR = 0.9; // Very high curve for organic flow
const IDLE_TIMEOUT_MS = 5000;
const INTERACTION_TIMEOUT_MS = 600;
const FAST_SCROLL_THRESHOLD = 100;
const RESIZE_DEBOUNCE_MS = 500;
const SCROLL_UPDATE_INTERVAL_MS = 50; // Faster updates for smoother response
const FLOWER_PROBABILITY = 0.25; // More flowers for decoration
const FLOWER_BASE_RADIUS = 2.5; // Larger, more visible petals
const FLOWER_ALT_COLOR_THRESHOLD = 0.5;
const LEAF_PROBABILITY = 0.15; // Add leaves for variety

// Simplified activity states
type ActivityStateType = 'idle' | 'active' | 'interacting';

interface VinePathData {
    pathD: string;
    strokeVar: number;
    delay: string;
}

interface FlowerData {
    cx: number;
    cy: number;
    r: number;
    colorVar: number;
    delay: string;
    type: 'flower' | 'leaf' | 'bud';
}

// Throttle function for performance
const throttle = (func: Function, delay: number) => {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
        const now = Date.now();
        const remaining = delay - (now - lastCall);

        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            func(...args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                func(...args);
            }, remaining);
        }
    };
};

// Debounce function for performance
const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// Simplified vine path generation (memoized)
const generateVinePath = (
    startX: number, startY: number,
    targetX: number, targetY: number,
    segments: number,
    spread: number,
    curveFactor: number,
    branchProbability: number,
    maxBranchDepth: number,
    baseIndex: number,
    currentDepth: number = 0
): { mainPath: VinePathData; branches: VinePathData[]; flowers: FlowerData[] } => {
    let pathD = `M${startX.toFixed(1)} ${startY.toFixed(1)}`;
    let branches: VinePathData[] = [];
    let flowers: FlowerData[] = [];
    let currentX = startX;
    let currentY = startY;
    const totalDX = targetX - startX;
    const totalDY = targetY - startY;

    for (let i = 1; i <= segments; i++) {
        const progress = i / segments;
        const segmentEndX = startX + totalDX * progress + (Math.random() - 0.5) * 6; // Reduced from 8
        const segmentEndY = startY + totalDY * progress + (Math.random() - 0.5) * 6;

        const segmentDX = segmentEndX - currentX;
        const segmentDY = segmentEndY - currentY;

        // Simplified control points
        const controlX1 = currentX + segmentDX * 0.4;
        const controlY1 = currentY + segmentDY * 0.4;
        const controlX2 = segmentEndX - segmentDX * 0.25;
        const controlY2 = segmentEndY - segmentDY * 0.25;

        pathD += ` C ${controlX1.toFixed(1)} ${controlY1.toFixed(1)}, ${controlX2.toFixed(1)} ${controlY2.toFixed(1)}, ${segmentEndX.toFixed(1)} ${segmentEndY.toFixed(1)}`;

        // Enhanced decorative element generation
        const decorRoll = Math.random();
        if (i > 1 && decorRoll < FLOWER_PROBABILITY) {
            // Decide what type of decoration
            const decorType = decorRoll < 0.1 ? 'bud' : (decorRoll < 0.18 ? 'leaf' : 'flower');

            if (decorType === 'flower') {
                // Create multiple petals around the point for a flower
                const petalCount = Math.random() > 0.5 ? 5 : 3; // 3 or 5 petals
                const baseRadius = FLOWER_BASE_RADIUS + Math.random() * 3;

                for (let p = 0; p < petalCount; p++) {
                    const angle = (p / petalCount) * Math.PI * 2 + Math.random() * 0.3;
                    const petalOffset = baseRadius * (0.4 + Math.random() * 0.3);
                    flowers.push({
                        cx: segmentEndX + Math.cos(angle) * petalOffset,
                        cy: segmentEndY + Math.sin(angle) * petalOffset,
                        r: baseRadius * (0.5 + Math.random() * 0.5),
                        colorVar: Math.random(),
                        delay: `${p * 0.05}s`,
                        type: 'flower'
                    });
                }
            } else if (decorType === 'leaf') {
                // Add leaves
                const leafAngle = Math.random() * Math.PI * 2;
                flowers.push({
                    cx: segmentEndX + Math.cos(leafAngle) * 5,
                    cy: segmentEndY + Math.sin(leafAngle) * 5,
                    r: 3 + Math.random() * 2,
                    colorVar: Math.random(),
                    delay: '0s',
                    type: 'leaf'
                });
            } else {
                // Add bud
                flowers.push({
                    cx: segmentEndX,
                    cy: segmentEndY,
                    r: 1.5 + Math.random(),
                    colorVar: Math.random(),
                    delay: '0s',
                    type: 'bud'
                });
            }
        }

        // Enhanced branching for fuller look
        if (currentDepth < maxBranchDepth && Math.random() < branchProbability &&
            (i === Math.floor(segments / 3) || i === Math.floor(segments * 2 / 3))) {
            const numBranches = Math.random() > 0.7 ? 2 : 1; // Sometimes create 2 branches

            for (let b = 0; b < numBranches; b++) {
                const branchAngle = (Math.random() - 0.5) * Math.PI / 1.5 + (b * Math.PI / 4);
                const branchLength = 40 + Math.random() * 50;
                const branchTargetX = segmentEndX + Math.cos(branchAngle) * branchLength;
                const branchTargetY = segmentEndY + Math.sin(branchAngle) * branchLength;

                const branchResult = generateVinePath(
                    segmentEndX, segmentEndY, branchTargetX, branchTargetY,
                    Math.floor(segments * 0.6), spread * 0.7, curveFactor * 0.9,
                    branchProbability * 0.5, maxBranchDepth,
                    baseIndex + branches.length + 1,
                    currentDepth + 1
                );
                branches.push(branchResult.mainPath);
                branches.push(...branchResult.branches);
                flowers.push(...branchResult.flowers);
            }
        }

        currentX = segmentEndX;
        currentY = segmentEndY;
    }

    return {
        mainPath: { pathD, strokeVar: Math.random(), delay: '0s' },
        branches,
        flowers
    };
};

// Main component
const BlogVines: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [allPaths, setAllPaths] = useState<VinePathData[]>([]);
    const [allFlowers, setAllFlowers] = useState<FlowerData[]>([]);
    const [activityState, setActivityState] = useState<ActivityStateType>('idle');
    const [currentDimensions, setCurrentDimensions] = useState({ width: 0, height: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const generatedRef = useRef(false);

    // Generate paths only once on mount
    useEffect(() => {
        if (generatedRef.current) return;

        const generatePaths = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width === 0 || height === 0) return;

            setCurrentDimensions({ width, height });

            const generatedPaths: VinePathData[] = [];
            const generatedFlowers: FlowerData[] = [];

            for (let i = 0; i < NUM_MAIN_VINES; i++) {
                const side = i % 4;
                let sx, sy, tx, ty;

                // Vines grow from nav area with organic positioning
                const navHeight = 60;
                const overlapHeight = 120; // More overlap for fuller coverage

                switch (side % 6) {
                    case 0: // top-left area
                        sx = Math.random() * (width * 0.25);
                        sy = Math.random() * navHeight;
                        tx = sx + (50 + Math.random() * width * 0.4);
                        ty = navHeight + Math.random() * overlapHeight;
                        break;
                    case 1: // top-left-center
                        sx = width * 0.2 + Math.random() * (width * 0.15);
                        sy = Math.random() * navHeight * 0.8;
                        tx = sx + (Math.random() - 0.3) * width * 0.3;
                        ty = navHeight + Math.random() * overlapHeight;
                        break;
                    case 2: // top-center
                        sx = width * 0.4 + Math.random() * (width * 0.2);
                        sy = Math.random() * navHeight * 0.7;
                        tx = sx + (Math.random() - 0.5) * width * 0.25;
                        ty = navHeight + Math.random() * overlapHeight;
                        break;
                    case 3: // top-right-center
                        sx = width * 0.65 + Math.random() * (width * 0.15);
                        sy = Math.random() * navHeight * 0.8;
                        tx = sx + (Math.random() - 0.7) * width * 0.3;
                        ty = navHeight + Math.random() * overlapHeight;
                        break;
                    case 4: // top-right area
                        sx = width * 0.75 + Math.random() * (width * 0.25);
                        sy = Math.random() * navHeight;
                        tx = sx - (50 + Math.random() * width * 0.4);
                        ty = navHeight + Math.random() * overlapHeight;
                        break;
                    default: // edges
                        if (Math.random() > 0.5) {
                            sx = -10;
                            sy = Math.random() * navHeight;
                            tx = 100 + Math.random() * 150;
                            ty = navHeight + Math.random() * overlapHeight;
                        } else {
                            sx = width + 10;
                            sy = Math.random() * navHeight;
                            tx = width - 100 - Math.random() * 150;
                            ty = navHeight + Math.random() * overlapHeight;
                        }
                }

                const result = generateVinePath(
                    sx, sy, tx, ty,
                    SEGMENTS_PER_VINE, SPREAD_FACTOR, CURVE_FACTOR,
                    BRANCH_PROBABILITY, MAX_BRANCH_DEPTH,
                    i * 10
                );

                generatedPaths.push(result.mainPath);
                generatedPaths.push(...result.branches);
                generatedFlowers.push(...result.flowers);
            }

            setAllPaths(generatedPaths);
            setAllFlowers(generatedFlowers);
            generatedRef.current = true;
        };

        // Delay initial generation to not block page load
        const timer = setTimeout(generatePaths, 100);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced scroll handling with state update
    useEffect(() => {
        const updateScrollProgress = throttle(() => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const viewHeight = document.documentElement.clientHeight;
            const maxScroll = docHeight - viewHeight;
            const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
            setScrollProgress(progress);
            document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3));

            // Update activity based on scroll speed
            if (Math.abs(window.scrollY - (window as any).lastScrollY || 0) > FAST_SCROLL_THRESHOLD) {
                setActivityState('interacting');
            }
            (window as any).lastScrollY = window.scrollY;
        }, SCROLL_UPDATE_INTERVAL_MS);

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    // Simplified activity state (reduced event listeners)
    useEffect(() => {
        let idleTimer: NodeJS.Timeout;

        const setActive = throttle(() => {
            setActivityState('active');
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setActivityState('idle'), IDLE_TIMEOUT_MS);
        }, 200);

        const setInteracting = () => {
            setActivityState('interacting');
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setActivityState('active'), INTERACTION_TIMEOUT_MS);
        };

        // Only listen to essential events
        window.addEventListener('mousemove', setActive, { passive: true });
        window.addEventListener('click', setInteracting, { passive: true });

        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener('mousemove', setActive);
            window.removeEventListener('click', setInteracting);
        };
    }, []);

    // Memoized gradients
    const svgGradients = useMemo(() => (
        <defs>
            {/* Simplified gradients - fewer stops */}
            <linearGradient id="vineGradientIdle" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--accent-muted1)" stopOpacity="0.4"/>
            </linearGradient>
            <linearGradient id="vineGradientActive" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="var(--accent-highlight)" stopOpacity="0.6"/>
            </linearGradient>
            <linearGradient id="vineGradientInteract" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-highlight)" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.7"/>
            </linearGradient>
        </defs>
    ), []);

    const isLightMode = typeof window !== 'undefined' && document.body.classList.contains('light');

    return (
        <div className={styles.vinesContainer}>
            <svg
                ref={svgRef}
                id="blog-vine-svg"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                className={styles.vinesSvg}
                data-activity-state={activityState}
            >
                {svgGradients}

                {/* Render paths with simplified styling */}
                {allPaths.map((path, index) => (
                    <path
                        key={`path-${index}`}
                        d={path.pathD}
                        className={styles.vinePath}
                        style={{
                            ['--random-stroke-variation' as any]: path.strokeVar,
                            strokeDashoffset: `calc(3000 * (1 - ${scrollProgress}))`,
                            opacity: 0.4 + scrollProgress * 0.3,
                            strokeWidth: `calc((0.8px + ${scrollProgress * 0.5}px) + var(--random-stroke-variation, 0) * 0.4px)`,
                        }}
                    />
                ))}

                {/* Render decorative elements */}
                {allFlowers.map((flower, index) => {
                    // Different shapes for different types
                    if (flower.type === 'leaf') {
                        return (
                            <ellipse
                                key={`flower-${index}`}
                                className={`${styles.vineFlower} ${styles.vineLeaf}`}
                                cx={flower.cx.toFixed(1)}
                                cy={flower.cy.toFixed(1)}
                                rx={(flower.r * 0.6).toFixed(1)}
                                ry={(flower.r * 1.2).toFixed(1)}
                                transform={`rotate(${Math.random() * 360} ${flower.cx} ${flower.cy})`}
                                style={{
                                    fill: `var(--accent-secondary)`,
                                    opacity: 0.3 + scrollProgress * 0.2,
                                }}
                            />
                        );
                    } else if (flower.type === 'bud') {
                        return (
                            <circle
                                key={`flower-${index}`}
                                className={`${styles.vineFlower} ${styles.vineBud}`}
                                cx={flower.cx.toFixed(1)}
                                cy={flower.cy.toFixed(1)}
                                r={flower.r.toFixed(1)}
                                style={{
                                    fill: `var(--accent-highlight)`,
                                    opacity: 0.4 + scrollProgress * 0.3,
                                }}
                            />
                        );
                    } else {
                        return (
                            <circle
                                key={`flower-${index}`}
                                className={styles.vineFlower}
                                cx={flower.cx.toFixed(1)}
                                cy={flower.cy.toFixed(1)}
                                r={flower.r.toFixed(1)}
                                style={{
                                    fill: `var(${flower.colorVar > FLOWER_ALT_COLOR_THRESHOLD ?
                                        (isLightMode ? '--flower-color-alt-light' : '--flower-color-alt') :
                                        (isLightMode ? '--flower-color-base-light' : '--flower-color-base')})`,
                                    opacity: 0.25 + scrollProgress * 0.4,
                                    transform: `scale(${1 + scrollProgress * 0.3})`,
                                    transformOrigin: `${flower.cx}px ${flower.cy}px`,
                                }}
                            />
                        );
                    }
                })}
            </svg>
        </div>
    );
};

export default React.memo(BlogVines);