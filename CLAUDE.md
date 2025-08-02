# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Orchestrator's Ascent** is a modular interactive web application for AI education. The platform features a sophisticated educational content system with Greek language content about strategic AI thinking. The codebase was recently refactored from a monolithic structure to a modular architecture to support current features and future blueprint features.

## Key Architecture Components

### Core Application Structure
- **Main Entry Point**: `index.html` - Modern modular HTML template with dynamic module loading
- **Application Core**: `app.js` - Central AIOrchestrator class that manages the entire platform
- **Content System**: `content.json` - Structured educational content in Greek, `content-manager.js` for dynamic loading
- **Module System**: Modular architecture with independent feature modules

### Core Modules
- **Event Management**: `event-manager.js` - Central event coordination system
- **Responsive Management**: `responsive-manager.js` - Handles responsive design across mobile/desktop
- **Module Loading**: `module-loader.js` - Dynamic module initialization and lifecycle
- **Interactive Reading**: `reading.js`, `interactive-reading.js` - Gamified reading experience with progress tracking
- **Marginalia System**: `marginalia.js`, `svg-marginalia.js` - SVG-based drawing/annotation tools
- **AI-Q System**: `aiq.js` - Progression and achievement system

### Platform Features
- **SVG Marginalia**: Advanced drawing system for user annotations on content
- **Interactive Reading**: Progress tracking with "commit/push" gamification
- **AI-Q Progression**: Points-based achievement system with exercises
- **Responsive Design**: Optimized for mobile vertical, mobile horizontal, and desktop
- **Content Management**: Dynamic chapter loading with structured JSON content

## Content Structure

The educational content is structured in `content.json` with:
- **Metadata**: Greek language, versioning, author information
- **Chapters**: Hierarchical content with introduction, test chapters, and full chapters
- **Elements**: Rich content types including paragraphs, headings, exercise boxes, framework boxes
- **Navigation**: Chapter progression and availability system
- **User Progress**: Achievement tracking and AI-Q points system

## Common Development Commands

**Development Server**: Open `index.html` directly in browser or serve via local HTTP server
**Testing**: Open `simple-demo.html` for simplified testing environment
**Mobile Testing**: Use browser dev tools responsive mode for mobile layouts

## Code Architecture Patterns

### Module Pattern
All features are implemented as independent modules with standardized interfaces:
```javascript
// Module structure example
const ModuleName = {
    init: async function() { /* initialization */ },
    destroy: function() { /* cleanup */ },
    // Module-specific methods
};
```

### Event-Driven Communication
Modules communicate through the central EventManager:
```javascript
// Emit events
AIOrchestrator.emit('event:name', data);
// Listen for events  
AIOrchestrator.on('event:name', callback);
```

### Responsive Design Strategy
- **Mobile-first CSS** with progressive enhancement
- **Breakpoints**: mobile (768px), tablet (1024px), desktop (1280px)
- **Touch-optimized** interfaces for mobile devices
- **Orientation-specific** optimizations for mobile landscape/portrait

### Content Rendering
Dynamic content rendering from JSON structure:
- Content elements are converted to DOM nodes
- Support for rich content types (exercises, frameworks, lists)
- Progressive loading for performance

## File Organization

```
├── index.html              # Main application entry point
├── simple-demo.html         # Testing/demo version
├── content.json             # Educational content data
├── app.js                   # Core application logic
├── content-manager.js       # Content loading and management
├── event-manager.js         # Event coordination
├── responsive-manager.js    # Responsive design management
├── module-loader.js         # Module system
├── reading.js               # Interactive reading features
├── marginalia.js            # Drawing/annotation system
├── aiq.js                   # Achievement/progression system
├── [module-name].js         # Other feature modules
└── [css/]                   # Stylesheets (referenced but not in root)
```

## Future Architecture (Blueprint Support)

The codebase is prepared for future features outlined in the comprehensive blueprint:
- **Leaderboard System**: Contextual motivation and tier-based progression
- **Avatar System**: Evolving canvas avatars that reflect user achievements
- **Creative Pattern Engine**: Advanced drawing and creative tools
- **Economy System**: Dual-currency ethical professionalism economy

Extension points are built into the core architecture with feature flags and module interfaces ready for these systems.

## Important Notes

- **Language**: Primary content is in Greek (language: "el")
- **Target Audience**: Professionals aged 28-50 learning strategic AI thinking
- **Platform Support**: Responsive design for all modern browsers and mobile devices
- **Performance**: Optimized for progressive loading and mobile performance
- **Educational Focus**: Interactive learning with gamification elements that don't compromise educational value