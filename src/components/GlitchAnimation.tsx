import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// --- Interfaces ---
// Basic style props
interface ElementStyleProps { opacity: number; animationDuration: number; className: string; }
// Dynamic spiral polylines
interface PathElement extends ElementStyleProps { points: string; strokeWidth: number; }
// Noise dots
interface NoiseDot extends ElementStyleProps { x: number; y: number; radius: number; }
// Floating text
interface TextElement extends ElementStyleProps { text: string; x: number; y: number; fontSize: number; rotation: number; }
// Falling objects
type FallingObjectType = 'rect' | 'circle' | 'shard' | 'line' | 'arc' | 'icon' | 'ring';
interface FallingObject extends ElementStyleProps { id: string; type: FallingObjectType; x: number; y: number; size: number; rotation: number; pathData?: string; strokeWidth?: number; }
// Main animation state
interface AnimationState {
    paths: PathElement[];           
    baseSpiral1_points: string;   
    baseSpiral2_points: string;   
    noise: NoiseDot[];
    textElements: TextElement[];
    fallingObjects: FallingObject[]; 
    spiralRotation: number;        
    currentRotationSpeedFactor: number; 
}
// Configuration structure
interface AnimationConfig {
    pathCountRange: [number, number]; pathOpacityRange: [number, number]; pathStrokeWidthRange: [number, number]; pathAnimationSpeedRange: [number, number];
    noiseCountRange: [number, number]; noiseOpacityRange: [number, number]; noiseAnimationSpeedRange: [number, number];
    textCountRange: [number, number]; textOpacityRange: [number, number]; textAnimationSpeedRange: [number, number]; textRotationRange: [number, number];
    objectCountRange: [number, number]; objectOpacityRange: [number, number]; objectAnimationSpeedRange: [number, number]; objectRotationSpeedRange: [number, number]; objectSizeRange: [number, number];
    spiralRotationSpeedFactor: [number, number]; 
    regenerateInterval: number;
    applyGlitchEffect: boolean; applyBackgroundFilter: boolean;
    backgroundPulseOpacity: number;
}
interface GlitchAnimationProps { 
    width?: string; 
    height?: string; 
    className?: string; 
    performanceMode?: 'high' | 'medium' | 'low';
}

// --- Constants ---
const TEXT_CONTENT = ['FOLLOW', 'RABBIT', 'HOLE', 'DOWN', 'DEEPER', '???', '...', 'TIME', 'LOST', 'FALLING', 'ENDLESS', 'VOID', 'WONDERLAND', '404', 'GLITCH', 'SURREAL', 'WILD', 'MANIC', 'SYSTEM', 'ERROR', 'REALITY', 'UNLOCK', 'MATRIX', '0xDEADBEEF', 'DATA_STREAM'];
const ICON_PATHS: Record<string, string> = { /* ... same as before ... */ };
const ICON_KEYS = Object.keys(ICON_PATHS);
const GRADIENT_CLASSES = ["stroke-grad-1", "stroke-grad-2", "stroke-grad-3", "stroke-grad-4"]; 

// --- Performance-optimized configurations ---
const LOW_PERFORMANCE_CONFIG: AnimationConfig = {
    pathCountRange: [3, 5], pathOpacityRange: [0.4, 0.7], pathStrokeWidthRange: [0.3, 0.8],
    pathAnimationSpeedRange: [20, 35], 
    noiseCountRange: [25, 40], noiseOpacityRange: [0.25, 0.5],
    noiseAnimationSpeedRange: [18, 30], 
    textCountRange: [2, 4], textOpacityRange: [0.5, 0.8], 
    textAnimationSpeedRange: [22, 40], 
    textRotationRange: [-15, 15],
    objectCountRange: [2, 4], objectOpacityRange: [0.3, 0.6], 
    objectAnimationSpeedRange: [20, 35], objectRotationSpeedRange: [25, 45], objectSizeRange: [1.8, 4.5],
    spiralRotationSpeedFactor: [0.2, 0.5], 
    regenerateInterval: 25000, // Slower regeneration (25s)
    applyGlitchEffect: false, applyBackgroundFilter: false, backgroundPulseOpacity: 0,
};

const MEDIUM_PERFORMANCE_CONFIG: AnimationConfig = {
    pathCountRange: [5, 8], pathOpacityRange: [0.4, 0.75], pathStrokeWidthRange: [0.3, 1.0],
    pathAnimationSpeedRange: [16, 30], 
    noiseCountRange: [50, 80], noiseOpacityRange: [0.25, 0.55],
    noiseAnimationSpeedRange: [15, 28], 
    textCountRange: [3, 6], textOpacityRange: [0.5, 0.85], 
    textAnimationSpeedRange: [20, 38], 
    textRotationRange: [-20, 20],
    objectCountRange: [3, 6], objectOpacityRange: [0.3, 0.65], 
    objectAnimationSpeedRange: [18, 35], objectRotationSpeedRange: [22, 45], objectSizeRange: [1.8, 4.8],
    spiralRotationSpeedFactor: [0.25, 0.6], 
    regenerateInterval: 18000, // Medium regeneration (18s)
    applyGlitchEffect: false, applyBackgroundFilter: false, backgroundPulseOpacity: 0,
};

const HIGH_PERFORMANCE_CONFIG: AnimationConfig = {
    pathCountRange: [8, 12], pathOpacityRange: [0.4, 0.75], pathStrokeWidthRange: [0.3, 1.0],
    pathAnimationSpeedRange: [14, 28], 
    noiseCountRange: [80, 120], noiseOpacityRange: [0.25, 0.55],
    noiseAnimationSpeedRange: [12, 25], 
    textCountRange: [4, 7], textOpacityRange: [0.5, 0.85], 
    textAnimationSpeedRange: [18, 35], 
    textRotationRange: [-20, 20],
    objectCountRange: [4, 8], objectOpacityRange: [0.3, 0.65], 
    objectAnimationSpeedRange: [16, 32], objectRotationSpeedRange: [20, 50], objectSizeRange: [1.8, 4.8],
    spiralRotationSpeedFactor: [0.3, 0.7], 
    regenerateInterval: 15000, // Relatively faster regeneration (15s)
    applyGlitchEffect: false, applyBackgroundFilter: false, backgroundPulseOpacity: 0,
};

// Optimized burst config
const BURST_CONFIG: AnimationConfig = {
    pathCountRange: [10, 18], pathOpacityRange: [0.7, 0.9], pathStrokeWidthRange: [0.6, 1.5],
    pathAnimationSpeedRange: [6, 12], // Slowed down
    noiseCountRange: [100, 180], noiseOpacityRange: [0.7, 0.9],
    noiseAnimationSpeedRange: [5, 10], // Slowed down
    textCountRange: [8, 12], textOpacityRange: [0.8, 0.95], 
    textAnimationSpeedRange: [6, 12], // Slowed down
    textRotationRange: [-90, 90], // Reduced rotation range
    objectCountRange: [10, 20], objectOpacityRange: [0.7, 0.9], 
    objectAnimationSpeedRange: [6, 12], objectRotationSpeedRange: [8, 15], objectSizeRange: [2.5, 5.5],
    spiralRotationSpeedFactor: [3.0, 5.0], // Slower rotation
    regenerateInterval: 2000, // Less frequent updates (2s)
    applyGlitchEffect: true, applyBackgroundFilter: true, 
    backgroundPulseOpacity: 0.5, // Reduced intensity
}; 

// --- Theme Variables ---
// Light theme colors
const LIGHT_THEME = {
    bgCenter: '#ffffff',
    bgMid: '#f8f9fb',
    bgOuter: '#f0f3f7',
    bgEdge: '#e8edf3',
    primaryColor: '#5a6ec0',
    secondaryColor: '#e86aa4',
    accentColor: '#00e0c0',
    accent2Color: '#ffab40',
    textColorPrimary: '#3a4a7a',
    textColorSecondary: '#904a6b',
    textStroke: 'rgba(255, 255, 255, 0.6)',
    rabbitFill: 'rgba(180, 190, 205, 0.4)',
    rabbitStroke: 'rgba(160, 170, 185, 0.6)',
    aliceFill: 'rgba(205, 180, 195, 0.35)',
    aliceOpacity: '0.55',
};

// Dark theme colors
const DARK_THEME = {
    bgCenter: '#2a1f3a',
    bgMid: '#1e152b',
    bgOuter: '#100a1c',
    bgEdge: '#04020a',
    primaryColor: '#c8b6f0',
    secondaryColor: '#58cff0',
    accentColor: '#ff5296',
    accent2Color: '#76ff03',
    textColorPrimary: 'rgba(200, 182, 240, 0.8)',
    textColorSecondary: 'rgba(88, 207, 240, 0.8)',
    textStroke: 'rgba(0, 0, 0, 0.7)',
    rabbitFill: 'rgba(210, 220, 250, 0.3)',
    rabbitStroke: 'rgba(230, 240, 255, 0.45)',
    aliceFill: 'rgba(210, 220, 250, 0.25)',
    aliceOpacity: '0.5',
};

// --- Helper Functions ---
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
const randomIntInRange = (min: number, max: number) => Math.floor(randomInRange(min, max + 1));
const generatePathObjData = (type: FallingObjectType, size: number): string | undefined => { 
    if (type === 'shard') { return `M${size},0 L${size * 0.5},${size} L0,${size * 0.5} Z`; } 
    return undefined; 
};

// Optimized spiral point generation
const generateSpiralPoints = (centerX: number, centerY: number, spins: number, pointCount: number, currentRotationDegrees: number, maxRadius = 48, startRadius = 2, rotationOffsetDeg = 0): string => {
    // Generate fewer points for better performance
    const actualPointCount = Math.min(pointCount, 120); // Cap point count
    
    let points = ''; 
    const a = (maxRadius - startRadius) / (spins * Math.PI * 2); 
    const currentRotationRad = (currentRotationDegrees + rotationOffsetDeg) * (Math.PI / 180);
    
    if (actualPointCount <= 0 || isNaN(a) || isNaN(currentRotationRad)) return "";
    
    // Skip points for optimization
    const skipFactor = Math.ceil(actualPointCount / 50); // Always generate around 50 points maximum
    
    for (let i = 0; i < actualPointCount; i += skipFactor) {
        const t = (i / (actualPointCount <= 1 ? 1 : actualPointCount - 1)) * spins * Math.PI * 2;
        const radius = Math.min(startRadius + a * t, maxRadius);
        const angle = t + currentRotationRad;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points += `${x.toFixed(1)},${y.toFixed(1)} `; // Lower precision (1 decimal instead of 2)
    }
    
    return points.trim();
}; 

// --- Component ---
const GlitchAnimation: React.FC<GlitchAnimationProps> = ({
    width = '100%',
    height = '500px',
    className = '',
    performanceMode = 'medium'
}) => {
    // Theme state
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [themeVars, setThemeVars] = useState(LIGHT_THEME);
    
    // Get appropriate config based on performance mode
    const getConfigForPerformanceMode = useCallback((mode: 'high' | 'medium' | 'low'): AnimationConfig => {
        switch(mode) {
            case 'high': return HIGH_PERFORMANCE_CONFIG;
            case 'low': return LOW_PERFORMANCE_CONFIG;
            case 'medium':
            default: return MEDIUM_PERFORMANCE_CONFIG;
        }
    }, []);

    // Initial empty state
    const initialState: AnimationState = {
        paths: [], baseSpiral1_points: "", baseSpiral2_points: "", 
        noise: [], textElements: [], fallingObjects: [], 
        spiralRotation: 0, currentRotationSpeedFactor: 0.5
    };

    // Animation state
    const [animationState, setAnimationState] = useState<AnimationState>(initialState);
    const [isChaosBurstActive, setIsChaosBurstActive] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<AnimationConfig>(getConfigForPerformanceMode(performanceMode));
    
    const baseConfigRef = useRef<AnimationConfig>(getConfigForPerformanceMode(performanceMode));
    const burstConfigRef = useRef<AnimationConfig>(BURST_CONFIG);
    const reducedMotionRef = useRef<boolean>(false);
    const animationFrameRef = useRef<number>();
    const lastRegenerateTimeRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Visibility-based pause using IntersectionObserver
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            const e = entries[0];
            setIsVisible(!!e?.isIntersecting);
        }, { rootMargin: '100px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Auto performance scaling for low-memory/slow connection/small viewports
    useEffect(() => {
        if (performanceMode === 'high') return; // honor explicit high
        const mem = (navigator as any).deviceMemory || 4;
        const conn: string = (navigator as any).connection?.effectiveType || '4g';
        const smallViewport = typeof window !== 'undefined' && window.innerWidth < 768;
        if (reducedMotionRef.current || mem <= 4 || conn !== '4g' || smallViewport) {
            baseConfigRef.current = LOW_PERFORMANCE_CONFIG;
            setCurrentConfig(LOW_PERFORMANCE_CONFIG);
        }
    }, [performanceMode]);

    // Theme detection and monitoring
    useEffect(() => {
        // Initial theme detection based on HTML element class
        const detectTheme = () => {
            const htmlElement = document.documentElement;
            const isDarkMode = htmlElement.classList.contains('dark');
            const isLightMode = htmlElement.classList.contains('light');
            
            // Default to system preference if no explicit class is set
            if (!isDarkMode && !isLightMode) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? 'dark' : 'light');
                setThemeVars(prefersDark ? DARK_THEME : LIGHT_THEME);
                return;
            }
            
            // Use explicitly set theme
            if (isDarkMode) {
                setTheme('dark');
                setThemeVars(DARK_THEME);
            } else {
                setTheme('light');
                setThemeVars(LIGHT_THEME);
            }
        };

        // Detect initial theme
        detectTheme();

        // Set up mutation observer to detect theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    detectTheme();
                }
            });
        });

        // Start observing the HTML element for class changes
        observer.observe(document.documentElement, { attributes: true });

        // Clean up observer on component unmount
        return () => observer.disconnect();
    }, []);

    // Set initial config based on performance mode
    useEffect(() => {
        const config = getConfigForPerformanceMode(performanceMode);
        baseConfigRef.current = config;
        setCurrentConfig(config);
    }, [performanceMode, getConfigForPerformanceMode]);

    // Reduced Motion Check
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionRef.current = mediaQuery.matches;
        
        const handleReducedMotionChange = (e: MediaQueryListEvent) => {
            reducedMotionRef.current = e.matches;
            if (e.matches) {
                // Set minimal animation config when reduced motion is enabled
                setCurrentConfig({
                    ...LOW_PERFORMANCE_CONFIG,
                    spiralRotationSpeedFactor: [0, 0], // No rotation
                    regenerateInterval: 60000, // Very infrequent updates
                });
            } else {
                setCurrentConfig(baseConfigRef.current);
            }
        };

        mediaQuery.addEventListener('change', handleReducedMotionChange);
        return () => mediaQuery.removeEventListener('change', handleReducedMotionChange);
    }, []);

    // Chaos Burst Timer - with reduced frequency and throttling
    useEffect(() => {
        if (reducedMotionRef.current) return;
        
        let burstTimer: NodeJS.Timeout | null = null; 
        let intervalTimer: NodeJS.Timeout | null = null;
        
        const getWeightedDelay = (min: number, max: number, skew: number = 3) => 
            min + Math.pow(Math.random(), skew) * (max - min);
        
        const scheduleNextBurst = () => {
            // Longer delay between bursts
            const delay = getWeightedDelay(6000, 20000, 3); 
            
            intervalTimer = setTimeout(() => {
                setIsChaosBurstActive(true);
                
                // Shorter burst duration
                burstTimer = setTimeout(() => {
                    setIsChaosBurstActive(false);
                    scheduleNextBurst();
                }, randomInRange(2000, 3000));
            }, delay);
        };
        
        scheduleNextBurst(); 
        
        return () => { 
            if (burstTimer) clearTimeout(burstTimer); 
            if (intervalTimer) clearTimeout(intervalTimer); 
        };
    }, []);

    // Update currentConfig based on burst state
    useEffect(() => {
        if (!reducedMotionRef.current) {
            setCurrentConfig(isChaosBurstActive ? burstConfigRef.current : baseConfigRef.current);
        }
    }, [isChaosBurstActive]);

    // Optimized Animation Loop with RAF throttling
    useEffect(() => {
        let lastTime = performance.now();
        let targetSpeedFactor = animationState.currentRotationSpeedFactor;
        let frameCount = 0;
        
        const animate = (time: number) => {
            if (reducedMotionRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            
            // Throttle updates based on performance mode
            frameCount++;
            const skipFrames = performanceMode === 'low' ? 3 : (performanceMode === 'medium' ? 2 : 1);
            if (frameCount % skipFrames !== 0) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            
            const deltaTime = time - lastTime; 
            lastTime = time; 
            const deltaSeconds = deltaTime / 1000;

            setAnimationState(prev => {
                // Dynamic Speed Calculation with less frequent updates
                const [minSpeed, maxSpeed] = currentConfig.spiralRotationSpeedFactor;
                
                // Only update speed randomly 1% of the time
                if (Math.random() < 0.01) {
                    targetSpeedFactor = randomInRange(minSpeed, maxSpeed);
                }
                
                // Smoother transition
                const speedChange = (targetSpeedFactor - prev.currentRotationSpeedFactor) * 0.02;
                let nextSpeedFactor = prev.currentRotationSpeedFactor + speedChange;
                nextSpeedFactor = Math.max(minSpeed, Math.min(maxSpeed, nextSpeedFactor));
                
                // Calculate rotation
                const rotationIncrement = (nextSpeedFactor * deltaSeconds * 60);
                const nextSpiralRotation = (prev.spiralRotation + rotationIncrement) % 360;

                return {
                    ...prev,
                    spiralRotation: nextSpiralRotation,
                    currentRotationSpeedFactor: nextSpeedFactor
                };
            });
            
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animationFrameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [currentConfig, performanceMode]);

    // Element Regeneration Logic with throttling
    const generateElements = useCallback(() => {
        const config = currentConfig;
        const now = performance.now();
        
        // Throttle regeneration
        if (now - lastRegenerateTimeRef.current < config.regenerateInterval) {
            return;
        }
        
        lastRegenerateTimeRef.current = now;

        setAnimationState(prevState => {
            const { spiralRotation: currentRotation, fallingObjects: prevFallingObjects } = prevState;

            // Generate base spirals
            const baseSpiral1_points = generateSpiralPoints(50, 50, 4, 80, currentRotation, 52, 1.5, 0);
            const baseSpiral2_points = generateSpiralPoints(50, 50, 3.5, 70, currentRotation, 48, 2.5, 20);

            // Generate Dynamic Paths
            const paths: PathElement[] = [];
            const numPaths = randomIntInRange(config.pathCountRange[0], config.pathCountRange[1]);
            
            for (let i = 0; i < numPaths; i++) {
                const gradientClass = GRADIENT_CLASSES[i % GRADIENT_CLASSES.length]; // Deterministic selection
                const points = generateSpiralPoints(
                    50 + (i % 2 ? 1 : -1), 
                    50 + (i % 3 ? 1 : -1),
                    randomInRange(1.0, 6.0),
                    Math.min(100, 50 + i * 5),
                    currentRotation
                );
                
                paths.push({
                    points,
                    opacity: randomInRange(config.pathOpacityRange[0], config.pathOpacityRange[1]),
                    animationDuration: randomInRange(config.pathAnimationSpeedRange[0], config.pathAnimationSpeedRange[1]),
                    strokeWidth: randomInRange(config.pathStrokeWidthRange[0], config.pathStrokeWidthRange[1]),
                    className: gradientClass
                });
            }
            
            // Generate Noise
            const noise: NoiseDot[] = [];
            const numNoise = randomIntInRange(config.noiseCountRange[0], config.noiseCountRange[1]);
            
            for (let i = 0; i < numNoise; i++) {
                const classIndex = i % 4; // Deterministic class assignment
                const className = classIndex === 0 ? 'element-primary' : 
                                  classIndex === 1 ? 'element-secondary' : 
                                  classIndex === 2 ? 'element-accent' : 'element-accent2';
                
                noise.push({
                    x: randomInRange(-10, 110),
                    y: randomInRange(-10, 110),
                    radius: randomInRange(0.1, 0.6),
                    opacity: randomInRange(config.noiseOpacityRange[0], config.noiseOpacityRange[1]),
                    animationDuration: randomInRange(config.noiseAnimationSpeedRange[0], config.noiseAnimationSpeedRange[1]),
                    className
                });
            }
            
            // Generate Texts
            const textElements: TextElement[] = [];
            const numTexts = randomIntInRange(config.textCountRange[0], config.textCountRange[1]);
            
            for (let i = 0; i < numTexts; i++) {
                const angleDelta = (Math.PI * 2) / numTexts;
                const angle = i * angleDelta + randomInRange(-0.2, 0.2);
                const distanceFromCenter = randomInRange(20, 55);
                
                textElements.push({
                    text: TEXT_CONTENT[(i + currentRotation) % TEXT_CONTENT.length],
                    x: 50 + Math.cos(angle) * distanceFromCenter,
                    y: 50 + Math.sin(angle) * distanceFromCenter,
                    fontSize: randomInRange(5.0, 9.0),
                    opacity: randomInRange(config.textOpacityRange[0], config.textOpacityRange[1]),
                    animationDuration: randomInRange(config.textAnimationSpeedRange[0], config.textAnimationSpeedRange[1]),
                    rotation: randomInRange(config.textRotationRange[0], config.textRotationRange[1]),
                    className: i % 2 === 0 ? 'element-primary' : 'element-secondary'
                });
            }
            
            // Generate Falling Objects
            const fallingObjects: FallingObject[] = [];
            const numObjects = randomIntInRange(config.objectCountRange[0], config.objectCountRange[1]);
            const objectTypes: FallingObjectType[] = ['rect', 'circle', 'shard', 'line', 'arc', 'icon', 'ring'];
            
            for (let i = 0; i < numObjects; i++) {
                const typeIndex = i % objectTypes.length;
                const type = objectTypes[typeIndex];
                const size = randomInRange(config.objectSizeRange[0], config.objectSizeRange[1]);
                const classIndex = i % 4;
                const className = classIndex === 0 ? 'element-primary' : 
                                  classIndex === 1 ? 'element-secondary' : 
                                  classIndex === 2 ? 'element-accent' : 'element-accent2';
                
                fallingObjects.push({
                    id: `obj-${Date.now() % 10000}-${i}`,
                    type,
                    x: randomInRange(10, 90),
                    y: randomInRange(-30, -15),
                    size,
                    pathData: generatePathObjData(type, size),
                    rotation: randomInRange(-60, 60),
                    opacity: randomInRange(config.objectOpacityRange[0], config.objectOpacityRange[1]),
                    animationDuration: randomInRange(config.objectAnimationSpeedRange[0], config.objectAnimationSpeedRange[1]),
                    strokeWidth: type === 'line' || type === 'arc' || type === 'icon' || type === 'ring' ? randomInRange(0.35, 0.8) : undefined,
                    className
                });
            }

            // Manage number of falling objects
            const nextFallingObjects = isChaosBurstActive 
                ? [...prevFallingObjects, ...fallingObjects].slice(-50) // Hard limit
                : fallingObjects;

            return {
                ...prevState,
                paths,
                noise,
                textElements,
                fallingObjects: nextFallingObjects,
                baseSpiral1_points,
                baseSpiral2_points
            };
        });
    }, [currentConfig, isChaosBurstActive]);

    // Regeneration timer
    useEffect(() => {
        if (reducedMotionRef.current) return;
        
        // Initial generation
        generateElements();
        
        // Use RAF for smoother timing
        let lastTime = performance.now();
        let timeSinceLastRegeneration = 0;
        
        const checkRegenerationInterval = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            
            timeSinceLastRegeneration += deltaTime;
            
            if (timeSinceLastRegeneration >= currentConfig.regenerateInterval) {
                generateElements();
                timeSinceLastRegeneration = 0;
            }
            
            regenerationFrameRef.current = requestAnimationFrame(checkRegenerationInterval);
        };
        
        const regenerationFrameRef = { current: requestAnimationFrame(checkRegenerationInterval) };
        
        return () => {
            if (regenerationFrameRef.current) {
                cancelAnimationFrame(regenerationFrameRef.current);
            }
        };
    }, [currentConfig.regenerateInterval, generateElements]);

    // Regenerate elements when theme changes
    useEffect(() => {
        // Force regeneration of elements when theme changes
        lastRegenerateTimeRef.current = 0;
        generateElements();
    }, [theme, generateElements]);

    // --- Optimized Render Methods ---
    // Memoized paths
    const memoizedPaths = useMemo(() => animationState.paths.map((pathProps, index) => {
        const { points, strokeWidth, className, opacity, animationDuration } = pathProps;
        return (
            <polyline 
                key={`path-${index}`} 
                points={points} 
                strokeWidth={strokeWidth} 
                className={className} 
                opacity={opacity} 
                fill="none" 
                filter={performanceMode !== 'low' ? "url(#elementGlow)" : undefined}
                strokeLinecap="round" 
                style={{ 
                    animation: `warpPath ${animationDuration}s infinite alternate ease-in-out`, 
                    ['--element-opacity' as string]: opacity 
                }} 
            />
        );
    }), [animationState.paths, performanceMode]);

    // Memoized noise dots with performance optimization
    const memoizedNoise = useMemo(() => {
        const renderCount = performanceMode === 'low' 
            ? Math.min(30, animationState.noise.length)
            : performanceMode === 'medium'
                ? Math.min(60, animationState.noise.length)
                : animationState.noise.length;
        
        return animationState.noise.slice(0, renderCount).map((dotProps, index) => {
            const { x, y, radius, className, opacity, animationDuration } = dotProps;
            return (
                <circle 
                    key={`noise-${index}`} 
                    cx={x} 
                    cy={y} 
                    r={radius} 
                    className={className} 
                    fillOpacity={opacity} 
                    style={{ 
                        animation: `pulseNoise ${animationDuration}s infinite alternate ease-in-out`, 
                        ['--element-opacity' as string]: opacity 
                    }} 
                />
            );
        });
    }, [animationState.noise, performanceMode]);

    // Memoized text elements
    const memoizedTexts = useMemo(() => animationState.textElements.map((textProps, index) => {
        const { text, x, y, fontSize, rotation, className, opacity, animationDuration } = textProps;
        return (
            <text 
                key={`text-${index}`} 
                x={x} 
                y={y} 
                fontSize={fontSize} 
                className={className} 
                opacity={opacity} 
                filter={performanceMode !== 'low' ? "url(#elementGlow)" : undefined}
                style={{ 
                    animation: `textFadeWarp ${animationDuration}s infinite alternate ease-in-out`, 
                    transform: `rotate(${rotation}deg)`, 
                    transformOrigin: `${x}px ${y}px`, 
                    ['--element-opacity' as string]: opacity 
                }} 
                fontFamily="'Roboto Mono', monospace" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                strokeWidth="0.1" 
                stroke="var(--text-stroke)" 
                paintOrder="stroke"
            >
                {text}
            </text>
        );
    }), [animationState.textElements, performanceMode]);

    // Memoized falling objects
    const memoizedFallingObjects = useMemo(() => {
        const renderCount = performanceMode === 'low' 
            ? Math.min(10, animationState.fallingObjects.length)
            : performanceMode === 'medium'
                ? Math.min(25, animationState.fallingObjects.length)
                : animationState.fallingObjects.length;
        
        return animationState.fallingObjects.slice(0, renderCount).map((objProps, index) => {
            const { id, x, y, rotation, size, type, pathData, animationDuration, strokeWidth, className, opacity } = objProps;
            
            // Simplified styles with conditional tumble animation based on performance mode
            const commonStyle = { 
                transform: `translate(${x}px, ${y}px)`, 
                animation: `objectFall ${animationDuration}s linear infinite${performanceMode !== 'low' ? `, objectTumble ${randomInRange(currentConfig.objectRotationSpeedRange[0], currentConfig.objectRotationSpeedRange[1])}s linear infinite` : ''}`, 
                ['--element-opacity' as string]: opacity
            };
            
            const rotationStyle = { 
                transform: `rotate(${rotation}deg)`, 
                transformOrigin: 'center center' 
            };
            
            const elementProps = { 
                className, 
                opacity, 
                filter: performanceMode !== 'low' ? "url(#elementGlow)" : undefined
            };
            
            // Simplified element rendering
            if (type === 'rect') {
                return (
                    <rect 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={{ ...commonStyle, ...rotationStyle }} 
                        width={size} 
                        height={size * 1.2} 
                    />
                );
            }
            
            if (type === 'circle') {
                return (
                    <circle 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={{ ...commonStyle, ...rotationStyle }} 
                        r={size * 0.5} 
                    />
                );
            }
            
            if (type === 'shard' && pathData) {
                return (
                    <path 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={{ ...commonStyle, ...rotationStyle }} 
                        d={pathData} 
                    />
                );
            }
            
            if (type === 'line') {
                return (
                    <line 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={commonStyle} 
                        strokeWidth={strokeWidth ?? 0.3} 
                        x1={-size/1.5} 
                        y1={0} 
                        x2={size/1.5} 
                        y2={0} 
                        transform={`rotate(${rotation})`} 
                    />
                );
            }
            
            if (type === 'arc') {
                const r = size;
                const d = `M ${-r},0 A ${r},${r} 0 0 1 ${r},0`;
                
                return (
                    <path 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={{ ...commonStyle, ...rotationStyle }} 
                        d={d} 
                        fill="none" 
                        strokeWidth={strokeWidth ?? 0.3} 
                    />
                );
            }
            
            if (type === 'ring') {
                return (
                    <circle 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={{ ...commonStyle, ...rotationStyle }} 
                        r={size * 0.6} 
                        fill="none" 
                        strokeWidth={strokeWidth ?? 0.3} 
                    />
                );
            }
            
            if (type === 'icon') {
                // Simple default icon
                const iconPath = "M0,0 L5,5 L0,10 L-5,5 Z";
                
                return (
                    <path 
                        key={`obj-${index}`} 
                        {...elementProps} 
                        style={{ 
                            ...commonStyle, 
                            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${size * 0.4})` 
                        }} 
                        d={pathData || iconPath} 
                        strokeWidth={strokeWidth ?? 0.3} 
                        fill="none"
                    />
                );
            }
            
            return null;
        });
    }, [animationState.fallingObjects, currentConfig.objectRotationSpeedRange, performanceMode]);

    // --- Render ---
    return (
        <div 
            ref={containerRef}
            className={`glitch-animation-container ${!isVisible ? 'paused' : ''} ${className}`} 
            style={{ 
                width, 
                height, 
                position: 'relative', 
                overflow: 'hidden', 
                background: 'var(--bg-edge)' 
            }}
            data-theme={theme} // Add data attribute for explicit theme
        >
            <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="xMidYMid slice" 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    display: 'block', 
                    background: 'var(--bg-edge)' 
                }}
            >
                <defs>
                    {/* Simplified gradient */}
                    <radialGradient id="vortexGradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="var(--bg-center)" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="var(--bg-outer)" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="var(--bg-edge)" stopOpacity="1" />
                    </radialGradient>

                    {/* Simplified linear gradients for strokes */}
                    <linearGradient id="grad1" gradientTransform="rotate(45)">
                        <stop offset="0%" stopColor="var(--accent-color)" />
                        <stop offset="100%" stopColor="var(--primary-color)" />
                    </linearGradient>
                    <linearGradient id="grad2" gradientTransform="rotate(135)">
                        <stop offset="0%" stopColor="var(--secondary-color)" />
                        <stop offset="100%" stopColor="var(--accent2-color)" />
                    </linearGradient>
                    <linearGradient id="grad3" gradientTransform="rotate(225)">
                        <stop offset="0%" stopColor="var(--accent2-color)" />
                        <stop offset="100%" stopColor="var(--secondary-color)" />
                    </linearGradient>
                    <linearGradient id="grad4" gradientTransform="rotate(315)">
                        <stop offset="0%" stopColor="var(--primary-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>

                    {/* Optimized glow filter - only used for medium and high performance */}
                    {performanceMode !== 'low' && (
                        <filter id="elementGlow" x="-120%" y="-120%" width="340%" height="340%">
                            <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
                            <feComponentTransfer in="coloredBlur" result="adjustedBlur">
                                <feFuncA type="linear" slope="0.6" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode in="adjustedBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    )}

                    {/* Simplified background filter - only used during burst */}
                    {currentConfig.applyBackgroundFilter && (
                        <filter id="backgroundBurstFilter" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
                            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8" result="sharperNoise"/>
                            <feComposite in="SourceGraphic" in2="sharperNoise" operator="in" result="maskedBase"/>
                            <feColorMatrix in="SourceGraphic" type="hueRotate" values={(animationState.spiralRotation % 360).toString()} result="hueShifted"/>
                            <feBlend in="maskedBase" in2="hueShifted" mode="color-dodge"/>
                        </filter>
                    )}

                    {/* Simplified glitch filter - only used during burst */}
                    {currentConfig.applyGlitchEffect && (
                        <filter id="creativeGlitch" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" result="noise1" />
                            <feDisplacementMap in="SourceGraphic" in2="noise1" scale="5.0" xChannelSelector="R" yChannelSelector="G" result="displaced1" />
                            <feGaussianBlur in="displaced1" stdDeviation="0.5" />
                        </filter>
                    )}
                </defs>

                {/* Background - Conditionally apply burst filter */}
                <rect 
                    width="100%" 
                    height="100%" 
                    fill="url(#vortexGradient)"
                    filter={currentConfig.applyBackgroundFilter ? "url(#backgroundBurstFilter)" : ""}
                />

                {/* Burst Background Pulse Overlay */}
                {isChaosBurstActive && currentConfig.backgroundPulseOpacity > 0 && (
                    <rect 
                        width="100%" 
                        height="100%" 
                        fill="var(--accent2-color)" 
                        style={{ 
                            opacity: currentConfig.backgroundPulseOpacity,
                            mixBlendMode: 'screen',
                            pointerEvents: 'none'
                        }} 
                    />
                )}

                {/* Main Content Group - Rotates with conditional glitch effect */}
                <g 
                    transform={`rotate(${animationState.spiralRotation} 50 50)`}
                    filter={currentConfig.applyGlitchEffect ? "url(#creativeGlitch)" : ""}
                >
                    {/* Base Spirals */}
                    {animationState.baseSpiral1_points && (
                        <polyline 
                            points={animationState.baseSpiral1_points} 
                            className="stroke-grad-1" 
                            strokeWidth="0.35" 
                            fill="none" 
                            strokeLinecap="round" 
                            opacity="0.7" 
                            style={{ animation: `warpPath 25s infinite alternate ease-in-out` }} 
                        />
                    )}
                    
                    {animationState.baseSpiral2_points && (
                        <polyline 
                            points={animationState.baseSpiral2_points} 
                            className="stroke-grad-3" 
                            strokeWidth="0.25" 
                            fill="none" 
                            strokeLinecap="round" 
                            opacity="0.6" 
                            style={{ animation: `warpPath 35s infinite alternate-reverse ease-in-out` }} 
                        />
                    )}

                    {/* Dynamic Elements */}
                    {memoizedPaths}
                    {memoizedNoise}
                    {memoizedTexts}
                    <g>{memoizedFallingObjects}</g>

                    {/* Rabbit */}
                    <g transform="translate(50 45) scale(0.85)">
                        <path 
                            d="M 0 -15 C -5 -15 -5 -5 -3 -5 Q -1 -15 1 -15 Q 3 -5 5 -5 C 5 -15 5 -15 0 -15 Z M -4 -14 Q -6 -20 -5 -28 L -3 -28 Q -2 -20 -2 -14 Z M 4 -14 Q 6 -20 5 -28 L 3 -28 Q 2 -20 2 -14 Z M -6 0 Q -6 10 0 12 Q 6 10 6 0 Z"
                            fill="var(--rabbit-fill)" 
                            stroke="var(--rabbit-stroke)" 
                            strokeWidth="0.3" 
                            filter={performanceMode !== 'low' ? "url(#elementGlow)" : undefined}
                            style={{
                                animation: isChaosBurstActive
                                    ? `rabbitGlitchBurst 0.2s infinite steps(4, jump-end)` 
                                    : `subtleDrift 25s infinite alternate ease-in-out`,
                                opacity: isChaosBurstActive ? 1.0 : 0.9
                            }}
                        />
                    </g>

                    {/* Alice */}
                    <path 
                        d="M 49 70 Q 50 68 51 70 L 47 75 C 46 80, 45 88, 48 92 L 52 92 C 55 88, 54 80, 53 75 Z" 
                        fill="var(--alice-fill)" 
                        opacity="var(--alice-opacity, 0.45)" 
                        filter={performanceMode !== 'low' ? "url(#elementGlow)" : undefined}
                        style={{ 
                            animation: 'aliceFall 30s infinite linear',
                            transformOrigin: '50px 80px'
                        }} 
                    />
                </g>
            </svg>

            {/* --- CSS with Theme Variables --- */}
            <style jsx global>{`
                /* Theme-aware variables - uses CSS variables with raw values from current theme */
                .glitch-animation-container {
                    /* Base theme variables - dynamically set based on theme */
                    --bg-center: ${themeVars.bgCenter};
                    --bg-mid: ${themeVars.bgMid};
                    --bg-outer: ${themeVars.bgOuter};
                    --bg-edge: ${themeVars.bgEdge};
                    --primary-color: ${themeVars.primaryColor};
                    --secondary-color: ${themeVars.secondaryColor};
                    --accent-color: ${themeVars.accentColor};
                    --accent2-color: ${themeVars.accent2Color};
                    --text-color-primary: ${themeVars.textColorPrimary};
                    --text-color-secondary: ${themeVars.textColorSecondary};
                    --text-stroke: ${themeVars.textStroke};
                    --rabbit-fill: ${themeVars.rabbitFill};
                    --rabbit-stroke: ${themeVars.rabbitStroke};
                    --alice-fill: ${themeVars.aliceFill};
                    --alice-opacity: ${themeVars.aliceOpacity};
                    
                    /* Derived variables based on theme values */
                    --element-stroke-primary: var(--primary-color);
                    --element-stroke-secondary: var(--secondary-color);
                    --element-fill-primary: ${theme === 'light' ? 'rgba(90, 110, 192, 0.4)' : 'rgba(200, 182, 240, 0.35)'};
                    --element-fill-secondary: ${theme === 'light' ? 'rgba(232, 106, 164, 0.4)' : 'rgba(88, 207, 240, 0.35)'};
                    --element-fill-accent: ${theme === 'light' ? 'rgba(0, 224, 192, 0.45)' : 'rgba(255, 82, 150, 0.5)'};
                    --element-fill-accent2: ${theme === 'light' ? 'rgba(255, 171, 64, 0.45)' : 'rgba(118, 255, 3, 0.5)'};
                    --element-stroke-accent: var(--accent-color);
                    --element-stroke-accent2: var(--accent2-color);
                    
                    /* Performance: isolate the container */
                    contain: layout paint style;
                    content-visibility: auto;
                    contain-intrinsic-size: 500px 500px;
                    will-change: transform;
                    backface-visibility: hidden;
                    
                    /* Add transition for smooth theme changes */
                    transition: background-color 0.3s ease;
                }

                /* Pause all animations when offscreen */
                .glitch-animation-container.paused * {
                    animation-play-state: paused !important;
                }

                /* Element Classes */
                .element-primary { stroke: var(--element-stroke-primary); fill: var(--element-fill-primary); }
                .element-secondary { stroke: var(--element-stroke-secondary); fill: var(--element-fill-secondary); }
                .element-accent { stroke: var(--element-stroke-accent); fill: var(--element-fill-accent); }
                .element-accent2 { stroke: var(--element-stroke-accent2); fill: var(--element-fill-accent2); }
                
                /* Gradient Strokes */
                .stroke-grad-1 { stroke: url(#grad1); } 
                .stroke-grad-2 { stroke: url(#grad2); } 
                .stroke-grad-3 { stroke: url(#grad3); } 
                .stroke-grad-4 { stroke: url(#grad4); }
                
                /* Prevent text selection */
                .glitch-animation-container text { 
                    user-select: none; 
                    -webkit-user-select: none; 
                }

                /* Optimized Animations */
                @keyframes warpPath {
                    0% { transform: translate(0px, 0px) scale(1); opacity: var(--element-opacity, 0.6); }
                    50% { transform: translate(-0.2px, 0.3px) scale(0.97); opacity: calc(var(--element-opacity, 0.6) * 1.3); }
                    100% { transform: translate(0px, 0px) scale(1); opacity: var(--element-opacity, 0.6); }
                }
                
                @keyframes pulseNoise {
                    0% { opacity: var(--element-opacity, 0.5); transform: scale(0.9); }
                    100% { opacity: calc(var(--element-opacity, 0.5) * 1.4); transform: scale(1.1); }
                }
                
                @keyframes textFadeWarp {
                    0% { opacity: var(--element-opacity, 0.7); transform: skewX(-0.3deg) scale(0.95); }
                    100% { opacity: calc(var(--element-opacity, 0.7) * 1.3); transform: skewX(0.3deg) scale(1.05); }
                }
                
                @keyframes subtleDrift {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(0.5px, -0.3px); }
                }
                
                @keyframes aliceFall {
                    0% { transform: translateY(-5px); opacity: 0; }
                    15% { opacity: var(--alice-opacity); }
                    85% { opacity: var(--alice-opacity); }
                    100% { transform: translateY(9.5px); opacity: 0; }
                }
                
                @keyframes objectFall {
                    from { transform: translateY(-25px); opacity: var(--element-opacity); }
                    to { transform: translateY(125px); opacity: 0; }
                }
                
                @keyframes objectTumble {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes rabbitGlitchBurst {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(0.5px, -0.5px); }
                    50% { transform: translate(-0.5px, 0.5px); }
                    75% { transform: translate(-0.5px, -0.5px); }
                    100% { transform: translate(0, 0); }
                }
            `}</style>
        </div>
    );
};

export default GlitchAnimation; 