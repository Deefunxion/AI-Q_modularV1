/**
 * Scribble Saga Enhanced Module (Clean Version) - AI Orchestrator's Ascent
 * 
 * Professional UI layer που επεκτείνει το ScribbleSagaModule
 * με FontAwesome icons και enhanced interface χωρίς code duplication.
 */

class ScribbleSagaEnhancedModule extends ScribbleSagaModule {
    constructor(app) {
        super(app);
        
        // Initialize Icon Manager για professional UI
        this.iconManager = new IconManager();
        
        // Add professional icon mappings to existing creative levels
        this.enhanceCreativeLevelsWithIcons();
        
        console.log('🎨 Scribble Saga Enhanced Module initialized with FontAwesome icons');
    }

    /**
     * Add FontAwesome icons to existing creative levels
     */
    enhanceCreativeLevelsWithIcons() {
        // Only add icons without changing the core data
        if (this.creativeLevels) {
            Object.keys(this.creativeLevels).forEach(levelKey => {
                this.creativeLevels[levelKey].icon = this.iconManager.getIcon('levels', levelKey);
            });
        }
    }

    /**
     * Override parent init to add FontAwesome support
     */
    async init() {
        this.log('🎨 Initializing Scribble Saga Enhanced Module...');
        
        // Load FontAwesome CSS first
        await this.iconManager.loadCSS();
        
        // Initialize core functionality από parent
        await super.init();
        
        // Create enhanced UI με professional icons
        this.createEnhancedCreativeControls();
        
        this.log('✨ Scribble Saga Enhanced Module ready με FontAwesome icons!');
    }

    /**
     * Create enhanced creative controls με FontAwesome icons
     */
    createEnhancedCreativeControls() {
        // Remove any existing controls
        const existingControls = document.querySelectorAll('.scribble-saga-controls, .marginalia-controls');
        existingControls.forEach(control => control.remove());

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'scribble-saga-enhanced-controls';
        controlsContainer.innerHTML = `
            <div class="creative-header">
                <div class="panel-controls">
                    <button id="panel-lock-btn" class="panel-lock-btn" title="Lock/Unlock Panel">
                        ${this.iconManager.getIcon('ui', 'settings') || '🔒'}
                    </button>
                    <button id="panel-close-btn" class="panel-close-btn" title="Hide Panel">
                        ${this.iconManager.getIcon('ui', 'close') || '✕'}
                    </button>
                </div>
                <div class="creative-level-badge">
                    ${this.creativeLevels[this.creativeLevel].icon || ''}
                    <div class="level-info">
                        <span class="level-number">Level ${this.creativeLevel}</span>
                        <span class="level-name">${this.creativeLevels[this.creativeLevel].name}</span>
                    </div>
                </div>
                <div class="creative-xp-bar">
                    <div class="xp-icon">${this.iconManager.getIcon('ui', 'xp')}</div>
                    <div class="xp-progress">
                        <div class="xp-fill" style="width: ${this.getXPProgress()}%"></div>
                        <span class="xp-text">${this.creativeXP} / ${this.getNextLevelXP()} XP</span>
                    </div>
                </div>
            </div>
            
            <div class="creative-tools-section">
                <h4>${this.iconManager.getIcon('ui', 'settings')} Creative Tools</h4>
                <div class="tools-grid">
                    ${this.generateEnhancedToolButtons()}
                </div>
            </div>
            
            <div class="creative-effects-section">
                <h4>${this.iconManager.getIcon('effects', 'glow')} Effects</h4>
                <div class="effects-grid">
                    ${this.generateEnhancedEffectButtons()}
                </div>
            </div>
            
            <div class="creative-settings-section">
                <h4>${this.iconManager.getIcon('ui', 'settings')} Settings</h4>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label>${this.iconManager.getIcon('ui', 'settings')} Color</label>
                        <input type="color" id="creative-color" value="${this.settings.strokeColor}">
                    </div>
                    <div class="setting-item">
                        <label>${this.iconManager.getIcon('ui', 'settings')} Width</label>
                        <input type="range" id="creative-width" min="1" max="20" value="${this.settings.strokeWidth}">
                    </div>
                    <div class="setting-item">
                        <label>${this.iconManager.getIcon('ui', 'settings')} Opacity</label>
                        <input type="range" id="creative-opacity" min="0.1" max="1" step="0.1" value="${this.settings.opacity}">
                    </div>
                </div>
            </div>
            
            <div class="creative-actions-section">
                <button id="save-pattern" class="btn-creative">
                    ${this.iconManager.getIcon('ui', 'save')} Save Pattern
                </button>
                <button id="clear-canvas" class="btn-creative">
                    ${this.iconManager.getIcon('ui', 'clear')} Clear
                </button>
                <button id="pattern-library" class="btn-creative">
                    ${this.iconManager.getIcon('ui', 'library')} Library
                </button>
            </div>
            
            <div class="creative-stats-section">
                <h4>${this.iconManager.getIcon('ui', 'info')} Session Stats</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        ${this.iconManager.getIcon('actions', 'stroke_complete')}
                        <span class="stat-label">Strokes:</span>
                        <span class="stat-value" id="session-strokes">${this.currentSession ? this.currentSession.strokes : 0}</span>
                    </div>
                    <div class="stat-item">
                        ${this.iconManager.getIcon('actions', 'pattern_detected')}
                        <span class="stat-label">Patterns:</span>
                        <span class="stat-value" id="patterns-detected">${this.currentSession ? this.currentSession.patterns.length : 0}</span>
                    </div>
                    <div class="stat-item">
                        ${this.iconManager.getIcon('ui', 'xp')}
                        <span class="stat-label">XP:</span>
                        <span class="stat-value" id="session-xp">${this.currentSession ? this.currentSession.xpEarned : 0}</span>
                    </div>
                </div>
            </div>
            
            <div class="creative-sparks-section">
                <h4>${this.iconManager.getIcon('ui', 'achievement')} Creative Sparks</h4>
                <div id="creative-sparks" class="sparks-list">
                    ${this.generateCreativeSparksList()}
                </div>
            </div>
            
            <div class="creative-achievements-section">
                <h4>${this.iconManager.getIcon('ui', 'achievement')} Recent Achievements</h4>
                <div id="recent-achievements" class="achievements-list">
                    <div class="achievement-item">
                        ${this.iconManager.getIcon('achievements', 'first_stroke')}
                        <div class="achievement-details">
                            <span class="achievement-title">Welcome!</span>
                            <span class="achievement-description">Start drawing to earn achievements</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(controlsContainer);
        
        // Initialize panel state
        this.panelState = {
            isLocked: false,
            isVisible: true,
            autoHideTimer: null
        };
        
        // Create floating toggle button
        this.createFloatingToggleButton();
        
        this.setupCreativeControlsEvents(controlsContainer);
        this.setupPanelBehavior(controlsContainer);
    }

    /**
     * Generate enhanced tool buttons με FontAwesome icons
     */
    generateEnhancedToolButtons() {
        const currentLevelTools = this.creativeLevels[this.creativeLevel].tools;
        const availableTools = Object.keys(this.creativeTools);
        
        return availableTools
            .filter(toolName => 
                currentLevelTools.includes(toolName) || 
                currentLevelTools.includes('all') ||
                this.unlockedTools.has(toolName)
            )
            .map(toolName => {
                const isActive = this.settings.tool === toolName;
                const isLocked = !this.unlockedTools.has(toolName) && !currentLevelTools.includes(toolName);
                
                return `
                    <button class="enhanced-tool-btn ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}" 
                            data-tool="${toolName}" 
                            title="${this.getToolDescription(toolName)}">
                        ${this.iconManager.getIcon('tools', toolName)}
                        <span class="tool-name">${this.getToolDisplayName(toolName)}</span>
                        ${isLocked ? '<span class="lock-indicator">🔒</span>' : ''}
                    </button>
                `;
            }).join('');
    }

    /**
     * Generate enhanced effect buttons με FontAwesome icons
     */
    generateEnhancedEffectButtons() {
        const currentLevelEffects = this.creativeLevels[this.creativeLevel].effects;
        const availableEffects = ['none', 'fade', 'glow', 'texture', 'shadow', 'gradient'];
        
        return availableEffects
            .filter(effectName => 
                currentLevelEffects.includes(effectName) || 
                currentLevelEffects.includes('all')
            )
            .map(effectName => {
                const isActive = this.settings.effect === effectName;
                
                return `
                    <button class="enhanced-effect-btn ${isActive ? 'active' : ''}" 
                            data-effect="${effectName}"
                            title="${effectName} effect">
                        ${this.iconManager.getIcon('effects', effectName)}
                        <span class="effect-name">${effectName}</span>
                    </button>
                `;
            }).join('');
    }

    /**
     * Get tool display name (Greek translations)
     */
    getToolDisplayName(toolName) {
        const displayNames = {
            pen: 'Στυλό',
            eraser: 'Σβήστρα',
            brush: 'Πινέλο',
            highlighter: 'Μαρκαδόρος',
            shape: 'Σχήματα',
            pattern: 'Μοτίβα',
            diagram: 'Διαγράμματα',
            flow: 'Ροές',
            smart_assist: 'AI Βοήθεια',
            pattern_generator: 'Γεννήτρια Μοτίβων'
        };
        return displayNames[toolName] || toolName;
    }

    /**
     * Get tool description
     */
    getToolDescription(toolName) {
        const tool = this.creativeTools[toolName];
        return tool ? tool.description : `${toolName} tool`;
    }

    /**
     * Setup event listeners για creative controls
     */
    setupCreativeControlsEvents(container) {
        // Tool selection
        container.addEventListener('click', (e) => {
            if (e.target.matches('[data-tool]') || e.target.closest('[data-tool]')) {
                const button = e.target.closest('[data-tool]');
                const toolName = button.dataset.tool;
                if (!button.classList.contains('locked')) {
                    this.selectTool(toolName);
                }
            }
            
            if (e.target.matches('[data-effect]') || e.target.closest('[data-effect]')) {
                const button = e.target.closest('[data-effect]');
                const effectName = button.dataset.effect;
                this.selectEffect(effectName);
            }
            
            if (e.target.id === 'save-pattern') {
                this.saveCurrentPattern();
            }
            
            if (e.target.id === 'clear-canvas') {
                this.clearCanvasWithConfirmation();
            }
            
            if (e.target.id === 'pattern-library') {
                this.openPatternLibrary();
            }
        });

        // Settings changes
        container.addEventListener('input', (e) => {
            if (e.target.id === 'creative-color') {
                this.settings.strokeColor = e.target.value;
            }
            if (e.target.id === 'creative-width') {
                this.settings.strokeWidth = e.target.value;
            }
            if (e.target.id === 'creative-opacity') {
                this.settings.opacity = e.target.value;
            }
        });
    }

    /**
     * Select tool
     */
    selectTool(toolName) {
        this.settings.tool = toolName;
        
        // Update UI
        document.querySelectorAll('.enhanced-tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === toolName);
        });
        
        this.log(`🎨 Selected tool: ${toolName}`);
    }

    /**
     * Select effect
     */
    selectEffect(effectName) {
        this.settings.effect = effectName;
        
        // Update UI
        document.querySelectorAll('.enhanced-effect-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.effect === effectName);
        });
        
        this.log(`✨ Selected effect: ${effectName}`);
    }

    /**
     * Override level up to use enhanced notification
     */
    levelUp(newLevel) {
        // Call parent level up first
        super.levelUp(newLevel);
        
        // Show enhanced level up notification
        this.showEnhancedLevelUpNotification(this.creativeLevel - 1, newLevel);
        
        // Refresh controls to show new tools
        this.createEnhancedCreativeControls();
    }

    /**
     * Show enhanced level up notification με FontAwesome icons
     */
    showEnhancedLevelUpNotification(oldLevel, newLevel) {
        const levelData = this.creativeLevels[newLevel];
        
        const notification = document.createElement('div');
        notification.className = 'scribble-saga-enhanced-level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-header">
                    ${this.iconManager.getIcon('ui', 'level_up', 'solid', 'level-up-star')}
                    <h2>Συγχαρητήρια! Level Up!</h2>
                </div>
                
                <div class="level-progression">
                    <div class="old-level">
                        ${this.creativeLevels[oldLevel] ? this.creativeLevels[oldLevel].icon : ''}
                        <span>Level ${oldLevel}</span>
                    </div>
                    <div class="arrow">${this.iconManager.getIcon('ui', 'expand')}</div>
                    <div class="new-level" style="color: ${levelData.color}">
                        ${levelData.icon}
                        <span>Level ${newLevel}</span>
                    </div>
                </div>
                
                <div class="level-details">
                    <h3>${levelData.name}</h3>
                    <p>${levelData.description}</p>
                </div>
                
                <button class="continue-btn" onclick="this.parentElement.parentElement.remove()">
                    ${this.iconManager.getIcon('ui', 'close')} Συνέχεια
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 500);
            }
        }, 8000);
    }

    /**
     * Override pattern detection to add UI feedback
     */
    onPatternDetected(pattern) {
        // Call parent method
        super.onPatternDetected(pattern);
        
        // Add to recent achievements UI
        this.addRecentAchievement(
            'pattern_master',
            `Pattern Detected: ${pattern.type}`,
            `Confidence: ${Math.round(pattern.confidence * 100)}%`
        );
        
        // Update session stats display
        this.updateSessionStats();
    }

    /**
     * Add achievement to recent achievements list
     */
    addRecentAchievement(achievementType, title, description) {
        const achievementsList = document.getElementById('recent-achievements');
        if (!achievementsList) return;
        
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-item new-achievement';
        achievementElement.innerHTML = `
            ${this.iconManager.getIcon('achievements', achievementType)}
            <div class="achievement-details">
                <span class="achievement-title">${title}</span>
                <span class="achievement-description">${description}</span>
            </div>
            <div class="achievement-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        // Add to top of list
        achievementsList.insertBefore(achievementElement, achievementsList.firstChild);
        
        // Keep only last 5 achievements
        while (achievementsList.children.length > 5) {
            achievementsList.removeChild(achievementsList.lastChild);
        }
        
        // Remove highlight after 2 seconds
        setTimeout(() => achievementElement.classList.remove('new-achievement'), 2000);
    }

    /**
     * Update session statistics display
     */
    updateSessionStats() {
        const strokesEl = document.getElementById('session-strokes');
        const patternsEl = document.getElementById('patterns-detected');
        const xpEl = document.getElementById('session-xp');
        
        if (this.currentSession) {
            if (strokesEl) strokesEl.textContent = this.currentSession.strokes;
            if (patternsEl) patternsEl.textContent = this.currentSession.patterns.length;
            if (xpEl) xpEl.textContent = this.currentSession.xpEarned;
        }
    }

    /**
     * Placeholder methods για future implementation
     */
    saveCurrentPattern() {
        alert('💾 Save Pattern feature coming soon!');
    }

    clearCanvasWithConfirmation() {
        if (confirm('🗑️ Clear all drawings? This cannot be undone.')) {
            this.clearAnnotations();
        }
    }

    openPatternLibrary() {
        alert('📚 Pattern Library feature coming soon!');
    }
    
    /**
     * Generate Creative Sparks list HTML
     */
    generateCreativeSparksList() {
        if (!this.currentSession || !this.currentSession.creativeSparks) {
            return '<div class="spark-item">No creative sparks available</div>';
        }
        
        return this.currentSession.creativeSparks.map(spark => {
            const difficultyColors = {
                'easy': '#22c55e',
                'medium': '#f59e0b', 
                'hard': '#ef4444'
            };
            
            return `
                <div class="spark-item" data-spark-id="${spark.id}">
                    <div class="spark-header">
                        <div class="spark-title">
                            ${this.iconManager.getIcon('ui', 'achievement')}
                            <span>${spark.title}</span>
                        </div>
                        <div class="spark-difficulty" style="color: ${difficultyColors[spark.difficulty]};">
                            ${spark.difficulty}
                        </div>
                    </div>
                    <div class="spark-description">${spark.description}</div>
                    <div class="spark-footer">
                        <span class="spark-xp">+${spark.xpReward} XP</span>
                        <button class="spark-try-btn" onclick="window.scribbleSagaDemo.tryCreativeSpark('${spark.id}')">
                            Δοκίμασε
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Try a creative spark challenge
     */
    tryCreativeSpark(sparkId) {
        const spark = this.currentSession.creativeSparks.find(s => s.id === sparkId);
        if (!spark) return;
        
        // Mark as attempted
        spark.attempted = true;
        spark.attemptedAt = Date.now();
        
        // Show challenge modal
        this.showCreativeSparkChallenge(spark);
        
        // Track in session
        if (!this.currentSession.attemptedSparks) {
            this.currentSession.attemptedSparks = [];
        }
        this.currentSession.attemptedSparks.push(sparkId);
        
        this.log(`🎯 Creative spark attempted: ${spark.title}`);
    }
    
    /**
     * Show creative spark challenge modal
     */
    showCreativeSparkChallenge(spark) {
        const modal = document.createElement('div');
        modal.className = 'creative-spark-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: modalFadeIn 0.3s ease-out;
        `;
        
        const difficultyEmojis = {
            'easy': '🌱',
            'medium': '🌟',
            'hard': '🚀'
        };
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 48px; margin-bottom: 1rem;">
                    ${difficultyEmojis[spark.difficulty]}
                </div>
                <h2 style="margin: 0 0 1rem 0; color: #1e293b;">
                    ${spark.title}
                </h2>
                <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 2rem;">
                    ${spark.description}
                </p>
                <div style="margin-bottom: 2rem;">
                    <span style="
                        background: linear-gradient(135deg, #3b82f6, #1e40af);
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        font-weight: 600;
                        font-size: 14px;
                    ">
                        Reward: +${spark.xpReward} XP
                    </span>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        padding: 0.75rem 1.5rem;
                        border: 2px solid #e2e8f0;
                        background: white;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        Αργότερα
                    </button>
                    <button onclick="window.scribbleSagaDemo.startSparkChallenge('${spark.id}'); this.parentElement.parentElement.parentElement.remove();" style="
                        padding: 0.75rem 1.5rem;
                        background: linear-gradient(135deg, #3b82f6, #1e40af);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        Ξεκίνα Τώρα!
                    </button>
                </div>
            </div>
        `;
        
        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Clean up style when modal is removed
        modal.addEventListener('remove', () => {
            if (style.parentNode) style.remove();
        });
    }
    
    /**
     * Start a spark challenge
     */
    startSparkChallenge(sparkId) {
        const spark = this.currentSession.creativeSparks.find(s => s.id === sparkId);
        if (!spark) return;
        
        // Mark as active
        this.activeSparkChallenge = spark;
        spark.startedAt = Date.now();
        
        // Show floating challenge reminder
        this.showFloatingChallengeReminder(spark);
        
        // Set up challenge completion detection
        this.setupChallengeDetection(spark);
        
        this.log(`🚀 Started creative spark challenge: ${spark.title}`);
    }
    
    /**
     * Show floating challenge reminder
     */
    showFloatingChallengeReminder(spark) {
        const reminder = document.createElement('div');
        reminder.id = 'spark-challenge-reminder';
        reminder.style.cssText = `
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-size: 14px;
            max-width: 250px;
            box-shadow: 0 8px 16px rgba(124,58,237,0.3);
            z-index: 9998;
            animation: challengePulse 2s ease-in-out infinite;
        `;
        
        reminder.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 16px;">🎯</span>
                <strong>Active Challenge</strong>
            </div>
            <div style="font-size: 13px; opacity: 0.9;">
                ${spark.title}
            </div>
            <div style="font-size: 12px; margin-top: 0.5rem; opacity: 0.8;">
                Draw to complete!
            </div>
        `;
        
        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes challengePulse {
                0%, 100% { transform: translateY(-50%) scale(1); }
                50% { transform: translateY(-50%) scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(reminder);
    }
    
    /**
     * Setup challenge completion detection
     */
    setupChallengeDetection(spark) {
        // This is a simplified version - in a real implementation,
        // you would analyze drawing patterns to detect challenge completion
        
        const checkInterval = setInterval(() => {
            if (!this.activeSparkChallenge) {
                clearInterval(checkInterval);
                return;
            }
            
            // Simple completion check based on stroke count
            const requiredStrokes = this.getRequiredStrokesForSpark(spark);
            const currentStrokes = this.currentSession.strokes;
            const strokesSinceStart = currentStrokes - (spark.strokesAtStart || currentStrokes);
            
            if (strokesSinceStart >= requiredStrokes) {
                this.completeSparkChallenge(spark);
                clearInterval(checkInterval);
            }
        }, 1000);
        
        // Store initial stroke count
        spark.strokesAtStart = this.currentSession.strokes;
    }
    
    /**
     * Get required strokes for spark completion
     */
    getRequiredStrokesForSpark(spark) {
        const strokeRequirements = {
            'single_line': 1,
            'five_circles': 5,
            'emotion_drawing': 3,
            'memory_sketch': 4,
            'opposite_hand': 2,
            'geometric_face': 6
        };
        
        return strokeRequirements[spark.id] || 3;
    }
    
    /**
     * Complete spark challenge
     */
    completeSparkChallenge(spark) {
        // Award XP
        this.awardCreativeXP('creative_milestone', spark.xpReward);
        
        // Mark as completed
        spark.completed = true;
        spark.completedAt = Date.now();
        this.activeSparkChallenge = null;
        
        // Remove floating reminder
        const reminder = document.getElementById('spark-challenge-reminder');
        if (reminder) reminder.remove();
        
        // Show completion celebration
        this.showSparkCompletionCelebration(spark);
        
        // Add achievement
        this.addRecentAchievement(
            'spark_master',
            `Challenge Completed: ${spark.title}`,
            `Earned ${spark.xpReward} XP!`
        );
        
        this.log(`🎉 Completed creative spark: ${spark.title}`);
    }
    
    /**
     * Show spark completion celebration
     */
    showSparkCompletionCelebration(spark) {
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 20px 40px rgba(34,197,94,0.3);
            z-index: 10002;
            animation: celebrationBounce 0.6s ease-out;
        `;
        
        celebration.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 1rem;">🎉</div>
            <div style="margin-bottom: 0.5rem;">Challenge Completed!</div>
            <div style="font-size: 18px; margin-bottom: 1rem;">${spark.title}</div>
            <div style="font-size: 14px; opacity: 0.9;">+${spark.xpReward} XP Earned</div>
        `;
        
        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebrationBounce {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(celebration);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            celebration.style.opacity = '0';
            celebration.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                if (celebration.parentNode) celebration.remove();
                if (style.parentNode) style.remove();
            }, 500);
        }, 3000);
    }

    /**
     * Create floating toggle button για να φέρεις πίσω το panel
     */
    createFloatingToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'floating-panel-toggle';
        toggleBtn.className = 'floating-panel-toggle hidden';
        toggleBtn.innerHTML = this.iconManager.getIcon('ui', 'settings');
        toggleBtn.title = 'Show Creative Panel';
        
        toggleBtn.style.cssText = `
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--scribble-primary), var(--scribble-secondary));
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: var(--scribble-shadow-lg);
            z-index: 1002;
            transition: var(--scribble-transition);
            opacity: 0;
            pointer-events: none;
        `;
        
        toggleBtn.addEventListener('click', () => {
            this.showPanel();
        });
        
        // Add hover effects
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'translateY(-50%) scale(1.1)';
            toggleBtn.style.boxShadow = 'var(--scribble-shadow-xl)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'translateY(-50%) scale(1)';
            toggleBtn.style.boxShadow = 'var(--scribble-shadow-lg)';
        });
        
        document.body.appendChild(toggleBtn);
    }

    /**
     * Setup panel auto-hide and lock behavior
     */
    setupPanelBehavior(container) {
        console.log('🔧 Setting up panel behavior...', container);
        
        const lockBtn = container.querySelector('#panel-lock-btn');
        const closeBtn = container.querySelector('#panel-close-btn');
        
        console.log('🔧 Found buttons:', { lockBtn, closeBtn });
        
        // Lock/unlock functionality
        if (lockBtn) {
            console.log('🔒 Setting up lock button...');
            lockBtn.addEventListener('click', (e) => {
                console.log('🔒 LOCK BUTTON CLICKED!');
                e.preventDefault();
                e.stopPropagation();
                this.togglePanelLock();
            });
        } else {
            console.error('❌ Lock button not found!');
        }
        
        // Close panel
        if (closeBtn) {
            console.log('✕ Setting up close button...');
            // Ensure button has visible content
            if (!closeBtn.innerHTML.trim()) {
                console.log('⚠️ Close button is empty, adding fallback X');
                closeBtn.innerHTML = '✕';
            }
            closeBtn.addEventListener('click', (e) => {
                console.log('✕ CLOSE BUTTON CLICKED!');
                e.preventDefault();
                e.stopPropagation();
                this.hidePanel();
            });
        } else {
            console.error('❌ Close button not found!');
        }
        
        // Lock button
        if (lockBtn) {
            // Ensure button has visible content
            if (!lockBtn.innerHTML.trim()) {
                console.log('⚠️ Lock button is empty, adding fallback gear');
                lockBtn.innerHTML = '⚙️';
            }
        }
        
        // Auto-hide behavior
        container.addEventListener('mouseenter', () => {
            this.clearAutoHideTimer();
        });
        
        container.addEventListener('mouseleave', () => {
            if (!this.panelState.isLocked) {
                this.startAutoHideTimer();
            }
        });
        
        // FIX: Mobile tap-outside-to-close behavior
        document.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile && this.panelState.isVisible && !this.panelState.isLocked) {
                const panel = document.querySelector('.scribble-saga-enhanced-controls');
                if (panel && !panel.contains(e.target)) {
                    this.hidePanel();
                }
            }
        });
        
        // Start initial auto-hide timer
        this.startAutoHideTimer();
    }
    
    /**
     * Toggle panel lock state
     */
    togglePanelLock() {
        console.log('🔒 TOGGLING PANEL LOCK...');
        this.panelState.isLocked = !this.panelState.isLocked;
        
        const lockBtn = document.querySelector('#panel-lock-btn');
        const container = document.querySelector('.scribble-saga-enhanced-controls');
        
        console.log('🔒 Lock state:', this.panelState.isLocked, { lockBtn, container });
        
        if (this.panelState.isLocked) {
            if (lockBtn) lockBtn.innerHTML = this.iconManager.getIcon('ui', 'achievement') || '🔒';
            if (lockBtn) lockBtn.title = 'Panel Locked - Click to Unlock';
            if (container) container.classList.add('panel-locked');
            this.clearAutoHideTimer();
            console.log('🔒 Panel LOCKED');
        } else {
            if (lockBtn) lockBtn.innerHTML = this.iconManager.getIcon('ui', 'settings') || '⚙️';
            if (lockBtn) lockBtn.title = 'Panel Unlocked - Click to Lock';
            if (container) container.classList.remove('panel-locked');
            this.startAutoHideTimer();
            console.log('🔓 Panel UNLOCKED');
        }
        
        this.log(`🔒 Panel ${this.panelState.isLocked ? 'locked' : 'unlocked'}`);
    }
    
    /**
     * Start auto-hide timer
     */
    startAutoHideTimer() {
        if (this.panelState.isLocked) return;
        
        this.clearAutoHideTimer();
        this.panelState.autoHideTimer = setTimeout(() => {
            this.hidePanel();
        }, 2000);
    }
    
    /**
     * Clear auto-hide timer
     */
    clearAutoHideTimer() {
        if (this.panelState.autoHideTimer) {
            clearTimeout(this.panelState.autoHideTimer);
            this.panelState.autoHideTimer = null;
        }
    }
    
    /**
     * Hide the panel
     */
    hidePanel() {
        console.log('🚫 HIDING PANEL...');
        const container = document.querySelector('.scribble-saga-enhanced-controls');
        
        if (container) {
            console.log('✅ Found container, hiding it...');
            container.style.display = 'none';
            this.panelState.isVisible = false;
            console.log('✅ Panel hidden successfully!');
        } else {
            console.error('❌ Container not found when trying to hide!');
        }
        
        // Show floating toggle button
        this.showFloatingToggle();
        this.clearAutoHideTimer();
    }
    
    showFloatingToggle() {
        let floatingBtn = document.querySelector('#floating-panel-toggle');
        if (!floatingBtn) {
            floatingBtn = document.createElement('button');
            floatingBtn.id = 'floating-panel-toggle';
            floatingBtn.innerHTML = this.iconManager.getIcon('ui', 'settings');
            floatingBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--scribble-primary);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 18px;
                cursor: pointer;
                box-shadow: var(--scribble-shadow-lg);
                z-index: 1001;
                transition: var(--scribble-transition);
            `;
            floatingBtn.addEventListener('click', () => this.showPanel());
            document.body.appendChild(floatingBtn);
        }
        floatingBtn.style.display = 'block';
    }
    
    /**
     * Show the panel
     */
    showPanel() {
        console.log('👀 SHOWING PANEL...');
        const container = document.querySelector('.scribble-saga-enhanced-controls');
        const floatingBtn = document.querySelector('#floating-panel-toggle');
        
        console.log('👀 Found elements:', { container, floatingBtn });
        
        if (container) {
            console.log('✅ Showing container...');
            container.style.display = 'block';
            this.panelState.isVisible = true;
        }
        
        // Hide floating toggle button
        if (floatingBtn) {
            floatingBtn.style.opacity = '0';
            floatingBtn.style.pointerEvents = 'none';
            console.log('✅ Hid floating button');
        }
        
        if (container) {
            container.classList.remove('panel-hidden');
            
            if (!this.panelState.isLocked) {
                this.startAutoHideTimer();
            }
            
            console.log('✅ Panel shown successfully!');
        } else {
            console.error('❌ Container not found when trying to show!');
        }
    }
    
    /**
     * Toggle panel visibility
     */
    togglePanelVisibility() {
        if (this.panelState.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    /**
     * Enhanced logging με FontAwesome styling
     */
    log(...args) {
        if (this.config && this.config.debug) {
            console.log('🎨 [ScribbleSaga Enhanced]', ...args);
        }
    }
}

// Export για module system
window.ScribbleSagaEnhancedModule = ScribbleSagaEnhancedModule;
