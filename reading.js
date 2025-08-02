/**
 * Reading Module - Interactive reading features and enhancements
 */

class readingModule {
    constructor(app) {
        this.app = app;
        this.isActive = false;
        this.readingProgress = 0;
        this.readingStartTime = null;
        this.readingStats = {
            wordsRead: 0,
            timeSpent: 0,
            averageWPM: 0
        };
        this.settings = {
            fontSize: 16,
            lineHeight: 1.6,
            fontFamily: 'Inter',
            highlightEnabled: true,
            progressTracking: true,
            readingMode: 'normal' // normal, focus, speed
        };
        
        this.elements = {
            progressBar: null,
            toolbar: null,
            settingsPanel: null,
            statsPanel: null
        };
        
        this.observers = {
            intersection: null,
            mutation: null
        };
        
        this.eventListeners = [];
    }

    /**
     * Initialize the reading module
     */
    async init() {
        try {
            this.log('Initializing reading module...');
            
            // Load settings from storage
            this.loadSettings();
            
            // Create UI elements
            this.createProgressBar();
            this.createToolbar();
            this.createSettingsPanel();
            this.createStatsPanel();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set up observers
            this.setupObservers();
            
            // Apply initial settings
            this.applySettings();
            
            this.isActive = true;
            this.log('Reading module initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize reading module:', error);
            throw error;
        }
    }

    /**
     * Initialize chapter-specific features
     */
    async initializeChapter(chapterData) {
        try {
            this.log('Initializing chapter:', chapterData.id);
            
            // Reset reading stats for new chapter
            this.resetReadingStats();
            
            // Start reading session
            this.startReadingSession();
            
            // Update progress tracking
            this.updateProgressTracking();
            
            // Apply reading enhancements
            this.applyReadingEnhancements();
            
        } catch (error) {
            console.error('Failed to initialize chapter:', error);
        }
    }

    /**
     * Create reading progress bar
     */
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress';
        progressContainer.innerHTML = `
            <div class="reading-progress-bar"></div>
        `;
        
        document.body.appendChild(progressContainer);
        this.elements.progressBar = progressContainer;
    }

    /**
     * Create reading toolbar
     */
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'reading-tools';
        toolbar.innerHTML = `
            <button class="reading-tool" data-action="settings" data-tooltip="Ρυθμίσεις Ανάγνωσης">
                <i class="fas fa-cog"></i>
            </button>
            <button class="reading-tool" data-action="highlight" data-tooltip="Επισήμανση">
                <i class="fas fa-highlighter"></i>
            </button>
            <button class="reading-tool" data-action="focus" data-tooltip="Λειτουργία Εστίασης">
                <i class="fas fa-eye"></i>
            </button>
            <button class="reading-tool" data-action="stats" data-tooltip="Στατιστικά Ανάγνωσης">
                <i class="fas fa-chart-bar"></i>
            </button>
        `;
        
        document.body.appendChild(toolbar);
        this.elements.toolbar = toolbar;
        
        // Add click handlers
        toolbar.addEventListener('click', (e) => {
            const tool = e.target.closest('.reading-tool');
            if (tool) {
                this.handleToolAction(tool.dataset.action);
            }
        });
    }

    /**
     * Create settings panel
     */
    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'reading-settings';
        panel.innerHTML = `
            <h3 class="reading-settings-title">Ρυθμίσεις Ανάγνωσης</h3>
            
            <div class="reading-setting-group">
                <label class="reading-setting-label">Μέγεθος Γραμματοσειράς</label>
                <input type="range" class="reading-setting-slider" 
                       data-setting="fontSize" min="12" max="24" value="${this.settings.fontSize}">
                <span class="reading-setting-value">${this.settings.fontSize}px</span>
            </div>
            
            <div class="reading-setting-group">
                <label class="reading-setting-label">Ύψος Γραμμής</label>
                <input type="range" class="reading-setting-slider" 
                       data-setting="lineHeight" min="1.2" max="2.0" step="0.1" value="${this.settings.lineHeight}">
                <span class="reading-setting-value">${this.settings.lineHeight}</span>
            </div>
            
            <div class="reading-setting-group">
                <label class="reading-setting-label">Γραμματοσειρά</label>
                <select class="form-select" data-setting="fontFamily">
                    <option value="Inter" ${this.settings.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                    <option value="Georgia" ${this.settings.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                    <option value="Times New Roman" ${this.settings.fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                    <option value="Arial" ${this.settings.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                </select>
            </div>
            
            <div class="reading-setting-group">
                <label class="reading-setting-label">
                    <input type="checkbox" data-setting="highlightEnabled" 
                           ${this.settings.highlightEnabled ? 'checked' : ''}>
                    Ενεργοποίηση Επισήμανσης
                </label>
            </div>
            
            <div class="reading-setting-group">
                <label class="reading-setting-label">
                    <input type="checkbox" data-setting="progressTracking" 
                           ${this.settings.progressTracking ? 'checked' : ''}>
                    Παρακολούθηση Προόδου
                </label>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.elements.settingsPanel = panel;
        
        // Add change handlers
        panel.addEventListener('change', (e) => {
            this.handleSettingChange(e.target);
        });
        
        panel.addEventListener('input', (e) => {
            if (e.target.type === 'range') {
                this.handleSettingChange(e.target);
            }
        });
    }

    /**
     * Create stats panel
     */
    createStatsPanel() {
        const panel = document.createElement('div');
        panel.className = 'reading-stats';
        panel.innerHTML = `
            <div class="reading-stats-item">
                <span class="reading-stats-label">Λέξεις:</span>
                <span class="reading-stats-value" data-stat="wordsRead">0</span>
            </div>
            <div class="reading-stats-item">
                <span class="reading-stats-label">Χρόνος:</span>
                <span class="reading-stats-value" data-stat="timeSpent">0:00</span>
            </div>
            <div class="reading-stats-item">
                <span class="reading-stats-label">WPM:</span>
                <span class="reading-stats-value" data-stat="averageWPM">0</span>
            </div>
            <div class="reading-stats-item">
                <span class="reading-stats-label">Πρόοδος:</span>
                <span class="reading-stats-value" data-stat="progress">0%</span>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.elements.statsPanel = panel;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Scroll event for progress tracking
        const scrollHandler = this.throttle(() => {
            this.updateReadingProgress();
        }, 100);
        
        window.addEventListener('scroll', scrollHandler);
        this.eventListeners.push(['scroll', scrollHandler]);
        
        // Visibility change for reading session tracking
        const visibilityHandler = () => {
            if (document.hidden) {
                this.pauseReadingSession();
            } else {
                this.resumeReadingSession();
            }
        };
        
        document.addEventListener('visibilitychange', visibilityHandler);
        this.eventListeners.push(['visibilitychange', visibilityHandler]);
        
        // Text selection for highlighting
        const selectionHandler = () => {
            if (this.settings.highlightEnabled) {
                this.handleTextSelection();
            }
        };
        
        document.addEventListener('mouseup', selectionHandler);
        this.eventListeners.push(['mouseup', selectionHandler]);
        
        // Keyboard shortcuts
        const keyHandler = (e) => {
            this.handleKeyboardShortcuts(e);
        };
        
        document.addEventListener('keydown', keyHandler);
        this.eventListeners.push(['keydown', keyHandler]);
        
        // Show/hide toolbar based on scroll
        let lastScrollY = window.scrollY;
        const toolbarHandler = this.throttle(() => {
            const currentScrollY = window.scrollY;
            const toolbar = this.elements.toolbar;
            
            if (currentScrollY > 100) {
                toolbar.classList.add('visible');
            } else {
                toolbar.classList.remove('visible');
            }
            
            lastScrollY = currentScrollY;
        }, 100);
        
        window.addEventListener('scroll', toolbarHandler);
        this.eventListeners.push(['scroll', toolbarHandler]);
    }

    /**
     * Setup observers
     */
    setupObservers() {
        // Intersection observer for reading progress
        this.observers.intersection = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackReadingProgress(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50% 0px'
        });
        
        // Observe all paragraphs
        const paragraphs = document.querySelectorAll('.reading-content-wrapper p');
        paragraphs.forEach(p => {
            this.observers.intersection.observe(p);
        });
        
        // Mutation observer for dynamic content
        this.observers.mutation = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const paragraphs = node.querySelectorAll('p');
                            paragraphs.forEach(p => {
                                this.observers.intersection.observe(p);
                            });
                        }
                    });
                }
            });
        });
        
        const contentWrapper = document.querySelector('.reading-content-wrapper');
        if (contentWrapper) {
            this.observers.mutation.observe(contentWrapper, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Handle tool actions
     */
    handleToolAction(action) {
        switch (action) {
            case 'settings':
                this.toggleSettingsPanel();
                break;
            case 'highlight':
                this.toggleHighlightMode();
                break;
            case 'focus':
                this.toggleFocusMode();
                break;
            case 'stats':
                this.toggleStatsPanel();
                break;
        }
    }

    /**
     * Handle setting changes
     */
    handleSettingChange(input) {
        const setting = input.dataset.setting;
        let value = input.value;
        
        if (input.type === 'checkbox') {
            value = input.checked;
        } else if (input.type === 'range') {
            value = parseFloat(value);
        }
        
        this.settings[setting] = value;
        this.applySettings();
        this.saveSettings();
        
        // Update value display for range inputs
        if (input.type === 'range') {
            const valueDisplay = input.parentNode.querySelector('.reading-setting-value');
            if (valueDisplay) {
                const unit = setting === 'fontSize' ? 'px' : '';
                valueDisplay.textContent = value + unit;
            }
        }
    }

    /**
     * Apply reading settings
     */
    applySettings() {
        const contentWrapper = document.querySelector('.reading-content-wrapper');
        if (!contentWrapper) return;
        
        contentWrapper.style.fontSize = `${this.settings.fontSize}px`;
        contentWrapper.style.lineHeight = this.settings.lineHeight;
        contentWrapper.style.fontFamily = this.settings.fontFamily;
        
        // Update progress bar visibility
        if (this.elements.progressBar) {
            this.elements.progressBar.style.display = 
                this.settings.progressTracking ? 'block' : 'none';
        }
    }

    /**
     * Apply reading enhancements
     */
    applyReadingEnhancements() {
        const contentWrapper = document.querySelector('.reading-content-wrapper');
        if (!contentWrapper) return;
        
        // Add reading enhancement classes
        contentWrapper.classList.add('reading-enhanced');
        
        // Add paragraph numbering for progress tracking
        const paragraphs = contentWrapper.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
            p.dataset.paragraphIndex = index;
        });
    }

    /**
     * Start reading session
     */
    startReadingSession() {
        this.readingStartTime = Date.now();
        this.updateReadingStats();
    }

    /**
     * Pause reading session
     */
    pauseReadingSession() {
        if (this.readingStartTime) {
            const sessionTime = Date.now() - this.readingStartTime;
            this.readingStats.timeSpent += sessionTime;
            this.readingStartTime = null;
        }
    }

    /**
     * Resume reading session
     */
    resumeReadingSession() {
        this.readingStartTime = Date.now();
    }

    /**
     * Reset reading stats
     */
    resetReadingStats() {
        this.readingStats = {
            wordsRead: 0,
            timeSpent: 0,
            averageWPM: 0
        };
        this.readingProgress = 0;
        this.updateStatsDisplay();
    }

    /**
     * Update reading progress
     */
    updateReadingProgress() {
        const contentWrapper = document.querySelector('.reading-content-wrapper');
        if (!contentWrapper) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        
        this.readingProgress = progress;
        
        // Update progress bar
        const progressBar = this.elements.progressBar?.querySelector('.reading-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Update stats
        this.updateStatsDisplay();
    }

    /**
     * Track reading progress for specific elements
     */
    trackReadingProgress(element) {
        if (!element.dataset.read) {
            element.dataset.read = 'true';
            
            // Count words in this element
            const text = element.textContent || '';
            const words = text.trim().split(/\s+/).length;
            this.readingStats.wordsRead += words;
            
            this.updateReadingStats();
        }
    }

    /**
     * Update reading statistics
     */
    updateReadingStats() {
        const currentTime = Date.now();
        let totalTime = this.readingStats.timeSpent;
        
        if (this.readingStartTime) {
            totalTime += currentTime - this.readingStartTime;
        }
        
        // Calculate WPM
        const minutes = totalTime / (1000 * 60);
        this.readingStats.averageWPM = minutes > 0 ? 
            Math.round(this.readingStats.wordsRead / minutes) : 0;
        
        this.updateStatsDisplay();
    }

    /**
     * Update stats display
     */
    updateStatsDisplay() {
        const statsPanel = this.elements.statsPanel;
        if (!statsPanel) return;
        
        const wordsElement = statsPanel.querySelector('[data-stat="wordsRead"]');
        const timeElement = statsPanel.querySelector('[data-stat="timeSpent"]');
        const wpmElement = statsPanel.querySelector('[data-stat="averageWPM"]');
        const progressElement = statsPanel.querySelector('[data-stat="progress"]');
        
        if (wordsElement) {
            wordsElement.textContent = this.readingStats.wordsRead.toLocaleString();
        }
        
        if (timeElement) {
            const totalTime = this.readingStats.timeSpent + 
                (this.readingStartTime ? Date.now() - this.readingStartTime : 0);
            const minutes = Math.floor(totalTime / (1000 * 60));
            const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
            timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (wpmElement) {
            wpmElement.textContent = this.readingStats.averageWPM;
        }
        
        if (progressElement) {
            progressElement.textContent = `${Math.round(this.readingProgress)}%`;
        }
    }

    /**
     * Handle text selection for highlighting
     */
    handleTextSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.isCollapsed) return;
        
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString().trim();
        
        if (selectedText.length < 3) return;
        
        // Create highlight element
        const highlight = document.createElement('span');
        highlight.className = 'reading-highlight';
        highlight.title = 'Κάντε κλικ για να αφαιρέσετε την επισήμανση';
        
        try {
            range.surroundContents(highlight);
            selection.removeAllRanges();
            
            // Add click handler to remove highlight
            highlight.addEventListener('click', () => {
                this.removeHighlight(highlight);
            });
            
        } catch (error) {
            // Handle complex selections
            console.warn('Could not highlight complex selection:', error);
        }
    }

    /**
     * Remove highlight
     */
    removeHighlight(highlight) {
        const parent = highlight.parentNode;
        while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
        parent.normalize();
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'h':
                    e.preventDefault();
                    this.toggleHighlightMode();
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFocusMode();
                    break;
                case ',':
                    e.preventDefault();
                    this.toggleSettingsPanel();
                    break;
            }
        }
    }

    /**
     * Toggle settings panel
     */
    toggleSettingsPanel() {
        const panel = this.elements.settingsPanel;
        panel.classList.toggle('visible');
        
        // Close other panels
        this.elements.statsPanel?.classList.remove('visible');
    }

    /**
     * Toggle stats panel
     */
    toggleStatsPanel() {
        const panel = this.elements.statsPanel;
        panel.classList.toggle('visible');
        
        // Close other panels
        this.elements.settingsPanel?.classList.remove('visible');
    }

    /**
     * Toggle highlight mode
     */
    toggleHighlightMode() {
        this.settings.highlightEnabled = !this.settings.highlightEnabled;
        this.saveSettings();
        
        const tool = this.elements.toolbar?.querySelector('[data-action="highlight"]');
        if (tool) {
            tool.classList.toggle('active', this.settings.highlightEnabled);
        }
    }

    /**
     * Toggle focus mode
     */
    toggleFocusMode() {
        const body = document.body;
        const isFocusMode = body.classList.contains('reading-focus-mode');
        
        body.classList.toggle('reading-focus-mode', !isFocusMode);
        
        const tool = this.elements.toolbar?.querySelector('[data-action="focus"]');
        if (tool) {
            tool.classList.toggle('active', !isFocusMode);
        }
    }

    /**
     * Update progress tracking
     */
    updateProgressTracking() {
        if (!this.settings.progressTracking) return;
        
        // Show progress bar
        if (this.elements.progressBar) {
            this.elements.progressBar.classList.remove('hidden');
        }
        
        // Initial progress calculation
        this.updateReadingProgress();
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('aiOrchestrator:reading:settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load reading settings:', error);
        }
    }

    /**
     * Save settings to storage
     */
    saveSettings() {
        try {
            localStorage.setItem('aiOrchestrator:reading:settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save reading settings:', error);
        }
    }

    /**
     * Responsive change handler
     */
    onResponsiveChange(breakpoint) {
        // Adjust UI for different screen sizes
        if (breakpoint === 'mobile') {
            this.elements.toolbar?.classList.add('mobile-layout');
            this.elements.settingsPanel?.classList.add('mobile-layout');
            this.elements.statsPanel?.classList.add('mobile-layout');
        } else {
            this.elements.toolbar?.classList.remove('mobile-layout');
            this.elements.settingsPanel?.classList.remove('mobile-layout');
            this.elements.statsPanel?.classList.remove('mobile-layout');
        }
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Logging
     */
    log(...args) {
        if (this.app?.config?.debug) {
            console.log('[ReadingModule]', ...args);
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners
        this.eventListeners.forEach(([event, handler]) => {
            if (event === 'scroll' || event === 'keydown' || event === 'mouseup') {
                window.removeEventListener(event, handler);
            } else {
                document.removeEventListener(event, handler);
            }
        });
        
        // Disconnect observers
        if (this.observers.intersection) {
            this.observers.intersection.disconnect();
        }
        if (this.observers.mutation) {
            this.observers.mutation.disconnect();
        }
        
        // Remove UI elements
        Object.values(this.elements).forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        // Save final stats
        this.pauseReadingSession();
        
        this.isActive = false;
        this.log('Reading module destroyed');
    }
}

// Export module
window.readingModule = readingModule;

