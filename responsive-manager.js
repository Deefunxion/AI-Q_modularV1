/**
 * Responsive Manager - Handles responsive behavior and breakpoint management
 */

class ResponsiveManager {
    constructor(breakpoints = {}) {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
            ...breakpoints
        };
        
        this.currentBreakpoint = null;
        this.previousBreakpoint = null;
        this.listeners = new Map();
        this.resizeTimeout = null;
        this.resizeDelay = 150; // ms
        
        this.init();
    }

    /**
     * Initialize responsive manager
     */
    init() {
        this.updateBreakpoint();
        this.bindEvents();
        
        // Set CSS custom properties for breakpoints
        this.setCSSBreakpoints();
    }

    /**
     * Bind window events
     */
    bindEvents() {
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        
        // Listen for print media
        if (window.matchMedia) {
            const printMedia = window.matchMedia('print');
            printMedia.addListener(this.handlePrintChange.bind(this));
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize events
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            this.updateBreakpoint();
            this.emit('resize', this.getViewportInfo());
        }, this.resizeDelay);
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        // Small delay to ensure viewport has updated
        setTimeout(() => {
            this.updateBreakpoint();
            this.emit('orientation:change', this.getOrientationInfo());
        }, 100);
    }

    /**
     * Handle print media change
     */
    handlePrintChange(mediaQuery) {
        this.emit('print:change', mediaQuery.matches);
    }

    /**
     * Update current breakpoint
     */
    updateBreakpoint() {
        const width = window.innerWidth;
        const newBreakpoint = this.getBreakpointForWidth(width);
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.previousBreakpoint = this.currentBreakpoint;
            this.currentBreakpoint = newBreakpoint;
            
            // Update body class
            this.updateBodyClass();
            
            // Emit breakpoint change event
            this.emit('breakpoint:change', {
                current: this.currentBreakpoint,
                previous: this.previousBreakpoint,
                width: width
            });
        }
    }

    /**
     * Get breakpoint for given width
     */
    getBreakpointForWidth(width) {
        if (width < this.breakpoints.mobile) {
            return 'mobile';
        } else if (width < this.breakpoints.tablet) {
            return 'tablet';
        } else if (width < this.breakpoints.desktop) {
            return 'desktop';
        } else {
            return 'large';
        }
    }

    /**
     * Update body class with current breakpoint
     */
    updateBodyClass() {
        const body = document.body;
        
        // Remove previous breakpoint classes
        Object.keys(this.breakpoints).forEach(bp => {
            body.classList.remove(`bp-${bp}`);
        });
        body.classList.remove('bp-large');
        
        // Add current breakpoint class
        body.classList.add(`bp-${this.currentBreakpoint}`);
        
        // Add orientation class
        const orientation = this.getOrientation();
        body.classList.remove('orientation-portrait', 'orientation-landscape');
        body.classList.add(`orientation-${orientation}`);
        
        // Add device type class
        const deviceType = this.getDeviceType();
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        body.classList.add(`device-${deviceType}`);
    }

    /**
     * Set CSS custom properties for breakpoints
     */
    setCSSBreakpoints() {
        const root = document.documentElement;
        
        Object.entries(this.breakpoints).forEach(([name, value]) => {
            root.style.setProperty(`--breakpoint-${name}`, `${value}px`);
        });
    }

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }

    /**
     * Get previous breakpoint
     */
    getPreviousBreakpoint() {
        return this.previousBreakpoint;
    }

    /**
     * Check if current breakpoint matches
     */
    is(breakpoint) {
        return this.currentBreakpoint === breakpoint;
    }

    /**
     * Check if current breakpoint is at least the specified one
     */
    isAtLeast(breakpoint) {
        const breakpointOrder = ['mobile', 'tablet', 'desktop', 'large'];
        const currentIndex = breakpointOrder.indexOf(this.currentBreakpoint);
        const targetIndex = breakpointOrder.indexOf(breakpoint);
        
        return currentIndex >= targetIndex;
    }

    /**
     * Check if current breakpoint is at most the specified one
     */
    isAtMost(breakpoint) {
        const breakpointOrder = ['mobile', 'tablet', 'desktop', 'large'];
        const currentIndex = breakpointOrder.indexOf(this.currentBreakpoint);
        const targetIndex = breakpointOrder.indexOf(breakpoint);
        
        return currentIndex <= targetIndex;
    }

    /**
     * Get viewport information
     */
    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint,
            orientation: this.getOrientation(),
            deviceType: this.getDeviceType(),
            pixelRatio: window.devicePixelRatio || 1,
            isTouch: this.isTouchDevice(),
            isRetina: (window.devicePixelRatio || 1) > 1
        };
    }

    /**
     * Get orientation
     */
    getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    /**
     * Get device type
     */
    getDeviceType() {
        if (this.currentBreakpoint === 'mobile') {
            return 'mobile';
        } else if (this.currentBreakpoint === 'tablet') {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * Get orientation information
     */
    getOrientationInfo() {
        return {
            orientation: this.getOrientation(),
            angle: screen.orientation ? screen.orientation.angle : 0,
            type: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }

    /**
     * Check if device supports touch
     */
    isTouchDevice() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    }

    /**
     * Check if device is mobile
     */
    isMobile() {
        return this.currentBreakpoint === 'mobile';
    }

    /**
     * Check if device is tablet
     */
    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }

    /**
     * Check if device is desktop
     */
    isDesktop() {
        return this.currentBreakpoint === 'desktop' || this.currentBreakpoint === 'large';
    }

    /**
     * Get safe area insets (for devices with notches)
     */
    getSafeAreaInsets() {
        const style = getComputedStyle(document.documentElement);
        
        return {
            top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
            right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
            bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
            left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
        };
    }

    /**
     * Add event listener
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (!this.listeners.has(event)) {
            return false;
        }
        
        const listeners = this.listeners.get(event);
        const index = listeners.indexOf(callback);
        
        if (index !== -1) {
            listeners.splice(index, 1);
            return true;
        }
        
        return false;
    }

    /**
     * Emit event
     */
    emit(event, data) {
        if (!this.listeners.has(event)) {
            return;
        }
        
        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[ResponsiveManager] Error in listener for '${event}':`, error);
            }
        });
    }

    /**
     * Create media query matcher
     */
    createMediaQuery(query) {
        if (!window.matchMedia) {
            return null;
        }
        
        const mediaQuery = window.matchMedia(query);
        
        return {
            matches: mediaQuery.matches,
            addListener: (callback) => {
                mediaQuery.addListener(callback);
                return () => mediaQuery.removeListener(callback);
            },
            removeListener: (callback) => mediaQuery.removeListener(callback)
        };
    }

    /**
     * Watch for specific breakpoint
     */
    watchBreakpoint(breakpoint, callback) {
        const checkBreakpoint = () => {
            if (this.is(breakpoint)) {
                callback(true);
            } else {
                callback(false);
            }
        };
        
        // Call immediately
        checkBreakpoint();
        
        // Watch for changes
        return this.on('breakpoint:change', checkBreakpoint);
    }

    /**
     * Execute callback when breakpoint matches
     */
    when(breakpoint, callback) {
        if (this.is(breakpoint)) {
            callback();
        }
        
        return this.on('breakpoint:change', () => {
            if (this.is(breakpoint)) {
                callback();
            }
        });
    }

    /**
     * Get CSS media query for breakpoint
     */
    getMediaQuery(breakpoint) {
        const width = this.breakpoints[breakpoint];
        if (!width) {
            return null;
        }
        
        switch (breakpoint) {
            case 'mobile':
                return `(max-width: ${width - 1}px)`;
            case 'tablet':
                return `(min-width: ${this.breakpoints.mobile}px) and (max-width: ${width - 1}px)`;
            case 'desktop':
                return `(min-width: ${this.breakpoints.tablet}px) and (max-width: ${width - 1}px)`;
            case 'large':
                return `(min-width: ${this.breakpoints.desktop}px)`;
            default:
                return null;
        }
    }

    /**
     * Destroy responsive manager
     */
    destroy() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
        
        this.listeners.clear();
    }
}

// Export for use in other modules
window.ResponsiveManager = ResponsiveManager;

