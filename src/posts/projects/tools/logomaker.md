---
title: Logomaker — Free Text Logo Generator
description: A fun, client-side text logo generator with 400+ fonts, animations, and offline support - built as an AI collaboration experiment.
date: 2025-03
category: tools
tags: [design, typography, generative, ai, experiment, vibe-coding]
link: https://manicinc.github.io/logomaker/
github: https://github.com/manicinc/logomaker
image: /manic.gif
featured: false
draft: false
---

# Logomaker

## What's Logomaker?

A free, open-source text logo generator that works entirely in your browser! Create beautiful, animated text logos with 400+ fonts, export them as vector SVGs or high-quality PNGs, and share your designs with a unique URL.

> Logomaker is more than just a tool - it's our experiment in ✨ Vibe Coding ✨ (Human+AI collaboration).

## Key Features

- **400+ Built-in Fonts** - Plus add your own! All fonts work offline
- **Dynamic Effects & Animations** - Add bounces, pulses, glitches and more
- **Pro Export Options:**
  - **SVG:** Clean vectors with embedded fonts and animations
  - **PNG:** High-quality images with transparency
  - **Frame Sequences:** Export animations as individual PNG frames
- **Shareable URLs** - Generate links that capture your exact design
- **100% Client-Side** - Works offline, respects your privacy
- **Zero Dependencies** - No npm or build tools needed to use it

## Why We Made This

We needed a quick way to prototype text logos for projects without firing up Illustrator or After Effects. Something lightweight that clients could play with directly in the browser.

But we also wanted to experiment with a new development approach:

## ✨ Vibe Coding: AI + Human Collaboration ✨

Logomaker is a creative experiment in human-AI collaboration. Over 90% of the codebase originated from AI (GPT-4, Claude 3, and Gemini models), guided by our technical prompt engineering and refined through iterative testing.

Each AI system worked through their respective web UIs (not APIs), letting us test how they approach complex software design through conversation. We discovered:

- AI excels at generating functional code skeletons and solving focused problems
- Humans are essential for architecture, quality control, and creative direction
- The "vibe" between human and AI creates a unique development workflow

## Two Ways To Use It

### 1. Online Version (Fastest)

The [live demo](https://manicinc.github.io/logomaker/) loads instantly and fetches font data only when needed.

### 2. Portable Version (Works Anywhere)

Download the single-file version with all fonts embedded - perfect for offline use, workshops, or easy sharing.

## Technical Tricks

- **Smart Font Loading:** Uses IndexedDB caching and chunked loading online, embedded Base64 data offline
- **Vector Animation:** CSS animations embedded directly in SVG exports
- **Intelligent Randomization:** Press "R" to generate coherent, weighted random styles

## Try It Now!

[Launch Logomaker](https://manicinc.github.io/logomaker/) or check out the [GitHub repo](https://github.com/manicinc/logomaker) for more details.
