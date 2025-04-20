// src/components/GiscusComments.tsx
'use client';

import Giscus from '@giscus/react';
// Adjust the import path based on where you created constants.ts
import { GISCUS_CONFIG } from '@/lib/constants';

export default function GiscusComments() {

    // Basic check (optional)
    if (!GISCUS_CONFIG.REPO || !GISCUS_CONFIG.REPO_ID || !GISCUS_CONFIG.CATEGORY || !GISCUS_CONFIG.CATEGORY_ID) {
         console.error("Giscus constants configuration values are missing.");
         return <p>Error loading comments: Configuration missing.</p>;
     }

    return (
        <div className="giscus-container mt-12">
            <Giscus
                id="comments"
                repo={GISCUS_CONFIG.REPO}           // Use imported constant
                repoId={GISCUS_CONFIG.REPO_ID}       // Use imported constant
                category={GISCUS_CONFIG.CATEGORY}     // Use imported constant
                categoryId={GISCUS_CONFIG.CATEGORY_ID} // Use imported constant
                mapping={GISCUS_CONFIG.MAPPING}
                strict={GISCUS_CONFIG.STRICT}
                reactionsEnabled={GISCUS_CONFIG.REACTIONS}
                emitMetadata={GISCUS_CONFIG.EMIT_METADATA}
                inputPosition={GISCUS_CONFIG.INPUT_POSITION}
                theme={GISCUS_CONFIG.THEME}
                lang={GISCUS_CONFIG.LANG}
                loading={GISCUS_CONFIG.LOADING}
            />
        </div>
    );
}