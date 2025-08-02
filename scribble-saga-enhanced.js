/**
 * Scribble Saga Enhanced Module - AI Orchestrator's Ascent
 * 
 * Professional Creative Pattern Engine με FontAwesome icons
 * και advanced features για το Blueprint Module 3
 */

class ScribbleSagaEnhancedModule extends ScribbleSagaModule {
    constructor(app) {
        super(app);
        
        // Initialize Icon Manager for professional UI
        this.iconManager = new IconManager();
        
        // Enhanced state already inherited from ScribbleSagaModule
        // Add professional icon mappings to existing creative levels
        this.enhanceCreativeLevelsWithIcons();
        
        console.log('🎨 Scribble Saga Enhanced Module initialized with FontAwesome icons');
    }

    /**
     * Enhance existing creative levels with FontAwesome icons
     */
    enhanceCreativeLevelsWithIcons() {
        // Add icons to each level
        this.creativeLevels[0].icon = this.iconManager.getIcon('levels', '0');
        this.creativeLevels[1].icon = this.iconManager.getIcon('levels', '1');
        this.creativeLevels[2].icon = this.iconManager.getIcon('levels', '2');
        this.creativeLevels[3].icon = this.iconManager.getIcon('levels', '3');
        this.creativeLevels[4].icon = this.iconManager.getIcon('levels', '4');
    }

    /**
     * Initialize the creative levels progression system
     */
    initializeCreativeLevels() {
        return {
            0: {
                name: 'Αρχάριος Δημιουργός',
                nameEn: 'Novice Creator', 
                description: 'Βασικά εργαλεία σχεδίασης',
                tools: ['pen', 'eraser'],
                effects: ['none'],
                xpRequired: 0,
                color: '#6b7280',
                icon: this.iconManager.getIcon('levels', '0')
            },
            1: {
                name: 'Εικονογράφος',
                nameEn: 'Illustrator',
                description: 'Χρώματα και υφές',
                tools: ['pen', 'eraser', 'brush', 'highlighter'],
                effects: ['fade', 'glow'],
                xpRequired: 150,
                color: '#3b82f6',
                icon: this.iconManager.getIcon('levels', '1')
            },
            2: {
                name: 'Καλλιτέχνης Μοτίβων',
                nameEn: 'Pattern Artist',
                description: 'Γεωμετρικά σχήματα και μοτίβα',
                tools: ['pen', 'eraser', 'brush', 'highlighter', 'shape', 'pattern'],
                effects: ['fade', 'glow', 'texture'],
                xpRequired: 400,
                color: '#059669',
                icon: this.iconManager.getIcon('levels', '2')
            },
            3: {
                name: 'Αρχιτέκτονας Ιδεών',
                nameEn: 'Idea Architect', 
                description: 'Σύνθετα διαγράμματα και οπτικοποίηση',
                tools: ['pen', 'eraser', 'brush', 'highlighter', 'shape', 'pattern', 'diagram', 'flow'],
                effects: ['fade', 'glow', 'texture', 'shadow', 'gradient'],
                xpRequired: 800,
                color: '#7c3aed',
                icon: this.iconManager.getIcon('levels', '3')
            },
            4: {
                name: 'Μάστορας Δημιουργίας',
                nameEn: 'Creation Master',
                description: 'Πλήρη creative suite με AI-enhanced capabilities',
                tools: ['all'],
                effects: ['all'],
                xpRequired: 1500,
                color: '#dc2626',
                icon: this.iconManager.getIcon('levels', '4')
            }
        };
    }

    /**
     * Override parent init to add FontAwesome support
     */
    async init() {
        this.log('🎨 Initializing Scribble Saga Enhanced Module...');
        
        // Load FontAwesome CSS first
        await this.iconManager.loadCSS();
        
        // Initialize parent marginalia system
        await super.init();
        
        // Load creative progress
        this.loadCreativeProgress();
        
        // Initialize creative XP system
        this.initializeCreativeXP();
        
        // Setup pattern recognition
        await this.initializePatternRecognition();
        
        // Create enhanced creative controls με professional icons
        this.createEnhancedCreativeControls();
        
        // Setup creative event listeners
        this.setupCreativeEventListeners();
        
        // Start new creative session
        this.startCreativeSession();
        
        // Apply current creative level styling
        this.applyCreativeLevelStyling();
        
        this.log('✨ Scribble Saga Enhanced Module ready με FontAwesome icons!');
    }

    /**
     * Initialize pattern recognition engine
     */
    async initializePatternRecognition() {
        this.patternRecognition = {
            patterns: new Map(),
            
            async analyze(strokes) {
                // Simplified pattern recognition για demo
                const patterns = [];
                
                if (strokes.length >= 3) {
                    // Check για basic shapes
                    const lastStrokes = strokes.slice(-3);
                    
                    // Circle detection (simplified)
                    if (this.isCircular(lastStrokes)) {
                        patterns.push({
                            type: 'circle',
                            confidence: 0.8,
                            strokes: lastStrokes,
                            icon: this.parent.iconManager.getIcon('patterns', 'circle')
                        });
                    }
                    
                    // Line pattern detection
                    if (this.isLinear(lastStrokes)) {
                        patterns.push({
                            type: 'line',
                            confidence: 0.7,
                            strokes: lastStrokes,
                            icon: this.parent.iconManager.getIcon('patterns', 'line')
                        });
                    }
                }
                
                return patterns;
            },
            
            isCircular(strokes) {
                // Simplified circular detection
                return strokes.length >= 3 && Math.random() > 0.7; // Placeholder
            },
            
            isLinear(strokes) {
                // Simplified linear detection
                return strokes.length >= 2 && Math.random() > 0.6; // Placeholder
            },
            
            parent: this
        };
    }

    /**
     * Create enhanced creative controls με FontAwesome icons
     */
    createEnhancedCreativeControls() {
        // Remove existing controls
        const existingControls = document.querySelector('.scribble-saga-controls');
        if (existingControls) {
            existingControls.remove();
        }

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'scribble-saga-enhanced-controls';
        controlsContainer.innerHTML = `
            <div class="creative-header">
                <div class="creative-level-badge">
                    ${this.creativeLevels[this.creativeLevel].icon}
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
                        <span class="stat-value" id="session-strokes">0</span>
                    </div>
                    <div class="stat-item">
                        ${this.iconManager.getIcon('actions', 'pattern_detected')}
                        <span class="stat-label">Patterns:</span>
                        <span class="stat-value" id="patterns-detected">0</span>
                    </div>
                    <div class="stat-item">
                        ${this.iconManager.getIcon('ui', 'xp')}
                        <span class="stat-label">XP:</span>
                        <span class="stat-value" id="session-xp">0</span>
                    </div>
                </div>
            </div>
            
            <div class="creative-achievements-section">
                <h4>${this.iconManager.getIcon('ui', 'achievement')} Recent Achievements</h4>
                <div id="recent-achievements" class="achievements-list">
                    <!-- Achievements will be added dynamically -->
                </div>
            </div>
        `;

        document.body.appendChild(controlsContainer);
        this.setupCreativeControlsEvents(controlsContainer);
    }

    /**
     * Generate enhanced tool buttons με FontAwesome icons
     */
    generateEnhancedToolButtons() {
        const currentLevelTools = this.creativeLevels[this.creativeLevel].tools;
        
        return Object.keys(this.iconManager.iconMappings.tools)
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
        
        return Object.keys(this.iconManager.iconMappings.effects)
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
            pencil: 'Μολύβι', 
            brush: 'Πινέλο',
            highlighter: 'Μαρκαδόρος',
            eraser: 'Σβήστρα',
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
     * Enhanced tool description
     */
    getToolDescription(toolName) {
        const descriptions = {
            pen: 'Βασικό εργαλείο σχεδίασης για ακριβείς γραμμές',
            pencil: 'Μαλακό μολύβι για σκίτσα και προσχέδια',
            brush: 'Καλλιτεχνικό πινέλο για ελεύθερη έκφραση',
            highlighter: 'Τονισμός σημαντικού περιεχομένου',
            eraser: 'Αφαίρεση ανεπιθύμητων σχεδίων',
            shape: 'Γεωμετρικά σχήματα και δομές',
            pattern: 'Επαναλαμβανόμενα μοτίβα και υφές',
            diagram: 'Δομημένα διαγράμματα και οπτικοποιήσεις',
            flow: 'Διαγράμματα ροής και συνδέσεις',
            smart_assist: 'AI-powered βοήθεια στη δημιουργία',
            pattern_generator: 'Αυτόματη δημιουργία creative patterns'
        };
        return descriptions[toolName] || toolName;
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
                        ${this.creativeLevels[oldLevel].icon}
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
                
                <div class="new-unlocks">
                    <h4>${this.iconManager.getIcon('ui', 'achievement')} Νέα Ξεκλειδώματα:</h4>
                    <div class="unlocks-grid">
                        ${this.generateUnlocksList(oldLevel, newLevel)}
                    </div>
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
     * Generate list of new unlocks για level up notification
     */
    generateUnlocksList(oldLevel, newLevel) {
        const oldLevelData = this.creativeLevels[oldLevel];
        const newLevelData = this.creativeLevels[newLevel];
        
        const newTools = newLevelData.tools.filter(tool => 
            tool !== 'all' && !oldLevelData.tools.includes(tool)
        );
        
        const newEffects = newLevelData.effects.filter(effect => 
            effect !== 'all' && !oldLevelData.effects.includes(effect)
        );
        
        const unlocks = [];
        
        // Add new tools
        newTools.forEach(tool => {
            unlocks.push(`
                <div class="unlock-item">
                    ${this.iconManager.getIcon('tools', tool)}
                    <span>${this.getToolDisplayName(tool)}</span>
                </div>
            `);
        });
        
        // Add new effects
        newEffects.forEach(effect => {
            unlocks.push(`
                <div class="unlock-item">
                    ${this.iconManager.getIcon('effects', effect)}
                    <span>${effect}</span>
                </div>
            `);
        });
        
        return unlocks.join('');
    }

    /**
     * Add achievement to recent achievements list
     */
    addRecentAchievement(achievementType, title, description) {
        const achievementsList = document.getElementById('recent-achievements');
        if (!achievementsList) return;
        
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-item';
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
        
        // Highlight new achievement
        achievementElement.classList.add('new-achievement');
        setTimeout(() => achievementElement.classList.remove('new-achievement'), 2000);
    }

    /**
     * Override level up to use enhanced notification
     */
    levelUp(newLevel) {
        const oldLevel = this.creativeLevel;
        this.creativeLevel = newLevel;
        
        const levelData = this.creativeLevels[newLevel];
        
        // Unlock new tools
        levelData.tools.forEach(tool => {
            if (tool !== 'all') {
                this.unlockedTools.add(tool);
            }
        });
        
        // Show enhanced level up notification
        this.showEnhancedLevelUpNotification(oldLevel, newLevel);
        
        // Add achievement
        this.addRecentAchievement(
            'level_master',
            `Level ${newLevel} Unlocked!`,
            `Φτάσατε στο ${levelData.name}`
        );
        
        // Update UI
        this.applyCreativeLevelStyling();
        this.createEnhancedCreativeControls(); // Refresh controls
        
        // Emit event for other modules
        this.app.emit('scribbleSaga:levelUp', {
            oldLevel,
            newLevel,
            levelData
        });
        
        this.log(`🌟 ENHANCED LEVEL UP! ${oldLevel} → ${newLevel}: ${levelData.name}`);
    }

    /**
     * Override pattern detection to use FontAwesome icons
     */
    onPatternDetected(pattern) {
        this.log(`🔍 Pattern detected: ${pattern.type} (confidence: ${pattern.confidence})`);
        
        // Award XP for pattern detection
        this.awardCreativeXP('pattern_detected');
        
        // Add to session patterns
        this.currentSession.patterns.push(pattern);
        
        // Add achievement
        this.addRecentAchievement(
            'pattern_master',
            `Pattern Detected: ${pattern.type}`,
            `Confidence: ${Math.round(pattern.confidence * 100)}%`
        );
        
        // Check for pattern completion achievement
        if (pattern.confidence > 0.8) {
            this.awardCreativeXP('pattern_completion');
            this.addRecentAchievement(
                'pattern_master',
                'Pattern Completed!',
                `Excellent ${pattern.type} pattern`
            );
        }
        
        // Update stats
        this.updateSessionStats();
        
        // Visual feedback με professional icon
        this.highlightPatternArea(pattern);
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

// Placeholder classes για pattern recognition engine
class PatternRecognitionEngine {
    async init() {
        console.log('🔍 Pattern Recognition Engine initialized');
    }
    
    async analyze(strokes) {
        // Simplified pattern recognition για demo
        return [];
    }
}

class CreativeAchievementSystem {
    constructor() {
        this.achievements = new Map();
    }
    
    unlock(achievementId) {
        this.achievements.set(achievementId, {
            id: achievementId,
            unlockedAt: Date.now()
        });
        console.log(`🏆 Achievement unlocked: ${achievementId}`);
    }
}

// Enhanced creative tools (placeholder implementations)
class CreativePenTool {}
class CreativeEraserTool {}
class CreativeBrushTool {}
class CreativeHighlighterTool {}
class CreativeShapeTool {}
class CreativePatternTool {}
class CreativeDiagramTool {}
class CreativeFlowTool {}
class AICreativeAssistTool {}
class PatternGeneratorTool {}

// Export για module system
window.ScribbleSagaEnhancedModule = ScribbleSagaEnhancedModule;