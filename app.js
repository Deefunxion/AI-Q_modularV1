/**
 * AI Orchestrator's Ascent - Core Application
 * 
 * This is the main application controller that manages the entire platform.
 * It implements a modular architecture that supports both current features
 * and future Blueprint features.
 */

(function(window) {
    'use strict';

    // Global application namespace
    const AIOrchestrator = {
        // Application state
        state: {
            initialized: false,
            currentChapter: null,
            activeModules: new Set(),
            config: {},
            user: {
                progress: {},
                preferences: {}
            }
        },

        // Core systems
        modules: new Map(),
        eventManager: null,
        contentManager: null,
        responsiveManager: null,

        // Configuration
        config: {
            debug: false,
            apiEndpoint: '/api',
            contentPath: '/data',
            modulePath: '/js/modules',
            version: '1.0.0',
            
            // Feature flags for Blueprint features
            features: {
                leaderboards: false,
                avatarSystem: false,
                creativeEngine: false,
                economySystem: false,
                // Current features
                interactiveReading: true,
                marginalia: true,
                aiqSystem: true
            },

            // Responsive breakpoints
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1280
            },

            // Performance settings
            performance: {
                lazyLoadModules: true,
                preloadContent: true,
                enableServiceWorker: false
            }
        },

        /**
         * Initialize the application
         */
        async init() {
            try {
                this.log('Initializing AI Orchestrator\'s Ascent...');
                
                // Initialize core systems
                await this.initializeCore();
                
                // Load configuration
                await this.loadConfiguration();
                
                // Initialize responsive manager
                this.initializeResponsiveManager();
                
                // Initialize event manager
                this.initializeEventManager();
                
                // Initialize content manager
                await this.initializeContentManager();
                
                // Load and initialize modules
                await this.loadModules();
                
                // Load initial content
                await this.loadInitialContent();
                
                // Mark as initialized
                this.state.initialized = true;
                
                // Hide loading screen
                this.hideLoadingScreen();
                
                // Emit ready event
                this.emit('app:ready');
                
                this.log('Application initialized successfully');
                
            } catch (error) {
                this.handleError('Failed to initialize application', error);
            }
        },

        /**
         * Initialize core systems
         */
        async initializeCore() {
            // Set up error handling
            this.setupErrorHandling();
            
            // Initialize state from localStorage if available
            this.loadStateFromStorage();
            
            // Set up performance monitoring
            this.setupPerformanceMonitoring();
        },

        /**
         * Load application configuration
         */
        async loadConfiguration() {
            try {
                // Try to load configuration from server
                const response = await fetch('/config.json');
                if (response.ok) {
                    const serverConfig = await response.json();
                    this.config = { ...this.config, ...serverConfig };
                }
            } catch (error) {
                this.log('Using default configuration (server config not available)');
            }
        },

        /**
         * Initialize responsive manager
         */
        initializeResponsiveManager() {
            this.responsiveManager = new ResponsiveManager(this.config.breakpoints);
            this.responsiveManager.on('breakpoint:change', (breakpoint) => {
                this.emit('responsive:change', breakpoint);
                this.handleResponsiveChange(breakpoint);
            });
        },

        /**
         * Initialize event manager
         */
        initializeEventManager() {
            this.eventManager = new EventManager();
            
            // Set up global event listeners
            this.setupGlobalEventListeners();
        },

        /**
         * Initialize content manager
         */
        async initializeContentManager() {
            if (typeof ContentManager === 'undefined') {
                throw new Error('ContentManager class not found. Make sure content-manager.js is loaded.');
            }
            
            this.contentManager = new ContentManager({
                contentPath: this.config.contentPath,
                preload: this.config.performance.preloadContent
            });
            
            await this.contentManager.init();
        },

        /**
         * Load and initialize modules
         */
        async loadModules() {
            const modulePromises = [];
            
            // Load core modules based on feature flags
            if (this.config.features.interactiveReading) {
                modulePromises.push(this.loadModule('interactive-reading'));
            }
            
            if (this.config.features.marginalia) {
                modulePromises.push(this.loadModule('marginalia'));
            }
            
            if (this.config.features.aiqSystem) {
                modulePromises.push(this.loadModule('aiq'));
            }
            
            // Always load navigation module
            modulePromises.push(this.loadModule('navigation'));
            
            // Load Blueprint modules if enabled
            if (this.config.features.leaderboards) {
                modulePromises.push(this.loadModule('leaderboard'));
            }
            
            if (this.config.features.avatarSystem) {
                modulePromises.push(this.loadModule('avatar'));
            }
            
            if (this.config.features.creativeEngine) {
                modulePromises.push(this.loadModule('creative'));
            }
            
            if (this.config.features.economySystem) {
                modulePromises.push(this.loadModule('economy'));
            }
            
            // Wait for all modules to load
            await Promise.all(modulePromises);
        },

        /**
         * Load a specific module
         */
        async loadModule(moduleName) {
            try {
                this.log(`Loading module: ${moduleName}`);
                
                // Check if module is already loaded
                if (this.modules.has(moduleName)) {
                    this.log(`Module ${moduleName} already loaded`);
                    return this.modules.get(moduleName);
                }
                
                // Load module script if not already loaded
                if (!window[`${moduleName}Module`]) {
                    await this.loadScript(`${this.config.modulePath}/${moduleName}.js`);
                }
                
                // Get module constructor
                const ModuleConstructor = window[`${moduleName}Module`];
                if (!ModuleConstructor) {
                    throw new Error(`Module constructor not found: ${moduleName}Module`);
                }
                
                // Create module instance
                const moduleInstance = new ModuleConstructor(this);
                
                // Initialize module
                await moduleInstance.init();
                
                // Store module
                this.modules.set(moduleName, moduleInstance);
                this.state.activeModules.add(moduleName);
                
                // Emit module loaded event
                this.emit('module:loaded', { name: moduleName, instance: moduleInstance });
                
                this.log(`Module ${moduleName} loaded successfully`);
                return moduleInstance;
                
            } catch (error) {
                this.handleError(`Failed to load module: ${moduleName}`, error);
                throw error;
            }
        },

        /**
         * Load initial content
         */
        async loadInitialContent() {
            try {
                // Determine what content to load
                const urlParams = new URLSearchParams(window.location.search);
                const chapterId = urlParams.get('chapter') || 'introduction';
                
                // Load the chapter
                await this.loadChapter(chapterId);
                
            } catch (error) {
                this.handleError('Failed to load initial content', error);
            }
        },

        /**
         * Load a specific chapter
         */
        async loadChapter(chapterId) {
            try {
                this.log(`Loading chapter: ${chapterId}`);
                
                // Get chapter data
                const chapterData = await this.contentManager.getChapter(chapterId);
                if (!chapterData) {
                    throw new Error(`Chapter not found: ${chapterId}`);
                }
                
                // Update state
                this.state.currentChapter = chapterId;
                
                // Render chapter content
                await this.renderChapter(chapterData);
                
                // Initialize chapter-specific features
                await this.initializeChapterFeatures(chapterData);
                
                // Update URL without page reload
                this.updateURL(chapterId);
                
                // Emit chapter loaded event
                this.emit('chapter:loaded', { id: chapterId, data: chapterData });
                
                this.log(`Chapter ${chapterId} loaded successfully`);
                
            } catch (error) {
                this.handleError(`Failed to load chapter: ${chapterId}`, error);
            }
        },

        /**
         * Render chapter content
         */
        async renderChapter(chapterData) {
            const mainContent = document.getElementById('main-content');
            if (!mainContent) {
                throw new Error('Main content container not found');
            }
            
            // Clear existing content
            mainContent.innerHTML = '';
            
            // Create content wrapper
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'content-wrapper';
            
            // Render chapter header
            if (chapterData.title) {
                const header = this.createChapterHeader(chapterData);
                contentWrapper.appendChild(header);
            }
            
            // Render chapter content
            if (chapterData.elements) {
                for (const element of chapterData.elements) {
                    const elementNode = await this.renderContentElement(element);
                    if (elementNode) {
                        contentWrapper.appendChild(elementNode);
                    }
                }
            }
            
            // Add content wrapper to main content
            mainContent.appendChild(contentWrapper);
            
            // Update SVG canvas size to match new content
            this.updateCanvasSize();
        },

        /**
         * Create chapter header
         */
        createChapterHeader(chapterData) {
            const header = document.createElement('header');
            header.className = 'chapter-header';
            
            // Add level indicator if available
            if (chapterData.level) {
                const levelBadge = document.createElement('div');
                levelBadge.className = 'badge badge-primary';
                levelBadge.textContent = chapterData.level;
                header.appendChild(levelBadge);
            }
            
            // Add title
            const title = document.createElement('h1');
            title.textContent = chapterData.title;
            header.appendChild(title);
            
            // Add description if available
            if (chapterData.description) {
                const description = document.createElement('p');
                description.className = 'lead';
                description.textContent = chapterData.description;
                header.appendChild(description);
            }
            
            return header;
        },

        /**
         * Render a content element
         */
        async renderContentElement(element) {
            switch (element.type) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    return this.createHeading(element);
                
                case 'p':
                    return this.createParagraph(element);
                
                case 'exercise-box':
                    return this.createExerciseBox(element);
                
                case 'framework-box':
                    return this.createFrameworkBox(element);
                
                case 'aiq-completion':
                    return this.createAIQCompletion(element);
                
                case 'list':
                    return this.createList(element);
                
                default:
                    this.log(`Unknown element type: ${element.type}`);
                    return null;
            }
        },

        /**
         * Create heading element
         */
        createHeading(element) {
            const heading = document.createElement(element.type);
            heading.innerHTML = element.content;
            if (element.id) {
                heading.id = element.id;
            }
            if (element.className) {
                heading.className = element.className;
            }
            return heading;
        },

        /**
         * Create paragraph element
         */
        createParagraph(element) {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = element.content;
            if (element.className) {
                paragraph.className = element.className;
            }
            return paragraph;
        },

        /**
         * Create exercise box
         */
        createExerciseBox(element) {
            const box = document.createElement('div');
            box.className = 'exercise-box';
            
            if (element.title) {
                const title = document.createElement('h4');
                title.className = 'exercise-box-title';
                title.innerHTML = element.title;
                box.appendChild(title);
            }
            
            const content = document.createElement('div');
            content.className = 'exercise-box-content';
            content.innerHTML = element.content;
            box.appendChild(content);
            
            return box;
        },

        /**
         * Create framework box
         */
        createFrameworkBox(element) {
            const box = document.createElement('div');
            box.className = 'framework-box';
            
            if (element.title) {
                const title = document.createElement('h4');
                title.className = 'framework-box-title';
                title.innerHTML = element.title;
                box.appendChild(title);
            }
            
            const content = document.createElement('div');
            content.className = 'framework-box-content';
            
            if (element.items && Array.isArray(element.items)) {
                const list = document.createElement('ul');
                list.className = 'framework-box-list';
                
                element.items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = item;
                    list.appendChild(listItem);
                });
                
                content.appendChild(list);
            } else if (element.content) {
                content.innerHTML = element.content;
            }
            
            box.appendChild(content);
            return box;
        },

        /**
         * Create AI-Q completion section
         */
        createAIQCompletion(element) {
            const section = document.createElement('div');
            section.className = 'aiq-completion-section';
            
            if (element.title) {
                const title = document.createElement('h3');
                title.className = 'aiq-completion-title';
                title.innerHTML = element.title;
                section.appendChild(title);
            }
            
            if (element.description) {
                const description = document.createElement('p');
                description.className = 'aiq-completion-description';
                description.innerHTML = element.description;
                section.appendChild(description);
            }
            
            if (element.actions && Array.isArray(element.actions)) {
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'aiq-completion-actions';
                
                element.actions.forEach(action => {
                    const button = document.createElement('button');
                    button.className = `btn ${action.variant || 'btn-primary'}`;
                    button.innerHTML = action.text;
                    
                    if (action.onClick) {
                        button.addEventListener('click', () => {
                            this.handleAIQAction(action);
                        });
                    }
                    
                    actionsContainer.appendChild(button);
                });
                
                section.appendChild(actionsContainer);
            }
            
            return section;
        },

        /**
         * Create list element
         */
        createList(element) {
            const listType = element.ordered ? 'ol' : 'ul';
            const list = document.createElement(listType);
            
            if (element.className) {
                list.className = element.className;
            }
            
            if (element.items && Array.isArray(element.items)) {
                element.items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = item;
                    list.appendChild(listItem);
                });
            }
            
            return list;
        },

        /**
         * Initialize chapter-specific features
         */
        async initializeChapterFeatures(chapterData) {
            // Initialize interactive reading features
            if (this.modules.has('reading')) {
                await this.modules.get('reading').initializeChapter(chapterData);
            }
            
            // Initialize marginalia features
            if (this.modules.has('marginalia')) {
                await this.modules.get('marginalia').initializeChapter(chapterData);
            }
            
            // Initialize AI-Q features
            if (this.modules.has('aiq')) {
                await this.modules.get('aiq').initializeChapter(chapterData);
            }
        },

        /**
         * Handle AI-Q action
         */
        handleAIQAction(action) {
            if (this.modules.has('aiq')) {
                this.modules.get('aiq').handleAction(action);
            }
        },

        /**
         * Update canvas size to match content
         */
        updateCanvasSize() {
            const marginaliaSvg = document.getElementById('marginalia-svg');
            const fullscreenCanvas = document.getElementById('fullscreen-canvas');
            
            if (marginaliaSvg || fullscreenCanvas) {
                const documentHeight = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                );
                
                if (marginaliaSvg) {
                    marginaliaSvg.style.height = `${documentHeight}px`;
                    marginaliaSvg.setAttribute('height', documentHeight);
                }
                
                if (fullscreenCanvas) {
                    fullscreenCanvas.style.height = `${documentHeight}px`;
                    fullscreenCanvas.height = documentHeight;
                }
            }
        },

        /**
         * Handle responsive changes
         */
        handleResponsiveChange(breakpoint) {
            this.log(`Responsive breakpoint changed to: ${breakpoint}`);
            
            // Notify all modules about responsive change
            this.modules.forEach(module => {
                if (module.onResponsiveChange) {
                    module.onResponsiveChange(breakpoint);
                }
            });
            
            // Update canvas size
            this.updateCanvasSize();
        },

        /**
         * Update URL without page reload
         */
        updateURL(chapterId) {
            const url = new URL(window.location);
            url.searchParams.set('chapter', chapterId);
            window.history.pushState({ chapterId }, '', url);
        },

        /**
         * Set up global event listeners
         */
        setupGlobalEventListeners() {
            // Handle browser back/forward
            window.addEventListener('popstate', (event) => {
                if (event.state && event.state.chapterId) {
                    this.loadChapter(event.state.chapterId);
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                this.updateCanvasSize();
            });
            
            // Handle visibility change
            document.addEventListener('visibilitychange', () => {
                this.emit('visibility:change', !document.hidden);
            });
        },

        /**
         * Set up error handling
         */
        setupErrorHandling() {
            window.addEventListener('error', (event) => {
                this.handleError('Global error', event.error);
            });
            
            window.addEventListener('unhandledrejection', (event) => {
                this.handleError('Unhandled promise rejection', event.reason);
            });
        },

        /**
         * Set up performance monitoring
         */
        setupPerformanceMonitoring() {
            if (this.config.debug && window.performance) {
                this.performanceMarks = new Map();
                this.mark('app:init:start');
            }
        },

        /**
         * Load state from localStorage
         */
        loadStateFromStorage() {
            try {
                const savedState = localStorage.getItem('aiOrchestrator:state');
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    this.state = { ...this.state, ...parsedState };
                }
            } catch (error) {
                this.log('Failed to load state from storage', error);
            }
        },

        /**
         * Save state to localStorage
         */
        saveStateToStorage() {
            try {
                localStorage.setItem('aiOrchestrator:state', JSON.stringify(this.state));
            } catch (error) {
                this.log('Failed to save state to storage', error);
            }
        },

        /**
         * Hide loading screen
         */
        hideLoadingScreen() {
            const loader = document.getElementById('app-loader');
            if (loader) {
                loader.classList.add('hidden');
                document.body.classList.remove('app-loading');
                
                // Remove loader from DOM after transition
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 300);
            }
        },

        /**
         * Load external script
         */
        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },

        /**
         * Performance marking
         */
        mark(name) {
            if (this.config.debug && window.performance) {
                performance.mark(name);
                this.performanceMarks.set(name, performance.now());
            }
        },

        /**
         * Measure performance
         */
        measure(name, startMark, endMark) {
            if (this.config.debug && window.performance) {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                this.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
            }
        },

        /**
         * Event system
         */
        on(event, callback) {
            if (!this.eventManager) {
                this.eventManager = new EventManager();
            }
            return this.eventManager.on(event, callback);
        },

        emit(event, data) {
            if (this.eventManager) {
                this.eventManager.emit(event, data);
            }
        },

        off(event, callback) {
            if (this.eventManager) {
                this.eventManager.off(event, callback);
            }
        },

        /**
         * Logging
         */
        log(...args) {
            if (this.config.debug) {
                console.log('[AIOrchestrator]', ...args);
            }
        },

        /**
         * Error handling
         */
        handleError(message, error) {
            console.error('[AIOrchestrator]', message, error);
            
            // Show error boundary if critical error
            if (!this.state.initialized) {
                const errorBoundary = document.getElementById('error-boundary');
                if (errorBoundary) {
                    errorBoundary.style.display = 'flex';
                }
            }
            
            // Emit error event
            this.emit('error', { message, error });
        },

        /**
         * Get module instance
         */
        getModule(name) {
            return this.modules.get(name);
        },

        /**
         * Check if module is loaded
         */
        hasModule(name) {
            return this.modules.has(name);
        },

        /**
         * Get current breakpoint
         */
        getCurrentBreakpoint() {
            return this.responsiveManager ? this.responsiveManager.getCurrentBreakpoint() : 'desktop';
        },

        /**
         * Cleanup
         */
        destroy() {
            // Cleanup modules
            this.modules.forEach(module => {
                if (module.destroy) {
                    module.destroy();
                }
            });
            
            // Cleanup event manager
            if (this.eventManager) {
                this.eventManager.destroy();
            }
            
            // Save state
            this.saveStateToStorage();
            
            // Reset state
            this.state.initialized = false;
        }
    };

    // Expose to global scope
    window.AIOrchestrator = AIOrchestrator;

})(window);

