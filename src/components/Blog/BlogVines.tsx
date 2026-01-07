// src/components/Blog/BlogVinesBalanced.tsx
// ENHANCED VERSION - More intricate with colorful flowers and scroll-based density
import React, { useEffect, useRef, useState, useMemo } from 'react';
import styles from './BlogVines.module.css';

// Enhanced configuration - more intricate and dense
const NUM_MAIN_VINES = 10; // More vines for density
const MAX_BRANCH_DEPTH = 3; // Middle ground
const BRANCH_PROBABILITY = 0.55; // More branching for intricacy
const SEGMENTS_PER_VINE = 14; // More segments for smoother, more intricate curves
const FLOWER_PROBABILITY = 0.22; // More flowers
const LEAF_PROBABILITY = 0.12; // Some leaves for variety

// Multiple flower colors for variety
const FLOWER_COLORS = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  'var(--accent-highlight)',
  '#d4a5a5', // Soft pink
  '#9c88ff', // Soft purple
  '#f5b7b1', // Peach
];

type ActivityStateType = 'idle' | 'active' | 'scrolling';

interface VinePathData {
  pathD: string;
  strokeVar: number;
  complexity: number; // Track how complex this vine is
}

interface FlowerData {
  cx: number;
  cy: number;
  r: number;
  type: 'flower' | 'leaf' | 'bud';
  color: string;
  petalCount?: number; // For multi-petal flowers
}

// More intricate vine generation with better curves
const generateVinePath = (
  startX: number, startY: number,
  targetX: number, targetY: number,
  segments: number,
  depth: number = 0,
  scrollInfluence: number = 0
): { path: VinePathData; flowers: FlowerData[] } => {
  let pathD = `M${startX.toFixed(1)} ${startY.toFixed(1)}`;
  const flowers: FlowerData[] = [];

  const totalDX = targetX - startX;
  const totalDY = targetY - startY;

  let currentX = startX;
  let currentY = startY;

  // More complex curve calculation
  for (let i = 1; i <= segments; i++) {
    const progress = i / segments;

    // Add spiral-like growth influenced by scroll
    const spiralFactor = Math.sin(progress * Math.PI * 3) * (15 + scrollInfluence * 10);
    const growthFactor = Math.cos(progress * Math.PI * 2) * (12 + scrollInfluence * 8);

    const nextX = startX + totalDX * progress + spiralFactor + (Math.random() - 0.5) * 15;
    const nextY = startY + totalDY * progress + growthFactor + (Math.random() - 0.5) * 12;

    // More organic curves with cubic bezier
    const ctrlX1 = currentX + (nextX - currentX) * 0.3 + (Math.random() - 0.5) * 10;
    const ctrlY1 = currentY + (nextY - currentY) * 0.3 + Math.sin(progress * Math.PI) * 8;
    const ctrlX2 = currentX + (nextX - currentX) * 0.7 + (Math.random() - 0.5) * 10;
    const ctrlY2 = currentY + (nextY - currentY) * 0.7 + Math.cos(progress * Math.PI) * 8;

    pathD += ` C ${ctrlX1.toFixed(1)} ${ctrlY1.toFixed(1)}, ${ctrlX2.toFixed(1)} ${ctrlY2.toFixed(1)}, ${nextX.toFixed(1)} ${nextY.toFixed(1)}`;

    // Add more varied decorations
    const decorRoll = Math.random();
    if (decorRoll < FLOWER_PROBABILITY && i > 2) {
      const decorType = decorRoll < 0.12 ? 'flower' : (decorRoll < 0.18 ? 'leaf' : 'bud');

      if (decorType === 'flower') {
        // Create multi-petal flowers occasionally
        const isPetalFlower = Math.random() < 0.4;
        if (isPetalFlower) {
          const petalCount = Math.random() < 0.5 ? 5 : 3;
          const baseRadius = 2.5 + Math.random() * 2;

          for (let p = 0; p < petalCount; p++) {
            const angle = (p / petalCount) * Math.PI * 2;
            const petalOffset = baseRadius * 0.6;
            flowers.push({
              cx: nextX + Math.cos(angle) * petalOffset,
              cy: nextY + Math.sin(angle) * petalOffset,
              r: baseRadius * 0.6,
              type: 'flower',
              color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)],
              petalCount: petalCount
            });
          }
        } else {
          // Single flower with random color
          flowers.push({
            cx: nextX + (Math.random() - 0.5) * 12,
            cy: nextY + (Math.random() - 0.5) * 12,
            r: 3 + Math.random() * 2.5,
            type: 'flower',
            color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)]
          });
        }
      } else if (decorType === 'leaf') {
        flowers.push({
          cx: nextX + (Math.random() - 0.5) * 15,
          cy: nextY + (Math.random() - 0.5) * 15,
          r: 2.5 + Math.random() * 1.5,
          type: 'leaf',
          color: 'var(--accent-secondary)'
        });
      } else {
        flowers.push({
          cx: nextX,
          cy: nextY,
          r: 1.8 + Math.random() * 1.2,
          type: 'bud',
          color: 'var(--accent-highlight)'
        });
      }
    }

    currentX = nextX;
    currentY = nextY;
  }

  return {
    path: {
      pathD,
      strokeVar: 0.4 + Math.random() * 0.6,
      complexity: segments * (1 + depth * 0.3)
    },
    flowers
  };
};

const BlogVinesBalanced: React.FC = () => {
  const [paths, setPaths] = useState<VinePathData[]>([]);
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [activityState, setActivityState] = useState<ActivityStateType>('idle');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewBoxWidth, setViewBoxWidth] = useState(1920); // Default for SSR consistency
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedRef = useRef(false);

  // Update viewBox width on client mount
  useEffect(() => {
    setViewBoxWidth(window.innerWidth);
  }, []);

  // Generate paths with scroll influence
  useEffect(() => {
    if (generatedRef.current) return;

    const generateAllPaths = () => {
      const width = window.innerWidth;
      const navHeight = 60;
      const overlapHeight = 105; // Reduced overlap - 15px less

      const allPaths: VinePathData[] = [];
      const allFlowers: FlowerData[] = [];

      for (let i = 0; i < NUM_MAIN_VINES; i++) {
        // Distribute vines across the top with some randomness
        const sectionWidth = width / NUM_MAIN_VINES;
        const startX = sectionWidth * i + Math.random() * sectionWidth * 0.8;
        const startY = Math.random() * navHeight * 0.6;

        // Target points below nav with controlled spread
        const targetX = startX + (Math.random() - 0.5) * 250;
        const targetY = navHeight + Math.random() * overlapHeight;

        const { path, flowers: vineFlowers } = generateVinePath(
          startX, startY, targetX, targetY, SEGMENTS_PER_VINE, 0, 0
        );

        allPaths.push(path);
        allFlowers.push(...vineFlowers);

        // Add more branches for intricacy
        if (Math.random() < BRANCH_PROBABILITY) {
          const numBranches = Math.random() < 0.3 ? 2 : 1;

          for (let b = 0; b < numBranches; b++) {
            const branchPoint = 0.3 + Math.random() * 0.4; // Branch from middle section
            const branchStartX = startX + (targetX - startX) * branchPoint;
            const branchStartY = startY + (targetY - startY) * branchPoint;
            const branchAngle = (Math.random() - 0.5) * Math.PI;
            const branchLength = 60 + Math.random() * 80;
            const branchTargetX = branchStartX + Math.cos(branchAngle) * branchLength;
            const branchTargetY = branchStartY + Math.sin(branchAngle) * branchLength * 0.7;

            const { path: branchPath, flowers: branchFlowers } = generateVinePath(
              branchStartX, branchStartY, branchTargetX, branchTargetY,
              Math.floor(SEGMENTS_PER_VINE * 0.7), 1, 0
            );

            allPaths.push(branchPath);
            allFlowers.push(...branchFlowers);

            // Add sub-branches occasionally
            if (Math.random() < 0.3) {
              const subBranchPoint = 0.5 + Math.random() * 0.3;
              const subBranchStartX = branchStartX + (branchTargetX - branchStartX) * subBranchPoint;
              const subBranchStartY = branchStartY + (branchTargetY - branchStartY) * subBranchPoint;
              const subBranchTargetX = subBranchStartX + (Math.random() - 0.5) * 50;
              const subBranchTargetY = subBranchStartY + Math.random() * 30;

              const { path: subPath, flowers: subFlowers } = generateVinePath(
                subBranchStartX, subBranchStartY, subBranchTargetX, subBranchTargetY,
                Math.floor(SEGMENTS_PER_VINE * 0.5), 2, 0
              );

              allPaths.push(subPath);
              allFlowers.push(...subFlowers);
            }
          }
        }
      }

      setPaths(allPaths);
      setFlowers(allFlowers);
      generatedRef.current = true;
    };

    // Small delay to not block initial render
    const timer = setTimeout(generateAllPaths, 200);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced scroll handling with density changes - optimized to reduce re-renders
  useEffect(() => {
    let lastScrollY = 0;
    let lastProgress = 0;
    let lastActivityState: ActivityStateType = 'idle';
    let activityTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, scrollY / (maxScroll * 0.5)) : 0;

      // Only update progress if changed significantly (reduces re-renders)
      if (Math.abs(progress - lastProgress) > 0.02) {
        lastProgress = progress;
        setScrollProgress(progress);
      }

      // Detect scrolling direction for activity state - debounced
      const scrollDelta = Math.abs(scrollY - lastScrollY);
      let newActivityState: ActivityStateType = lastActivityState;

      if (scrollDelta > 5) {
        newActivityState = 'scrolling';
        // Clear previous timeout and set new one
        if (activityTimeout) clearTimeout(activityTimeout);
        activityTimeout = setTimeout(() => {
          if (lastActivityState !== 'active') {
            lastActivityState = 'active';
            setActivityState('active');
          }
        }, 300);
      } else if (scrollY > 100) {
        newActivityState = 'active';
      } else {
        newActivityState = 'idle';
      }

      // Only update activity state if actually changed
      if (newActivityState !== lastActivityState && newActivityState !== 'scrolling') {
        lastActivityState = newActivityState;
        setActivityState(newActivityState);
      } else if (newActivityState === 'scrolling' && lastActivityState !== 'scrolling') {
        lastActivityState = 'scrolling';
        setActivityState('scrolling');
      }

      lastScrollY = scrollY;
    };

    // Throttle scroll updates
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial call
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (activityTimeout) clearTimeout(activityTimeout);
    };
  }, []);

  // Dynamic gradients based on scroll
  const gradients = useMemo(() => (
    <defs>
      {/* Idle gradient */}
      <linearGradient id="vineGradientIdle" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.6"/>
        <stop offset="50%" stopColor="var(--accent-muted1)" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.6"/>
      </linearGradient>

      {/* Active gradient */}
      <linearGradient id="vineGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.7"/>
        <stop offset="50%" stopColor="var(--accent-highlight)" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.7"/>
      </linearGradient>

      {/* Scrolling gradient - more vibrant */}
      <linearGradient id="vineGradientScrolling" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-highlight)" stopOpacity="0.7"/>
        <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.6"/>
      </linearGradient>

      {/* Flower gradients */}
      <radialGradient id="flowerGradient1">
        <stop offset="0%" stopColor="#f5b7b1" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#d4a5a5" stopOpacity="0.4"/>
      </radialGradient>
      <radialGradient id="flowerGradient2">
        <stop offset="0%" stopColor="#9c88ff" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0.4"/>
      </radialGradient>
    </defs>
  ), []);

  const getGradient = () => {
    switch(activityState) {
      case 'scrolling': return 'url(#vineGradientScrolling)';
      case 'active': return 'url(#vineGradientActive)';
      default: return 'url(#vineGradientIdle)';
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.vinesContainer}
      data-activity-state={activityState}
      style={{
        opacity: 0.8 + scrollProgress * 0.15, // Start at 0.8 opacity, increase to 0.95
        transform: `translateY(${scrollProgress * -5}px)`,
      }}
    >
      <svg
        id="blog-vine-svg"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMin slice"
        className={styles.vinesSvg}
        viewBox={`0 0 ${viewBoxWidth} 180`}
      >
        {gradients}

        {/* Render vine paths with complexity-based styling */}
        <g className="vine-paths">
          {paths.map((path, index) => (
            <path
              key={`vine-${index}`}
              d={path.pathD}
              className={styles.vinePath}
              stroke={getGradient()}
              strokeWidth={0.6 + path.strokeVar * 0.5 + scrollProgress * 0.3}
              fill="none"
              opacity={0.7 + scrollProgress * 0.25 + (path.complexity / 30) * 0.05} // More opaque paths
              style={{
                strokeDasharray: 3000,
                strokeDashoffset: 3000 - (3000 * (0.3 + scrollProgress * 0.7)),
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: `drop-shadow(0 1px 3px rgba(var(--accent-primary-rgb), ${0.1 + scrollProgress * 0.2}))`,
              }}
            />
          ))}
        </g>

        {/* Render decorative elements with colors */}
        <g className="vine-decorations">
          {flowers.map((flower, index) => {
            const baseOpacity = 0.25 + scrollProgress * 0.35;
            const scale = 1 + scrollProgress * 0.3;

            if (flower.type === 'leaf') {
              return (
                <ellipse
                  key={`decor-${index}`}
                  className={styles.vineLeaf}
                  cx={flower.cx}
                  cy={flower.cy}
                  rx={flower.r * 0.7}
                  ry={flower.r * 1.4}
                  fill={flower.color}
                  opacity={baseOpacity}
                  transform={`rotate(${index * 45} ${flower.cx} ${flower.cy}) scale(${scale})`}
                  style={{
                    transformOrigin: `${flower.cx}px ${flower.cy}px`,
                    transition: 'all 0.8s ease-out',
                  }}
                />
              );
            } else if (flower.type === 'bud') {
              return (
                <circle
                  key={`decor-${index}`}
                  className={styles.vineBud}
                  cx={flower.cx}
                  cy={flower.cy}
                  r={flower.r * scale}
                  fill={flower.color}
                  opacity={baseOpacity + 0.1}
                  style={{
                    filter: 'blur(0.3px)',
                    transition: 'all 0.8s ease-out',
                  }}
                />
              );
            } else {
              // Multi-colored flowers
              return (
                <g key={`flower-group-${index}`}>
                  <circle
                    className={styles.vineFlower}
                    cx={flower.cx}
                    cy={flower.cy}
                    r={flower.r}
                    fill={flower.color}
                    opacity={baseOpacity + 0.05}
                    style={{
                      filter: 'blur(0.4px)',
                      transform: `scale(${scale})`,
                      transformOrigin: `${flower.cx}px ${flower.cy}px`,
                      transition: 'all 0.8s ease-out',
                    }}
                  />
                  {/* Add a center for multi-petal flowers */}
                  {flower.petalCount && (
                    <circle
                      cx={flower.cx}
                      cy={flower.cy}
                      r={flower.r * 0.3}
                      fill="var(--accent-highlight)"
                      opacity={baseOpacity + 0.2}
                    />
                  )}
                </g>
              );
            }
          })}
        </g>
      </svg>
    </div>
  );
};

export default React.memo(BlogVinesBalanced);