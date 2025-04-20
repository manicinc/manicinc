// src/components/Skeletons/HomePageSkeleton.tsx
import styles from './HomePageSkeleton.module.css'; // We'll create this CSS Module next

const HomePageSkeleton = () => {
  // Determine how many hero items to show placeholders for (matching your slice(0, 3))
  const heroItemPlaceholders = Array.from({ length: 3 });

  return (
    <div className={styles.skeletonContainer} aria-busy="true" aria-live="polite">
      {/* --- Hero Section Skeleton --- */}
      <div className={styles.heroSectionSkeleton}>
        {heroItemPlaceholders.map((_, index) => (
          <div key={`hero-skel-${index}`} className={styles.skeletonCard}>
            <div className={`${styles.skeletonBox} ${styles.skeletonImage}`}></div>
            <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`}></div>
            <div className={`${styles.skeletonBox} ${styles.skeletonText}`}></div>
            <div className={`${styles.skeletonBox} ${styles.skeletonTextShort}`}></div>
            {/* Optional: Placeholder for tags/buttons */}
            <div className={styles.skeletonTagContainer}>
              <div className={`${styles.skeletonBox} ${styles.skeletonTag}`}></div>
              <div className={`${styles.skeletonBox} ${styles.skeletonTag}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Services Section Skeleton --- */}
      <div className={styles.sectionSkeleton}>
        <div className={`${styles.skeletonBox} ${styles.skeletonHeading}`}></div>
        <div className={styles.skeletonGrid}>
          <div className={`${styles.skeletonBox} ${styles.skeletonServiceItem}`}></div>
          <div className={`${styles.skeletonBox} ${styles.skeletonServiceItem}`}></div>
          <div className={`${styles.skeletonBox} ${styles.skeletonServiceItem}`}></div>
        </div>
      </div>

      {/* --- Intro Section Skeleton --- */}
      <div className={styles.sectionSkeleton}>
        <div className={`${styles.skeletonBox} ${styles.skeletonHeading}`}></div>
        <div className={`${styles.skeletonBox} ${styles.skeletonParagraph}`}></div>
        <div className={`${styles.skeletonBox} ${styles.skeletonParagraphShort}`}></div>
      </div>

      {/* Alice Theme Element (Optional but nice) - e.g., a subtle pattern */}
      {/* <div className={styles.alicePattern}></div> */}
    </div>
  );
};

export default HomePageSkeleton;