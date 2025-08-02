/**
 * SVG Marginalia System - AI Orchestrator's Ascent
 * 
 * Revolutionary annotation system that creates document-anchored drawings
 * with intelligent zone-based interaction and AI-Q progression.
 * 
 * Constitution Compliance:
 * - Article 2: Nielsen/Norman clarity with cyberpunk sophistication
 * - Article 3: AI-Q progression affects stroke quality
 * - Article 4: Font Awesome 7 icons, "Cookie Monster" data persistence
 */

class SVGMarginalia {
    constructor() {
        this.svg = null;
        this.currentPath = null;
        this.isDrawing = false;
        this.currentAIQ = 85; // Default starting AI-Q
        this.annotations = new Map(); // Page-specific annotations storage
        this.currentPage = window.location.pathname;
        this.debugMode = false; // Set to true for coordinate debugging
        
        // Zone definitions for smart interaction
        this.marginWidth = 120; // px from each edge
        this.fadeZoneWidth = 200; // px fade transition zone
        
        // Drawing state
        this.strokeCount = 0;
        this.lastPoint = null;
        
        // Scroll lock state
        this.scrollLocked = false;
        this.savedScrollY = 0;
        
        this.init();
    }
    
    /**
     * Initialize the SVG marginalia system
     */
    init() {
        this.loadAIQ();
        this.createSVGOverlay();
        this.setupEventListeners();
        this.loadStoredAnnotations();
        this.createControls();
        
        console.log('SVG Marginalia System initialized - AI-Q:', this.currentAIQ);
    }
    