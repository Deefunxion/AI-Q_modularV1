/**
 * AI-Q Module - Artificial Intelligence Quotient tracking and progression system
 */

class aiqModule {
    constructor(app) {
        this.app = app;
        this.isActive = false;
        this.currentAIQ = 85; // Default starting AI-Q
        this.maxAIQ = 200; // Maximum achievable AI-Q
        this.minAIQ = 0; // Minimum AI-Q
        
        // AI-Q progression tracking
        this.progression = {
            totalExercisesCompleted: 0,
            totalReadingTime: 0,
            totalWordsRead: 0,
            totalAnnotations: 0,
            streakDays: 0,
            lastActiveDate: null,
            achievements: []
        };
        
        // Exercise tracking
        this.exercises = new Map();
        this.currentExercise = null;
        
        // UI elements
        this.elements = {
            indicator: null,
            progressPanel: null,
            achievementToast: null
        };
        
        // Settings
        this.settings = {
            showIndicator: true,
            showProgressPanel: true,
            enableAchievements: true,
            autoSave: true
        };
        
        // Achievement definitions
        this.achievementDefinitions = [
            {
                id: 'first_exercise',
                name: 'Πρώτα Βήματα',
                description: 'Ολοκληρώστε την πρώτη σας άσκηση',
                icon: 'fas fa-baby',
                aiqBonus: 5,
                condition: (data) => data.totalExercisesCompleted >= 1
            },
            {
                id: 'reading_marathon',
                name: 'Μαραθώνιος Ανάγνωσης',
                description: 'Διαβάστε για 60 λεπτά συνεχόμενα',
                icon: 'fas fa-running',
                aiqBonus: 10,
                condition: (data) => data.totalReadingTime >= 3600000 // 60 minutes in ms
            },
            {
                id: 'annotation_master',
                name: 'Μάστερ Σημειώσεων',
                description: 'Δημιουργήστε 100 σημειώσεις',
                icon: 'fas fa-pen-fancy',
                aiqBonus: 15,
                condition: (data) => data.totalAnnotations >= 100
            },
            {
                id: 'streak_week',
                name: 'Εβδομαδιαίο Streak',
                description: 'Συνεχίστε για 7 μέρες',
                icon: 'fas fa-fire',
                aiqBonus: 20,
                condition: (data) => data.streakDays >= 7
            },
            {
                id: 'aiq_century',
                name: 'Εκατοντάδα AI-Q',
                description: 'Φτάστε AI-Q 100',
                icon: 'fas fa-trophy',
                aiqBonus: 25,
                condition: (data) => data.currentAIQ >= 100
            }
        ];
        
        this.eventListeners = [];
    }

    /**
     * Initialize the AI-Q module
     */
    async init() {
        try {
            this.log('Initializing AI-Q module...');
            
            // Load data from storage
            this.loadProgression();
            this.loadSettings();
            
            // Create UI elements
            this.createIndicator();
            this.createProgressPanel();
            this.createAchievementToast();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Update daily streak
            this.updateDailyStreak();
            
            // Check for new achievements
            this.checkAchievements();
            
            this.isActive = true;
            this.log('AI-Q module initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize AI-Q module:', error);
            throw error;
        }
    }

    /**
     * Create AI-Q indicator
     */
    createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'aiq-indicator';
        indicator.innerHTML = `
            <div class="aiq-indicator-content">
                <div class="aiq-indicator-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="aiq-indicator-value">${this.currentAIQ}</div>
                <div class="aiq-indicator-label">AI-Q</div>
            </div>
            <div class="aiq-indicator-progress">
                <div class="aiq-indicator-progress-bar" style="width: ${this.getProgressPercentage()}%"></div>
            </div>
        `;
        
        // Position indicator
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
            box-shadow: var(--shadow-lg);
            cursor: pointer;
            transition: all var(--transition-base);
            z-index: var(--z-sticky);
        `;
        
        document.body.appendChild(indicator);
        this.elements.indicator = indicator;
        
        // Add click handler
        indicator.addEventListener('click', () => {
            this.toggleProgressPanel();
        });
    }

    /**
     * Create progress panel
     */
    createProgressPanel() {
        const panel = document.createElement('div');
        panel.className = 'aiq-progress-panel';
        panel.innerHTML = `
            <div class="aiq-progress-header">
                <h3>AI-Q Πρόοδος</h3>
                <button class="aiq-progress-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="aiq-progress-content">
                <div class="aiq-current-level">
                    <div class="aiq-level-circle">
                        <span class="aiq-level-value">${this.currentAIQ}</span>
                        <span class="aiq-level-max">/${this.maxAIQ}</span>
                    </div>
                    <div class="aiq-level-info">
                        <h4>${this.getAIQLevel()}</h4>
                        <p>${this.getAIQLevelDescription()}</p>
                    </div>
                </div>
                
                <div class="aiq-stats-grid">
                    <div class="aiq-stat">
                        <div class="aiq-stat-icon">
                            <i class="fas fa-dumbbell"></i>
                        </div>
                        <div class="aiq-stat-content">
                            <div class="aiq-stat-value">${this.progression.totalExercisesCompleted}</div>
                            <div class="aiq-stat-label">Ασκήσεις</div>
                        </div>
                    </div>
                    
                    <div class="aiq-stat">
                        <div class="aiq-stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="aiq-stat-content">
                            <div class="aiq-stat-value">${this.formatTime(this.progression.totalReadingTime)}</div>
                            <div class="aiq-stat-label">Ανάγνωση</div>
                        </div>
                    </div>
                    
                    <div class="aiq-stat">
                        <div class="aiq-stat-icon">
                            <i class="fas fa-pen"></i>
                        </div>
                        <div class="aiq-stat-content">
                            <div class="aiq-stat-value">${this.progression.totalAnnotations}</div>
                            <div class="aiq-stat-label">Σημειώσεις</div>
                        </div>
                    </div>
                    
                    <div class="aiq-stat">
                        <div class="aiq-stat-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <div class="aiq-stat-content">
                            <div class="aiq-stat-value">${this.progression.streakDays}</div>
                            <div class="aiq-stat-label">Streak</div>
                        </div>
                    </div>
                </div>
                
                <div class="aiq-achievements">
                    <h4>Επιτεύγματα</h4>
                    <div class="aiq-achievements-grid">
                        ${this.renderAchievements()}
                    </div>
                </div>
            </div>
        `;
        
        // Style the panel
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 320px;
            max-height: 80vh;
            background: var(--theme-bg);
            border: 1px solid var(--theme-border);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
            z-index: var(--z-modal);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-50%) translateX(20px);
            transition: all var(--transition-base);
            overflow-y: auto;
        `;
        
        document.body.appendChild(panel);
        this.elements.progressPanel = panel;
        
        // Add close handler
        const closeBtn = panel.querySelector('.aiq-progress-close');
        closeBtn.addEventListener('click', () => {
            this.hideProgressPanel();
        });
    }

    /**
     * Create achievement toast
     */
    createAchievementToast() {
        const toast = document.createElement('div');
        toast.className = 'aiq-achievement-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: linear-gradient(135deg, var(--color-success), var(--color-success-dark));
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: var(--z-toast);
            opacity: 0;
            visibility: hidden;
            transform: translateX(100%);
            transition: all var(--transition-base);
        `;
        
        document.body.appendChild(toast);
        this.elements.achievementToast = toast;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for app events
        if (this.app?.events) {
            // Exercise completion
            this.app.events.on('exercise:completed', (data) => {
                this.onExerciseCompleted(data);
            });
            
            // Reading progress
            this.app.events.on('reading:progress', (data) => {
                this.onReadingProgress(data);
            });
            
            // Annotation created
            this.app.events.on('marginalia:annotation', (data) => {
                this.onAnnotationCreated(data);
            });
        }
        
        // Window events
        const beforeUnloadHandler = () => {
            this.saveProgression();
        };
        
        window.addEventListener('beforeunload', beforeUnloadHandler);
        this.eventListeners.push(['beforeunload', beforeUnloadHandler]);
    }

    /**
     * Handle exercise completion
     */
    onExerciseCompleted(exerciseData) {
        this.progression.totalExercisesCompleted++;
        
        // Calculate AI-Q bonus based on exercise difficulty and performance
        const bonus = this.calculateExerciseBonus(exerciseData);
        this.increaseAIQ(bonus);
        
        // Update daily activity
        this.updateDailyActivity();
        
        // Check for achievements
        this.checkAchievements();
        
        // Save progress
        this.saveProgression();
        
        this.log(`Exercise completed. AI-Q bonus: +${bonus}`);
    }

    /**
     * Handle reading progress
     */
    onReadingProgress(readingData) {
        if (readingData.timeSpent) {
            this.progression.totalReadingTime += readingData.timeSpent;
        }
        
        if (readingData.wordsRead) {
            this.progression.totalWordsRead += readingData.wordsRead;
        }
        
        // Small AI-Q bonus for sustained reading
        if (readingData.timeSpent > 300000) { // 5 minutes
            this.increaseAIQ(1);
        }
        
        this.updateIndicator();
        this.saveProgression();
    }

    /**
     * Handle annotation creation
     */
    onAnnotationCreated(annotationData) {
        this.progression.totalAnnotations++;
        
        // Small AI-Q bonus for active annotation
        this.increaseAIQ(0.5);
        
        this.updateIndicator();
        this.checkAchievements();
        this.saveProgression();
    }

    /**
     * Calculate exercise bonus
     */
    calculateExerciseBonus(exerciseData) {
        let bonus = 5; // Base bonus
        
        // Difficulty multiplier
        const difficultyMultiplier = {
            'easy': 1,
            'medium': 1.5,
            'hard': 2,
            'expert': 3
        };
        
        bonus *= difficultyMultiplier[exerciseData.difficulty] || 1;
        
        // Performance multiplier
        if (exerciseData.score) {
            const performanceMultiplier = exerciseData.score / 100;
            bonus *= performanceMultiplier;
        }
        
        // Time bonus (faster completion = higher bonus)
        if (exerciseData.timeSpent && exerciseData.expectedTime) {
            const timeRatio = exerciseData.expectedTime / exerciseData.timeSpent;
            if (timeRatio > 1) {
                bonus *= Math.min(timeRatio, 2); // Max 2x bonus
            }
        }
        
        return Math.round(bonus);
    }

    /**
     * Increase AI-Q
     */
    increaseAIQ(amount) {
        const oldAIQ = this.currentAIQ;
        this.currentAIQ = Math.min(this.maxAIQ, this.currentAIQ + amount);
        
        if (this.currentAIQ !== oldAIQ) {
            this.updateIndicator();
            this.updateProgressPanel();
            
            // Emit event for other modules
            if (this.app?.events) {
                this.app.events.emit('aiq:changed', {
                    oldValue: oldAIQ,
                    newValue: this.currentAIQ,
                    increase: amount
                });
            }
        }
    }

    /**
     * Decrease AI-Q (for penalties)
     */
    decreaseAIQ(amount) {
        const oldAIQ = this.currentAIQ;
        this.currentAIQ = Math.max(this.minAIQ, this.currentAIQ - amount);
        
        if (this.currentAIQ !== oldAIQ) {
            this.updateIndicator();
            this.updateProgressPanel();
            
            // Emit event for other modules
            if (this.app?.events) {
                this.app.events.emit('aiq:changed', {
                    oldValue: oldAIQ,
                    newValue: this.currentAIQ,
                    decrease: amount
                });
            }
        }
    }

    /**
     * Update daily activity and streak
     */
    updateDailyActivity() {
        const today = new Date().toDateString();
        const lastActive = this.progression.lastActiveDate;
        
        if (lastActive !== today) {
            // Check if streak continues
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActive === yesterday.toDateString()) {
                this.progression.streakDays++;
            } else if (lastActive !== today) {
                this.progression.streakDays = 1; // Reset streak
            }
            
            this.progression.lastActiveDate = today;
        }
    }

    /**
     * Update daily streak
     */
    updateDailyStreak() {
        const today = new Date().toDateString();
        const lastActive = this.progression.lastActiveDate;
        
        if (lastActive && lastActive !== today) {
            const lastActiveDate = new Date(lastActive);
            const todayDate = new Date();
            const daysDiff = Math.floor((todayDate - lastActiveDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 1) {
                // Streak broken
                this.progression.streakDays = 0;
                this.saveProgression();
            }
        }
    }

    /**
     * Check for new achievements
     */
    checkAchievements() {
        const data = {
            ...this.progression,
            currentAIQ: this.currentAIQ
        };
        
        this.achievementDefinitions.forEach(achievement => {
            if (!this.progression.achievements.includes(achievement.id)) {
                if (achievement.condition(data)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    /**
     * Unlock achievement
     */
    unlockAchievement(achievement) {
        this.progression.achievements.push(achievement.id);
        this.increaseAIQ(achievement.aiqBonus);
        
        // Show achievement toast
        this.showAchievementToast(achievement);
        
        // Emit event
        if (this.app?.events) {
            this.app.events.emit('aiq:achievement', achievement);
        }
        
        this.log(`Achievement unlocked: ${achievement.name}`);
    }

    /**
     * Show achievement toast
     */
    showAchievementToast(achievement) {
        const toast = this.elements.achievementToast;
        if (!toast) return;
        
        toast.innerHTML = `
            <div class="aiq-achievement-header">
                <i class="${achievement.icon}"></i>
                <span>Επίτευγμα Ξεκλειδώθηκε!</span>
            </div>
            <div class="aiq-achievement-content">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <div class="aiq-achievement-bonus">+${achievement.aiqBonus} AI-Q</div>
            </div>
        `;
        
        // Show toast
        toast.style.opacity = '1';
        toast.style.visibility = 'visible';
        toast.style.transform = 'translateX(0)';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.visibility = 'hidden';
            toast.style.transform = 'translateX(100%)';
        }, 5000);
    }

    /**
     * Get AI-Q level name
     */
    getAIQLevel() {
        if (this.currentAIQ < 25) return 'Αρχάριος';
        if (this.currentAIQ < 50) return 'Μαθητευόμενος';
        if (this.currentAIQ < 75) return 'Ικανός';
        if (this.currentAIQ < 100) return 'Προχωρημένος';
        if (this.currentAIQ < 125) return 'Ειδικός';
        if (this.currentAIQ < 150) return 'Εμπειρογνώμονας';
        if (this.currentAIQ < 175) return 'Μάστερ';
        return 'Γκουρού';
    }

    /**
     * Get AI-Q level description
     */
    getAIQLevelDescription() {
        const level = this.getAIQLevel();
        const descriptions = {
            'Αρχάριος': 'Μόλις ξεκινάτε το ταξίδι σας στην τεχνητή νοημοσύνη',
            'Μαθητευόμενος': 'Μαθαίνετε τα βασικά και χτίζετε τις βάσεις σας',
            'Ικανός': 'Έχετε αποκτήσει βασικές δεξιότητες και κατανόηση',
            'Προχωρημένος': 'Μπορείτε να χειριστείτε πολύπλοκα προβλήματα',
            'Ειδικός': 'Έχετε εξειδικευτεί σε συγκεκριμένους τομείς',
            'Εμπειρογνώμονας': 'Η γνώση σας είναι βαθιά και εκτεταμένη',
            'Μάστερ': 'Είστε αρχηγός στον τομέα της τεχνητής νοημοσύνης',
            'Γκουρού': 'Έχετε φτάσει στην κορυφή της γνώσης'
        };
        
        return descriptions[level] || '';
    }

    /**
     * Get progress percentage for current level
     */
    getProgressPercentage() {
        return Math.min(100, (this.currentAIQ / this.maxAIQ) * 100);
    }

    /**
     * Render achievements
     */
    renderAchievements() {
        return this.achievementDefinitions.map(achievement => {
            const unlocked = this.progression.achievements.includes(achievement.id);
            return `
                <div class="aiq-achievement ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="aiq-achievement-icon">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <div class="aiq-achievement-info">
                        <h5>${achievement.name}</h5>
                        <p>${achievement.description}</p>
                        ${unlocked ? '<span class="aiq-achievement-unlocked">✓</span>' : `<span class="aiq-achievement-bonus">+${achievement.aiqBonus} AI-Q</span>`}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Format time duration
     */
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}ω ${minutes}λ`;
        }
        return `${minutes}λ`;
    }

    /**
     * Update indicator display
     */
    updateIndicator() {
        const indicator = this.elements.indicator;
        if (!indicator) return;
        
        const valueElement = indicator.querySelector('.aiq-indicator-value');
        const progressBar = indicator.querySelector('.aiq-indicator-progress-bar');
        
        if (valueElement) {
            valueElement.textContent = Math.round(this.currentAIQ);
        }
        
        if (progressBar) {
            progressBar.style.width = `${this.getProgressPercentage()}%`;
        }
    }

    /**
     * Update progress panel
     */
    updateProgressPanel() {
        const panel = this.elements.progressPanel;
        if (!panel) return;
        
        // Update level info
        const levelValue = panel.querySelector('.aiq-level-value');
        const levelInfo = panel.querySelector('.aiq-level-info h4');
        const levelDesc = panel.querySelector('.aiq-level-info p');
        
        if (levelValue) levelValue.textContent = Math.round(this.currentAIQ);
        if (levelInfo) levelInfo.textContent = this.getAIQLevel();
        if (levelDesc) levelDesc.textContent = this.getAIQLevelDescription();
        
        // Update stats
        const stats = panel.querySelectorAll('.aiq-stat-value');
        if (stats[0]) stats[0].textContent = this.progression.totalExercisesCompleted;
        if (stats[1]) stats[1].textContent = this.formatTime(this.progression.totalReadingTime);
        if (stats[2]) stats[2].textContent = this.progression.totalAnnotations;
        if (stats[3]) stats[3].textContent = this.progression.streakDays;
        
        // Update achievements
        const achievementsGrid = panel.querySelector('.aiq-achievements-grid');
        if (achievementsGrid) {
            achievementsGrid.innerHTML = this.renderAchievements();
        }
    }

    /**
     * Toggle progress panel
     */
    toggleProgressPanel() {
        const panel = this.elements.progressPanel;
        if (!panel) return;
        
        const isVisible = panel.style.opacity === '1';
        
        if (isVisible) {
            this.hideProgressPanel();
        } else {
            this.showProgressPanel();
        }
    }

    /**
     * Show progress panel
     */
    showProgressPanel() {
        const panel = this.elements.progressPanel;
        if (!panel) return;
        
        this.updateProgressPanel();
        
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
        panel.style.transform = 'translateY(-50%) translateX(0)';
    }

    /**
     * Hide progress panel
     */
    hideProgressPanel() {
        const panel = this.elements.progressPanel;
        if (!panel) return;
        
        panel.style.opacity = '0';
        panel.style.visibility = 'hidden';
        panel.style.transform = 'translateY(-50%) translateX(20px)';
    }

    /**
     * Get current AI-Q value
     */
    getAIQ() {
        return this.currentAIQ;
    }

    /**
     * Set AI-Q value (for external updates)
     */
    setAIQ(value) {
        const oldValue = this.currentAIQ;
        this.currentAIQ = Math.max(this.minAIQ, Math.min(this.maxAIQ, value));
        
        if (this.currentAIQ !== oldValue) {
            this.updateIndicator();
            this.updateProgressPanel();
            this.saveProgression();
            
            // Emit event
            if (this.app?.events) {
                this.app.events.emit('aiq:changed', {
                    oldValue: oldValue,
                    newValue: this.currentAIQ
                });
            }
        }
    }

    /**
     * Load progression from storage
     */
    loadProgression() {
        try {
            const saved = localStorage.getItem('aiOrchestrator:aiq:progression');
            if (saved) {
                const data = JSON.parse(saved);
                this.progression = { ...this.progression, ...data };
                this.currentAIQ = data.currentAIQ || this.currentAIQ;
            }
        } catch (error) {
            console.warn('Failed to load AI-Q progression:', error);
        }
    }

    /**
     * Save progression to storage
     */
    saveProgression() {
        try {
            const data = {
                ...this.progression,
                currentAIQ: this.currentAIQ
            };
            localStorage.setItem('aiOrchestrator:aiq:progression', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save AI-Q progression:', error);
        }
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('aiOrchestrator:aiq:settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load AI-Q settings:', error);
        }
    }

    /**
     * Save settings to storage
     */
    saveSettings() {
        try {
            localStorage.setItem('aiOrchestrator:aiq:settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save AI-Q settings:', error);
        }
    }

    /**
     * Responsive change handler
     */
    onResponsiveChange(breakpoint) {
        const indicator = this.elements.indicator;
        const panel = this.elements.progressPanel;
        
        if (breakpoint === 'mobile') {
            if (indicator) {
                indicator.style.width = '60px';
                indicator.style.height = '60px';
                indicator.style.fontSize = '10px';
            }
            
            if (panel) {
                panel.style.width = '280px';
                panel.style.right = '10px';
            }
        } else {
            if (indicator) {
                indicator.style.width = '80px';
                indicator.style.height = '80px';
                indicator.style.fontSize = '12px';
            }
            
            if (panel) {
                panel.style.width = '320px';
                panel.style.right = '20px';
            }
        }
    }

    /**
     * Logging
     */
    log(...args) {
        if (this.app?.config?.debug) {
            console.log('[AIQModule]', ...args);
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Save final state
        this.saveProgression();
        
        // Remove event listeners
        this.eventListeners.forEach(([event, handler]) => {
            window.removeEventListener(event, handler);
        });
        
        // Remove UI elements
        Object.values(this.elements).forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        this.isActive = false;
        this.log('AI-Q module destroyed');
    }
}

// Export module
window.aiqModule = aiqModule;

