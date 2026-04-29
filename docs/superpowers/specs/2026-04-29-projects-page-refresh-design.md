# Projects Page Refresh — Design Spec

**Date**: 2026-04-29
**Owner**: johnn
**Status**: Approved (proceeding to implementation plan)

## Goal

Refresh the manicinc.com projects surface around four flagship Manic Agency projects, with the homepage hero showing wilds-ai → paracosm → agentos as the top three featured items. Reposition wunderland.sh as the open-source OpenClaw fork (an autonomous AI agent framework), preserve the existing wunderland-sol Solana hackathon page at a new slug, drop domainhq from the featured set, take fresh live screenshots, write SEO-optimized authoritative copy with deep-research citations, and fix the mobile hamburger menu alignment.

## Non-goals

- No site redesign, theme overhaul, or animation rework
- No new project pages beyond the four named (agentos, paracosm, wunderland.sh, wilds-ai) plus the wunderland-sol preservation page
- No backend or data-pipeline changes
- No changes to blog post structure
- No SEO migration plumbing (redirects); the existing `/projects/ai/wunderland` slug is reused for the new content with no URL change

## Source of truth references

- Manicinc repo: `/Users/johnn/Documents/git/manicinc/`
- Featured-ordering logic: `/Users/johnn/Documents/git/manicinc/src/app/page.tsx` lines 121-182 (date-desc sort, top-3 slice, no sortOrder on homepage)
- Project sort logic on `/projects` page: `/Users/johnn/Documents/git/manicinc/src/lib/getAllProjects.ts` lines 257-267 (featured first, then sortOrder asc, then date desc)
- App sources for content/screenshots:
  - `/Users/johnn/Documents/git/voice-chat-assistant/apps/wunderland-sh/`
  - `/Users/johnn/Documents/git/voice-chat-assistant/apps/agentos.sh/`
  - `/Users/johnn/Documents/git/voice-chat-assistant/apps/paracosm/`
  - `/Users/johnn/Documents/git/voice-chat-assistant/apps/wilds-ai/`
  - `/Users/johnn/Documents/git/voice-chat-assistant/apps/wunderland-sol/`
- Live URLs: wunderland.sh, agentos.sh, paracosm.agentos.sh, wilds.ai

## Featured ordering — final state

Homepage hero (sorted by date desc, top 3):

| Position | Project | Date | sortOrder | featured |
|----------|---------|------|-----------|----------|
| 1 | wilds-ai | 2026-04-25 | 1 | true |
| 2 | paracosm | 2026-04-08 | 2 | true |
| 3 | agentos | 2026-02-12 | 3 | true |

Other projects on `/projects` (existing, unchanged unless noted):

| Project | Date | featured | Notes |
|---------|------|----------|-------|
| wunderland.sh (rewritten) | 2026-03-15 | false | Was featured, now regular |
| wunderland-sol (new file) | 2026-02-12 | false | Preserves the Solana hackathon content |
| domainhq | 2026-01-06 | false | Was featured, now regular |
| quarry | 2026-01-06 | true (kept) | Older than agentos by date, will appear 4th — out of homepage hero |
| voice-chat-assistant | 2025-11-10 | true (kept) | Far older, out of hero |
| portapack | 2025-04-20 | true (kept) | Far older, out of hero |
| Featured blog posts (reddit-consensus, logomaker) | 2025 | true | Far older, out of hero |
| frame, hackbase, rabbithole, synthstack | unchanged | false | Out of scope |

Verification: with these dates, `getFeaturedItems()` in `src/app/page.tsx` will combine featured posts + featured projects, sort by date desc, and slice(0, 3) — yielding `[wilds-ai (2026-04-25), paracosm (2026-04-08), agentos (2026-02-12)]`. Quarry (2026-01-06), voice-chat-assistant (2025-11-10), portapack (2025-04-20), and the 2025 featured blog posts are all older than agentos (2026-02-12) and stay out of the top 3.

### sortOrder safety

Existing featured `sortOrder` values: wilds=1, wunderland=2, (rabbithole=3 but unfeatured so irrelevant). After the change: wilds=1, paracosm=2, agentos=3. Wunderland.sh becomes unfeatured so its sortOrder is moot. Quarry/voice-chat-assistant/portapack keep their existing sortOrders (or default 999) — they sort below 1/2/3 either way on the `/projects` page. No conflicts.

## File-level changes

### New files

- `projects/ai/agentos.md` — new featured project page for AgentOS framework
- `projects/ai/paracosm.md` — new featured project page for Paracosm
- `projects/ai/wunderland-sol.md` — preserves existing Solana hackathon content under a new slug

### Rewritten files

- `projects/ai/wunderland.md` — repositioned as wunderland.sh (OpenClaw fork autonomous agent framework). Same slug, same URL, new content + new hero theme

### Frontmatter-only edits

- `projects/ai/wilds.md` — bump date to 2026-04-25, ensure `sortOrder: 1`, verify `featured: true`. Add an FAQ section (content edit) and refresh image alt text. Add JSON-LD via the existing layout if not already present
- `projects/ai/domainhq.md` — set `featured: false`, remove `featured` from tags, no other content changes

### Asset additions (`/public/assets/projects/`)

- `agentos/` (new dir): logo (light + dark), og-image, landing screenshot, hero/feature screenshots — TBD count after live capture, target 3-5 images
- `paracosm/` (new dir): logo (if available), og-image, paracosm.agentos.sh landing screenshot, /sim running demo screenshot, /docs screenshot
- `wunderland/`: add OpenClaw-fork-relevant screenshots (landing page hero, CLI/install screenshot, channels matrix). Keep existing Solana-themed images for the wunderland-sol page
- `wilds/`: re-capture if existing PNGs are stale or low-resolution. Existing files: wilds-landing, wilds-create, wilds-explore, wilds-pricing, wilds-about, wilds-faq, wilds-blog. Verify all render in `wilds.md`

### CSS / component fixes

- `src/components/Nav/Nav.module.css` — fix mobile hamburger right-alignment gap. Investigation needed: probably an interplay between `.mobileMenuBtn` padding-right and the parent container's max-width / safe-area-inset
- Quick mobile audit (375px and 768px): homepage, /projects, /projects/ai/wilds, /projects/ai/paracosm, /projects/ai/agentos, /projects/ai/wunderland — flag and fix any obvious breakage; defer larger items to a punch list

## Content structure for each new/rewritten project page

Each page follows a consistent shape so SEO, internal linking, and reader expectations stay coherent across the projects surface. Sections scale to the project's complexity but always include:

1. **Hero** — inline HTML/CSS hero section matching the existing wilds.md / wunderland.md / domainhq.md pattern (gradient title, subtitle, primary CTA). Project-specific gradient palette.
2. **What it is (single sentence + paragraph)** — direct authoritative statement of the product. No "aims to" / "tries to" hedging.
3. **Why it exists** — one-paragraph framing of the problem space. Cites a recent industry trend or paper where appropriate.
4. **Core features** — 4-7 features, each with a short subhead and 2-3 sentences. Use tables where comparing options or tiers.
5. **How it differs from alternatives** — explicit comparison table or paragraph contrasting against named competitors (OpenClaw, LangGraph, AutoGen, Mem0, etc.). No vague "we're different because" — concrete axes.
6. **Code / install snippet** — for libraries (agentos, paracosm, wunderland.sh): one-line install + a 5-15 line usage example showing the canonical API. For platforms (wilds-ai): a CTA section instead.
7. **Powered by / built on** — cross-link to the other Manic projects in the ecosystem. Every featured page links to at least the other 3 featured projects + frame.dev.
8. **FAQ** — 6-8 questions in `<details>` / heading-based markup, structured for AI Overviews and Google People Also Ask. Each Q phrased as a real user search query.
9. **Get started** — last section, prominent CTA. Link to live URL, GitHub, npm, docs as applicable.

### Word-count targets

- agentos.md: ~1400 words (most-cited as the runtime; warrants depth)
- paracosm.md: ~1200 words
- wunderland.md (rewrite): ~1300 words
- wilds.md additions: existing ~2000 words is good; add ~300 words for FAQ + minor refinements

### Citations / deep research

For each new page, run `deep-research` skill once with a focused query. Pull 3-5 high-quality citations from the result. Link inline as markdown links, not footnotes. Cited sources should be either:

- Peer-reviewed papers or major preprints (arXiv, ACM, etc.)
- Authoritative industry sources (the project's own docs, founder posts on respected blogs, well-cited GitHub READMEs)
- NOT marketing-fluff blog posts, listicles, or low-effort summaries

Deep-research queries:

- **wunderland.sh**: "open-source autonomous AI agent frameworks 2026 OpenClaw HEXACO personality"
- **agentos**: "TypeScript AI agent runtime cognitive memory multi-agent orchestration 2026"
- **paracosm**: "structured world models LLM counterfactual simulation agent personality 2026"
- **wilds-ai**: skip new research; existing copy already cites HEXACO-60 Wikipedia; just add 1-2 citations on AI dungeon master / interactive fiction landscape if needed

### Frontmatter shape

```yaml
---
title: <SEO-tuned title under 60 chars>
description: <SEO meta description under 160 chars>
date: YYYY-MM-DD
category: ai
tags: [<5-10 tags including 'featured' for the three top items>]
link: <live URL>
github: <repo URL if open-source, else omit>
image: /assets/projects/<name>/<primary>.png
images: [<list of all images shown on the page>]
featured: true | false
draft: false
sortOrder: <int>
status: ongoing
license: <SPDX or 'Proprietary'>
stats:
  - label: <short>
    value: <short>
technologies: [<top 5-8>]
languages: [<2-3>]
team:
  - name: Manic Agency
    role: <role>
    link: https://manic.agency
---
```

## Screenshots — capture plan

Tooling: Chrome DevTools MCP (`new_page`, `navigate_page`, `take_screenshot`). Crop and convert with ImageMagick or `sharp` (already in the manicinc node_modules) or Python Pillow.

Output for each screenshot: PNG (lossless source) + WebP (quality 85, primary served format). Filename pattern: `<project>-<page>-<width>.<ext>` e.g. `wilds-landing-1920.webp`.

Per project, target captures:

- **wunderland.sh** (landing only per user instruction):
  - Landing hero — 1920x1080 desktop
  - Features grid — scrolled view
  - Install/CLI section (if present) or terminal demo
- **agentos.sh** (landing focus):
  - Landing hero — 1920x1080 desktop
  - Features section
  - Ecosystem / built-on showcase
- **paracosm** (landing + app demo per user instruction):
  - paracosm.agentos.sh landing — 1920x1080
  - `/sim` running demo — show a multi-turn run with metrics or output panel
  - `/docs` page or API reference
- **wilds-ai** (landing + app pages per user instruction; refresh existing assets):
  - wilds.ai landing — 1920x1080
  - wilds.ai/app/create wizard
  - wilds.ai/app/explore (if accessible without login)
  - wilds.ai/pricing
  - wilds.ai/faq

Authentication: if any app page requires login, ask the user before logging in. Otherwise skip and document the gap.

Alt text rule: every image gets descriptive alt text in the markdown that includes the primary keyword for the page (e.g., "Wilds.ai landing page — AI game world creator and interactive fiction platform"). No generic "screenshot" alt text.

## Mobile hamburger fix — investigation plan

1. Read `Nav.module.css` lines around the `.mobileMenuBtn` and `.hamburgerIconWrapper` selectors
2. Check the parent `.navInner` / `.navContainer` for max-width and padding-right
3. Check for any `safe-area-inset-right` env() usage
4. Test in Chrome DevTools at 375px width
5. Fix likely candidates: missing `padding-right`, parent container `max-width: 1200px` with `margin: 0 auto` causing offset on smaller viewports, or `right: 1rem` instead of `right: 0` on the absolute-positioned button
6. Visual verify before committing

## Quick mobile UX audit — punch list approach

Spend ~30 min total. Test 375px and 768px viewports of:

- Homepage (`/`)
- Projects index (`/projects`)
- A featured project detail (`/projects/ai/wilds`)
- Blog index (`/blog`)

Flag anything obviously broken (overflow, illegible text, broken images, broken animations, tap-target size). Fix obvious ones inline, defer larger items to a punch list at the end of the spec doc as deferred work.

## Cross-reference audit (mandatory step before commit)

The current `wunderland.md` describes wunderland-sol (Solana social network) and lives at the slug `/projects/ai/wunderland`. After my rewrite, that URL describes the OpenClaw fork. Other files reference this URL with text that assumes the Solana framing — those references must be updated.

Known references to fix:

- `projects/ai/frame.md` lines 212-221 — has a Wunderland.sh section that currently says "AgentOS-powered agents on-chain with HEXACO personality traits, cryptographic post provenance" (Solana framing). Update to either the OpenClaw-fork description (preferred) or split into two cross-links: one to `/projects/ai/wunderland` (OpenClaw fork) and one to `/projects/ai/wunderland-sol` (Solana hackathon)
- `projects/ai/wilds.md` line 311 — describes wunderland.sh as "social network of AI agents on Solana." Update to OpenClaw-fork framing
- Any other markdown file in `projects/` or `posts/` that mentions wunderland — grep for `wunderland` and audit each hit before marking the phase done

When preserving the Solana content as `wunderland-sol.md`:

- Update `link:` from `https://wunderland.sh` to either the dedicated Solana site (if one exists) or omit if there is no live URL beyond GitHub
- Update `github:` to remain `https://github.com/manicinc/wunderland-sol` (correct)
- The npm reference inside the body refers to `wunderland` package — but per the wunderland-sh README, that npm package is the OpenClaw fork, not the Solana SDK. The Solana SDK is `@wunderland-sol/sdk` per the diagram in the existing wunderland.md line 203. Audit and correct the npm references in the preserved wunderland-sol page
- Drop the `featured: true` flag and the `featured` tag

## Order of execution

1. Phase 1 — frontmatter changes only (unfeature domainhq, downgrade wunderland.md to non-featured, set new dates and sortOrders). Verify featured-3 ordering matches spec via a short script that loads the projects.
2. Phase 2 — preserve wunderland-sol content under new file (with npm package references corrected to `@wunderland-sol/sdk`)
3. Phase 3 — write new agentos.md (deep-research → draft → cite)
4. Phase 4 — write new paracosm.md (deep-research → draft → cite)
5. Phase 5 — rewrite wunderland.md as OpenClaw fork (deep-research → draft → cite)
6. Phase 6 — wilds.md FAQ + refinements
7. Phase 7 — cross-reference audit pass: grep for `wunderland`, update `frame.md` and `wilds.md` cross-links and any other hits
8. Phase 8 — capture all screenshots in one Chrome DevTools session, crop, convert, drop into `/public/assets/projects/`
9. Phase 9 — wire screenshots into the markdown files (verify rendering in dev server)
10. Phase 10 — mobile hamburger fix + quick mobile audit
11. Phase 11 — local build verify; commit per phase

Phases 3-5 can run partially in parallel since they don't share files, but content quality benefits from sequential authoring with cross-link verification at the end. Estimated wall time: 4-6 hours of focused work.

## Verification checklist (run before claiming done)

- [ ] `next build` passes locally from `/Users/johnn/Documents/git/manicinc/`
- [ ] All four pages render in dev (`pnpm dev` and visit each URL)
- [ ] Homepage hero shows exactly wilds → paracosm → agentos in order
- [ ] domainhq is no longer in homepage hero
- [ ] wunderland.sh page reflects OpenClaw-fork positioning (not Solana)
- [ ] wunderland-sol page is reachable at `/projects/ai/wunderland-sol`
- [ ] All screenshots load (no broken `/assets/projects/...` 404s)
- [ ] Mobile hamburger button visually flush to right edge at 375px
- [ ] FAQ sections render correctly on each new page
- [ ] No internal links broken (`/projects/ai/wunderland` etc still resolve)
- [ ] No external links broken (live URLs, npm packages, GitHub repos all 200)

## Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Live sites unreachable when capturing screenshots | Have local apps running as fallback; can capture from local dev servers if needed |
| App pages require auth I cannot perform | Ask user; document any deferred captures in the punch list |
| Internal cross-links to `wunderland` from other pages assume Solana content | Audit all references in `projects/` and `posts/` for `wunderland-sol`, `solana`, `colosseum` keywords; update relevant links to point to the new wunderland-sol slug |
| `next build` failures from new markdown frontmatter | Run build after each new file is written, not at the end |
| Existing wilds.md images stale — user said "not loaded properly" | Verify by visiting the live page in dev mode first; only re-capture if confirmed broken |

## Punch-list approach for deferred work

Anything found during execution that is NOT covered by this spec but is real (e.g. another mobile issue, a broken image elsewhere, a typo in another project page) goes into a `## Deferred` section at the end of the eventual implementation handoff doc. NOT fixed inline unless it actively breaks the changes in this spec. This keeps the scope honest and the diff reviewable.

## Out of scope

- Performance optimization beyond image webp conversion
- Lighthouse score improvements
- Accessibility audit beyond alt text
- New blog posts
- Changes to navigation structure or footer
- Theme/dark-mode work
- Analytics or tracking changes
