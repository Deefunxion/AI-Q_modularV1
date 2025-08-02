/**
 * FontAwesome Icon Manager - AI Orchestrator's Ascent
 * 
 * Manages Font Awesome icons για professional UI instead of generic emojis.
 * Supports SVG loading, CSS classes, και dynamic icon management.
 */

class IconManager {
    constructor(fontAwesomePath = null) {
        // Path to FontAwesome assets
        this.basePath = fontAwesomePath || 'C:/Users/dee/Desktop/FINAL_PRODUCTION_PACKAGE/draftV2/assets/fontawesome';
        this.svgPath = `${this.basePath}/svgs`;
        this.cssPath = `${this.basePath}/css`;
        
        // Icon categories
        this.categories = ['solid', 'regular', 'brands'];
        
        // Icon cache for performance
        this.iconCache = new Map();
        
        // Professional icon mappings for Scribble Saga
        this.iconMappings = this.initializeIconMappings();
        
        console.log('🎨 FontAwesome Icon Manager initialized');
    }

    /**
     * Initialize professional icon mappings for Scribble Saga
     */
    initializeIconMappings() {
        return {
            // === CREATIVE TOOLS ===
            tools: {
                pen: 'pen',
                pencil: 'pencil',
                brush: 'brush', 
                highlighter: 'highlighter',
                eraser: 'eraser',
                shape: 'draw-polygon',
                pattern: 'th',
                diagram: 'sitemap',
                flow: 'project-diagram',
                smart_assist: 'robot',
                pattern_generator: 'magic'
            },
            
            // === CREATIVE EFFECTS ===
            effects: {
                none: 'circle',
                fade: 'adjust',
                glow: 'sun',
                texture: 'th-large',
                shadow: 'cloud',
                gradient: 'palette'
            },
            
            // === LEVEL PROGRESSION ===
            levels: {
                0: 'user',           // Αρχάριος Δημιουργός
                1: 'palette',        // Εικονογράφος  
                2: 'shapes',         // Καλλιτέχνης Μοτίβων
                3: 'drafting-compass', // Αρχιτέκτονας Ιδεών
                4: 'crown'           // Μάστορας Δημιουργίας
            },
            
            // === UI ELEMENTS ===
            ui: {
                level_up: 'star',
                achievement: 'trophy',
                xp: 'bolt',
                save: 'save',
                load: 'folder-open',
                clear: 'trash',
                library: 'book',
                settings: 'cog',
                close: 'times',
                expand: 'expand',
                collapse: 'compress',
                help: 'question-circle',
                info: 'info-circle'
            },
            
            // === CREATIVE ACTIONS ===
            actions: {
                stroke_start: 'play',
                stroke_complete: 'check',
                pattern_detected: 'search',
                pattern_completion: 'medal',
                creative_milestone: 'trophy',
                daily_creativity: 'calendar-day'
            },
            
            // === PATTERN TYPES ===
            patterns: {
                circle: 'circle',
                square: 'square',
                triangle: 'play',
                line: 'minus',
                curve: 'bezier-curve',
                spiral: 'yin-yang',
                wave: 'water',
                zigzag: 'chart-line'
            },
            
            // === ACHIEVEMENTS ===
            achievements: {
                first_stroke: 'baby',
                pattern_master: 'crown',
                daily_creator: 'calendar-check',
                week_streak: 'fire',
                month_master: 'gem',
                tool_explorer: 'compass',
                effect_wizard: 'magic',
                level_master: 'star'
            }
        };
    }

    /**
     * Get icon HTML για specific category και name
     * @param {string} category - Icon category (tools, effects, ui, etc.)
     * @param {string} name - Icon name within category
     * @param {string} style - FontAwesome style (solid, regular, brands)
     * @param {string} className - Additional CSS classes
     * @returns {string} HTML string for the icon
     */
    getIcon(category, name, style = 'solid', className = '') {
        const iconName = this.getIconName(category, name);
        
        if (!iconName) {
            console.warn(`Icon not found: ${category}.${name}`);
            return this.getFallbackIcon();
        }
        
        // Generate FontAwesome CSS class
        const faClass = this.getFontAwesomeClass(style, iconName);
        const combinedClasses = `${faClass} ${className}`.trim();
        
        return `<i class="${combinedClasses}" data-icon="${category}-${name}"></i>`;
    }

    /**
     * Get SVG path για specific icon
     * @param {string} category - Icon category
     * @param {string} name - Icon name
     * @param {string} style - FontAwesome style
     * @returns {string} Path to SVG file
     */
    getSVGPath(category, name, style = 'solid') {
        const iconName = this.getIconName(category, name);
        
        if (!iconName) {
            return null;
        }
        
        return `${this.svgPath}/${style}/${iconName}.svg`;
    }

    /**
     * Load SVG content for inline use
     * @param {string} category - Icon category
     * @param {string} name - Icon name
     * @param {string} style - FontAwesome style
     * @returns {Promise<string>} SVG content
     */
    async loadSVG(category, name, style = 'solid') {
        const cacheKey = `${style}-${category}-${name}`;
        
        // Check cache first
        if (this.iconCache.has(cacheKey)) {
            return this.iconCache.get(cacheKey);
        }
        
        const svgPath = this.getSVGPath(category, name, style);
        
        if (!svgPath) {
            return this.getFallbackSVG();
        }
        
        try {
            const response = await fetch(svgPath);
            if (!response.ok) {
                throw new Error(`Failed to load SVG: ${response.status}`);
            }
            
            const svgContent = await response.text();
            
            // Cache the result
            this.iconCache.set(cacheKey, svgContent);
            
            return svgContent;
        } catch (error) {
            console.warn(`Failed to load SVG for ${category}.${name}:`, error);
            return this.getFallbackSVG();
        }
    }

    /**
     * Get mapped icon name from category
     * @param {string} category - Icon category
     * @param {string} name - Icon name within category
     * @returns {string|null} FontAwesome icon name
     */
    getIconName(category, name) {
        if (!this.iconMappings[category]) {
            console.warn(`Unknown icon category: ${category}`);
            return null;
        }
        
        return this.iconMappings[category][name] || null;
    }

    /**
     * Generate FontAwesome CSS class
     * @param {string} style - FontAwesome style (solid, regular, brands)
     * @param {string} iconName - FontAwesome icon name
     * @returns {string} CSS class string
     */
    getFontAwesomeClass(style, iconName) {
        const stylePrefix = {
            solid: 'fas',
            regular: 'far',
            brands: 'fab'
        };
        
        const prefix = stylePrefix[style] || 'fas';
        return `${prefix} fa-${iconName}`;
    }

    /**
     * Load FontAwesome CSS
     * @returns {Promise<void>}
     */
    async loadCSS() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector('link[href*="fontawesome"]')) {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${this.cssPath}/all.min.css`;
            link.onload = resolve;
            link.onerror = reject;
            
            document.head.appendChild(link);
        });
    }

    /**
     * Create icon element with specific styling
     * @param {string} category - Icon category
     * @param {string} name - Icon name
     * @param {Object} options - Styling options
     * @returns {HTMLElement} Icon element
     */
    createElement(category, name, options = {}) {
        const {
            style = 'solid',
            size = null,
            color = null,
            className = '',
            title = null
        } = options;
        
        const iconName = this.getIconName(category, name);
        
        if (!iconName) {
            return this.createFallbackElement();
        }
        
        const icon = document.createElement('i');
        const faClass = this.getFontAwesomeClass(style, iconName);
        icon.className = `${faClass} ${className}`.trim();
        
        // Apply styling
        if (size) icon.style.fontSize = size;
        if (color) icon.style.color = color;
        if (title) icon.title = title;
        
        // Add data attributes
        icon.dataset.iconCategory = category;
        icon.dataset.iconName = name;
        icon.dataset.iconStyle = style;
        
        return icon;
    }

    /**
     * Get all icons in a category
     * @param {string} category - Icon category
     * @returns {Array} Array of icon names
     */
    getCategoryIcons(category) {
        if (!this.iconMappings[category]) {
            return [];
        }
        
        return Object.keys(this.iconMappings[category]);
    }

    /**
     * Search icons by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} Matching icons
     */
    searchIcons(keyword) {
        const results = [];
        const lowerKeyword = keyword.toLowerCase();
        
        for (const [category, icons] of Object.entries(this.iconMappings)) {
            for (const [name, faName] of Object.entries(icons)) {
                if (name.includes(lowerKeyword) || faName.includes(lowerKeyword)) {
                    results.push({
                        category,
                        name,
                        faName,
                        html: this.getIcon(category, name)
                    });
                }
            }
        }
        
        return results;
    }

    /**
     * Generate icon picker HTML για UI
     * @param {string} category - Category to show
     * @param {Function} onSelect - Selection callback
     * @returns {string} Icon picker HTML
     */
    generateIconPicker(category, onSelect = null) {
        const icons = this.getCategoryIcons(category);
        
        if (icons.length === 0) {
            return '<div class="no-icons">No icons available</div>';
        }
        
        const iconElements = icons.map(iconName => {
            const iconHTML = this.getIcon(category, iconName);
            return `
                <div class="icon-option" 
                     data-category="${category}" 
                     data-name="${iconName}"
                     title="${iconName}">
                    ${iconHTML}
                    <span class="icon-label">${iconName}</span>
                </div>
            `;
        }).join('');
        
        return `
            <div class="icon-picker" data-category="${category}">
                <div class="icon-picker-header">
                    <h4>${category.charAt(0).toUpperCase() + category.slice(1)} Icons</h4>
                </div>
                <div class="icon-picker-grid">
                    ${iconElements}
                </div>
            </div>
        `;
    }

    /**
     * Fallback icon για missing icons
     */
    getFallbackIcon() {
        return '<i class="fas fa-question-circle" title="Icon not found"></i>';
    }

    /**
     * Fallback SVG για missing SVGs
     */
    getFallbackSVG() {
        return `
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/>
            </svg>
        `;
    }

    /**
     * Create fallback element
     */
    createFallbackElement() {
        const icon = document.createElement('i');
        icon.className = 'fas fa-question-circle';
        icon.title = 'Icon not found';
        return icon;
    }

    /**
     * Initialize για specific project (copy FontAwesome assets)
     * @param {string} targetPath - Target path για copying assets
     */
    async initializeProject(targetPath) {
        // This would copy necessary FontAwesome files to project
        console.log(`Initializing FontAwesome for project at: ${targetPath}`);
        
        // For now, just ensure CSS is loaded
        await this.loadCSS();
        
        console.log('✅ FontAwesome initialized for project');
    }
}

// Export για module system
window.IconManager = IconManager;

// Create global instance if needed
if (!window.iconManager) {
    window.iconManager = new IconManager();
}