---
title: Magiclogger — Colorful Node / Browser Logger
description: A powerful, zero-config logging library for Node.js and browsers with rich styling, multiple formats, and drop-in compatibility.
date: 2025-04
category: tools
tags: [javascript, nodejs, logging, development, featured]
link: https://manic.agency/magiclogger
github: https://github.com/manicinc/magiclogger
# image: /projects/tools/magiclogger.jpg
featured: false
draft: true
---

![MagicLogger]

## What's MagicLogger?

A powerful, zero-config logging library that works beautifully in both Node.js and browsers. Get rich styling, colors, multiple output formats, and drop-in compatibility with popular logging libraries.

> Simplify your logging with a single library that works everywhere.

## Key Features

- **🎨 Rich Styling** — Colors, bold, italic, underline in terminal and browser console
- **📊 Visual Elements** — Progress bars and tables directly in your console
- **📝 Multiple Transports** — Console, file, browser storage, and remote HTTP endpoints
- **🔌 Drop-in Compatibility** — Replace console, Winston, Bunyan, and Pino seamlessly
- **🧠 Structured Logging** — Support for both text and JSON formats
- **⚡ Zero Config & Zero Dependencies** — Works out of the box with sensible defaults
- **🌐 Environment Aware** — Automatically adapts to Node.js or browser
- **🧵 Multiple Module Formats** — ESM, CommonJS, and TypeScript declarations

## Quick Start

```javascript
import { Logger } from 'magiclogger';

// Create a new logger with default settings
const logger = new Logger();

// Log with different levels
logger.info('Application starting up...');
logger.warn('Connection pool nearing capacity');
logger.error('Database connection failed');
logger.debug('User authentication details');
logger.success('Email sent successfully');

// Add visual elements
logger.header('SYSTEM STATUS');
logger.progressBar(75);  // 75% progress bar

// Structured logging
logger.info('User logged in', { userId: 123, ip: '192.168.1.1' });
```

## Powerful Transports

MagicLogger sends your logs wherever you need them:

```javascript
const logger = new Logger({
  // Log to console with colors
  console: { 
    enabled: true, 
    useColors: true 
  },
  
  // Save logs to files (Node.js)
  file: { 
    enabled: true, 
    directory: './logs' 
  },
  
  // Store logs in browser localStorage
  browserStorage: { 
    enabled: true, 
    maxEntries: 1000 
  },
  
  // Send critical logs to your server
  remote: {
    enabled: true,
    endpoint: 'https://logs.example.com/api/logs',
    levels: ['error', 'warn']
  }
});
```

## Replace Existing Loggers

Enhance your existing logging code without refactoring:

```javascript
// Enhance the standard console
import { enhanceConsole } from 'magiclogger';
enhanceConsole();

// Now standard console has new powers
console.header('APPLICATION STATUS');
console.success('All systems operational');

// Create Winston/Bunyan/Pino compatible loggers
import { createWinstonCompatible } from 'magiclogger';
const logger = createWinstonCompatible({ verbose: true });
```

## Coming Soon!

MagicLogger is currently in development and will be available soon. Stay tuned for its release!

Built with ❤️ by [Manic Agency](https://manic.agency) - We do experimental design & development