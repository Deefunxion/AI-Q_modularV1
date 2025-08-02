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

## Development Commands

### Local Development
```bash
# Serve files via local HTTP server (required for module loading)
npx serve . -p 3000
# Or use Python 3
python -m http.server 3000
# Or use Python 2
python -m SimpleHTTPServer 3000
```

### Testing Environments
- **Main Application**: `index.html` - Full application with all modules
- **Simple Demo**: `simple-demo.html` - Lightweight testing environment with inline content
- **Scribble Saga Demo**: `scribble-saga-demo.html` - Enhanced creative features demo
- **Smart Guide Demo**: `ai-smart-dummies-guide.html` - Alternative presentation format

### Mobile Testing
```bash
# Test responsive breakpoints
# Mobile: 768px and below
# Tablet: 768px - 1024px  
# Desktop: 1024px and above
```

### Module Development
- **Add New Module**: Create `[module-name].js` following the module pattern
- **Enable Feature**: Update feature flags in `app.js` config section
- **Test Module**: Use `simple-demo.html` for isolated testing

## Core Architecture Principles

### 1. Modular Design Pattern
All features are implemented as independent, self-contained modules with standardized interfaces:
```javascript
// Standard module interface (all modules must follow this pattern)
const ModuleName = {
    // Required methods
    init: async function(app) { 
        this.app = app;
        // Module initialization logic
    },
    destroy: function() { 
        // Cleanup resources, remove event listeners
    },
    
    // Optional lifecycle methods
    onResponsiveChange: function(breakpoint) {
        // Handle responsive changes
    },
    initializeChapter: async function(chapterData) {
        // Chapter-specific initialization
    }
};
```

### 2. Central Application Controller
The `AIOrchestrator` class in `app.js` serves as the single source of truth:
- **State Management**: Global application state and user progress
- **Module Orchestration**: Loading, initializing, and coordinating modules
- **Event Coordination**: Central event hub for inter-module communication
- **Content Management**: Dynamic chapter loading and rendering
- **Responsive Management**: Coordinated responsive behavior across modules

### 3. Event-Driven Communication
Modules communicate exclusively through the central EventManager:
```javascript
// Event emission (modules notify other modules)
this.app.emit('event:name', data);

// Event listening (modules react to system events)
this.app.on('event:name', callback);

// Common events:
// 'app:ready', 'chapter:loaded', 'responsive:change', 'module:loaded'
```

### 4. Content-Driven Architecture
Content is structured in `content.json` and dynamically rendered:
```javascript
// Content structure drives UI generation
{
  "metadata": { "title": "...", "language": "el" },
  "chapters": {
    "chapter-id": {
      "title": "...",
      "elements": [
        { "type": "p", "content": "..." },
        { "type": "exercise-box", "title": "...", "content": "..." }
      ]
    }
  }
}
```

### 5. Feature Flag System
Development and production features are controlled via feature flags in `app.js`:
```javascript
features: {
    // Current production features
    interactiveReading: true,
    marginalia: true,
    aiqSystem: true,
    
    // Future blueprint features
    leaderboards: false,
    avatarSystem: false,
    creativeEngine: false,
    economySystem: false
}
```

### 6. Responsive Design Strategy
- **Mobile-first CSS** with progressive enhancement
- **Breakpoints**: mobile (768px), tablet (1024px), desktop (1280px)
- **Touch-optimized** interfaces for mobile devices
- **Coordinated responsive behavior** across all modules

## File Organization & Module Dependencies

```
# Core Application Files
├── index.html              # Main application entry point (Jekyll front matter)
├── simple-demo.html        # Lightweight testing environment
├── app.js                  # Central AIOrchestrator class (877 lines)
├── content.json            # Greek educational content (JSON structure)

# Core System Modules (Required for all features)
├── event-manager.js        # Central event coordination system
├── content-manager.js      # Dynamic content loading and rendering
├── responsive-manager.js   # Responsive breakpoint management
├── module-loader.js        # Dynamic module initialization

# Feature Modules (Loaded based on feature flags)
├── reading.js              # Interactive reading with commit/push gamification
├── interactive-reading.js  # Additional reading enhancement features
├── marginalia.js           # Traditional marginalia annotation system
├── svg-marginalia.js       # SVG-based drawing and annotation tools
├── aiq.js                  # AI-Q progression and achievement system

# Enhanced Creative Modules
├── icon-manager.js         # FontAwesome icon management
├── scribble-saga-core.js   # Core creative pattern engine
├── scribble-saga-enhanced.js # Enhanced creative features with professional UI

# Styling (Modular CSS Architecture)
├── core.css               # Base typography and layout
├── components.css         # Reusable UI components
├── responsive.css         # Responsive design rules
├── marginalia.css         # Marginalia-specific styling
├── reading.css            # Interactive reading styles
├── navigation.css         # Navigation component styles
├── scribble-saga-enhanced.css # Creative module styles

# Demo/Testing Files
├── scribble-saga-demo.html    # Creative features demonstration
├── ai-smart-dummies-guide.html # Alternative presentation format
└── index_blank.html           # Clean template for testing
```

### Module Loading Order
1. **Core Systems**: event-manager.js → content-manager.js → responsive-manager.js
2. **Application Core**: app.js (initializes and coordinates everything)
3. **Feature Modules**: Loaded conditionally based on feature flags in app.js
4. **Enhanced Features**: Creative modules loaded only when explicitly enabled

## Future Architecture (Blueprint Support)

The codebase is prepared for future features outlined in the comprehensive blueprint:
- **Leaderboard System**: Contextual motivation and tier-based progression
- **Avatar System**: Evolving canvas avatars that reflect user achievements
- **Creative Pattern Engine**: Advanced drawing and creative tools
- **Economy System**: Dual-currency ethical professionalism economy

Extension points are built into the core architecture with feature flags and module interfaces ready for these systems.

## Development Guidelines

### Adding New Modules
1. **Create Module File**: Follow the standard module interface pattern
2. **Update Feature Flags**: Add feature flag in `app.js` config section
3. **Register Module**: Add module loading logic in `AIOrchestrator.loadModules()`
4. **Test Isolation**: Use `simple-demo.html` for initial testing
5. **Integration Testing**: Test with full application via `index.html`

### Debugging and Development
- **Debug Mode**: Set `config.debug: true` in `app.js` for detailed logging
- **Event Monitoring**: Use browser console to monitor event emissions
- **Module State**: Access `window.AIOrchestrator.modules` to inspect loaded modules
- **Performance**: Use `performance.mark()` and `performance.measure()` (enabled in debug mode)

### Content Management
- **Content Updates**: Modify `content.json` (Greek language educational content)
- **Content Types**: Supported types include `p`, `h1-h6`, `exercise-box`, `framework-box`, `list`
- **Chapter Navigation**: Managed by URL parameters (`?chapter=chapter-id`)

### Asset Dependencies
- **FontAwesome**: Located in `../FINAL_PRODUCTION_PACKAGE/draftV2/assets/fontawesome/`
- **External Assets**: Must be served via HTTP server (not file:// protocol)
- **CSS Dependencies**: Modular CSS files loaded from root directory

## Important Notes

- **Language**: Primary content is in Greek (language: "el")
- **Target Audience**: Professionals aged 28-50 learning strategic AI thinking  
- **HTTP Server Required**: Use local HTTP server for module loading (not file:// protocol)
- **Mobile-First**: Responsive design optimized for mobile vertical, horizontal, and desktop
- **Educational Focus**: Interactive learning with gamification that doesn't compromise educational value
- **No Build Process**: Direct JavaScript modules, no compilation or bundling required