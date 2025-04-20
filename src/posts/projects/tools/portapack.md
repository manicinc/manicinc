---
title: PortaPack — One-File Web Experiences
description: Why we built a fun bundler that squishes your entire site into a single HTML file.
date: 2025-04
category: tools
tags: [html, cli, bundler, offline, product, featured]
link: https://manicinc.github.io/portapack/
github: https://github.com/manicinc/portapack
image: /portapack.jpg
featured: true
draft: false
---

# PortaPack

## Why we built PortaPack

Ever needed to share a web thing but got tangled in the "how do I send this?" mess? Us too! We wanted something that lets you share interactive prototypes with anyone — no server setup, no "it works on my machine" drama. Just a thing you can **drag into Slack**, **attach to emails**, or **toss on a USB stick** that works perfectly offline.

So we made **PortaPack**:  

> A magic little bundler that squishes your entire website into one `.html` file — super portable and totally bulletproof.

## The Problem

Let's be real: modern websites are a jungle of files, dependencies, CDNs, and weird asset pipelines. Great for fancy production sites! Not so great when you need to:

- Share quick demos with non-techy folks
- Make self-contained archives that won't break tomorrow
- Create offline snapshots for testing or presentations
- Package apps for kiosks or offline devices

And tools like `webpack`, `vite`, or `parcel`? They weren't built with "toss it in an email" portability in mind.

## The Solution

PortaPack is a **super simple CLI tool** (with a Node API too!) that crawls through your site, grabs all the bits and pieces, cleverly tucks them inside, and spits out a single HTML file with **everything** included — even the fonts!

```bash
npx portapack ./index.html -o bundle.html
```

You get a magical self-contained webpage with:

✅ All your styles baked in
✅ All your JavaScript tucked inside
✅ Fonts and images embedded
✅ Optional minification if you want it smaller
✅ Works offline and no CORS headaches

## Who's It For?

- Designers showing off interactive mockups
- Developers sharing prototypes that actually work
- QA folks needing reliable test environments
- Kiosk builders making offline experiences
- Anyone tired of saying "hang on, it should work if you..."
