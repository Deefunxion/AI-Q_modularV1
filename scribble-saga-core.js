/**
 * Scribble Saga Core Module - AI Orchestrator's Ascent
 * 
 * Base implementation του Creative Pattern Engine που επεκτείνει
 * το υπάρχον marginalia system με core creative functionality.
 * 
 * Αυτό είναι το foundation πάνω στο οποίο χτίζεται το Enhanced module.
 */

class ScribbleSagaModule extends marginaliaModule {
    constructor(app) {
        super(app);
        
        // Enhanced creative state
        this.creativeLevel = 0;
        this.creativeXP = 0;
        this.unlockedTools = new Set(['pen']);
        this.patternLibrary = new Map();
        this.currentSession = null;
        this.strokeHistory = [];
        
        // Creative progression system
        this.creativeLevels = this.initializeCreativeLevels();
        
        // Creative tools system
        this.creativeTools = this.initializeCreativeTools();
        
        // Creative XP system
        this.creativeXPSystem = this.initializeCreativeXP();
        
        // Pattern recognition
        this.patternRecognition = this.initializePatternRecognition();
        
        // Achievement system
        this.creativeAchievements = this.initializeCreativeAchievements();
        
        console.log('🎨 Scribble Saga Core Module initialized');
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
                color: '#6b7280'
            },
            1: {
                name: 'Εικονογράφος',
                nameEn: 'Illustrator',
                description: 'Χρώματα και υφές',
                tools: ['pen', 'eraser', 'brush', 'highlighter'],
                effects: ['fade', 'glow'],
                xpRequired: 150,
                color: '#3b82f6'
            },
            2: {
                name: 'Καλλιτέχνης Μοτίβων',
                nameEn: 'Pattern Artist',
                description: 'Γεωμετρικά σχήματα και μοτίβα',
                tools: ['pen', 'eraser', 'brush', 'highlighter', 'shape', 'pattern'],
                effects: ['fade', 'glow', 'texture'],
                xpRequired: 400,
                color: '#059669'
            },
            3: {
                name: 'Αρχιτέκτονας Ιδεών',
                nameEn: 'Idea Architect', 
                description: 'Σύνθετα διαγράμματα και οπτικοποίηση',
                tools: ['pen', 'eraser', 'brush', 'highlighter', 'shape', 'pattern', 'diagram', 'flow'],
                effects: ['fade', 'glow', 'texture', 'shadow', 'gradient'],
                xpRequired: 800,
                color: '#7c3aed'
            },
            4: {
                name: 'Μάστορας Δημιουργίας',
                nameEn: 'Creation Master',
                description: 'Πλήρη creative suite με AI-enhanced capabilities',
                tools: ['all'],
                effects: ['all'],
                xpRequired: 1500,
                color: '#dc2626'
            }
        };
    }

    /**
     * Initialize creative tools system
     */
    initializeCreativeTools() {
        return {
            // Basic tools (level 0)
            pen: {
                name: 'Pen',
                description: 'Βασικό εργαλείο σχεδίασης',
                level: 0,
                strokeStyle: 'solid',
                minWidth: 1,
                maxWidth: 10
            },
            eraser: {
                name: 'Eraser',
                description: 'Αφαίρεση σχεδίων',
                level: 0,
                strokeStyle: 'erase',
                minWidth: 5,
                maxWidth: 50
            },
            
            // Level 1 tools
            brush: {
                name: 'Brush',
                description: 'Καλλιτεχνικό πινέλο',
                level: 1,
                strokeStyle: 'brush',
                minWidth: 2,
                maxWidth: 20
            },
            highlighter: {
                name: 'Highlighter',
                description: 'Τονισμός περιεχομένου',
                level: 1,
                strokeStyle: 'highlight',
                minWidth: 8,
                maxWidth: 25
            },
            
            // Level 2 tools  
            shape: {
                name: 'Shape',
                description: 'Γεωμετρικά σχήματα',
                level: 2,
                strokeStyle: 'shape',
                minWidth: 1,
                maxWidth: 5
            },
            pattern: {
                name: 'Pattern',
                description: 'Επαναλαμβανόμενα μοτίβα',
                level: 2,
                strokeStyle: 'pattern',
                minWidth: 1,
                maxWidth: 10
            },
            
            // Level 3 tools
            diagram: {
                name: 'Diagram',
                description: 'Δομημένα διαγράμματα',
                level: 3,
                strokeStyle: 'diagram',
                minWidth: 1,
                maxWidth: 5
            },
            flow: {
                name: 'Flow',
                description: 'Διαγράμματα ροής',
                level: 3,
                strokeStyle: 'flow',
                minWidth: 1,
                maxWidth: 8
            },
            
            // Level 4 tools (AI-enhanced)
            smart_assist: {
                name: 'Smart Assist',
                description: 'AI-powered βοήθεια',
                level: 4,
                strokeStyle: 'smart',
                minWidth: 1,
                maxWidth: 15
            },
            pattern_generator: {
                name: 'Pattern Generator',
                description: 'Αυτόματη δημιουργία patterns',
                level: 4,
                strokeStyle: 'generated',
                minWidth: 1,
                maxWidth: 20
            }
        };
    }

    /**
     * Initialize the creative XP system
     */
    initializeCreativeXP() {
        return {
            // XP rewards for different creative actions
            rewards: {
                stroke_start: 1,
                stroke_complete: 2,
                shape_complete: 5,
                pattern_detected: 10,
                pattern_completion: 25,
                creative_milestone: 50,
                daily_creativity: 100
            },
            
            // Multipliers
            multipliers: {
                complexity: this.getComplexityMultiplier.bind(this),
                aiq_bonus: this.getAIQBonus.bind(this),
                streak_bonus: this.getStreakBonus.bind(this)
            }
        };
    }

    /**
     * Initialize pattern recognition engine with cognitive fingerprint analysis
     */
    initializePatternRecognition() {
        return {
            patterns: new Map(),
            cognitiveHistory: [], // Store cognitive fingerprints
            
            async analyze(strokes) {
                const detectedPatterns = [];
                
                if (strokes.length >= 1) {
                    const lastStroke = strokes[strokes.length - 1];
                    
                    // Generate cognitive fingerprint for this stroke
                    const cognitiveFingerprint = this.generateCognitiveFingerprint(lastStroke);
                    this.cognitiveHistory.push({
                        timestamp: Date.now(),
                        fingerprint: cognitiveFingerprint,
                        context: this.getCurrentLearningContext()
                    });
                    
                    // Analyze patterns in groups of strokes
                    if (strokes.length >= 3) {
                        const lastStrokes = strokes.slice(-3);
                        
                        // Circle detection with confidence based on cognitive state
                        if (this.detectCircle(lastStrokes)) {
                            detectedPatterns.push({
                                type: 'circle',
                                confidence: this.calculatePatternConfidence('circle', cognitiveFingerprint),
                                strokes: lastStrokes,
                                cognitiveState: cognitiveFingerprint
                            });
                        }
                        
                        // Line detection
                        if (this.detectLine(lastStrokes)) {
                            detectedPatterns.push({
                                type: 'line',
                                confidence: this.calculatePatternConfidence('line', cognitiveFingerprint),
                                strokes: lastStrokes,
                                cognitiveState: cognitiveFingerprint
                            });
                        }
                        
                        // Flow state detection
                        if (this.detectFlowState(strokes.slice(-5))) {
                            detectedPatterns.push({
                                type: 'flow_state',
                                confidence: 0.9,
                                strokes: strokes.slice(-5),
                                cognitiveState: cognitiveFingerprint
                            });
                        }
                    }
                }
                
                return detectedPatterns;
            },
            
            /**
             * Generate cognitive fingerprint for a stroke based on Manus's research
             */
            generateCognitiveFingerprint(stroke) {
                const pathLength = this.calculatePathLength(stroke.path);
                const pressure = stroke.pressure || 1.0;
                const speed = this.calculateStrokeSpeed(stroke);
                const complexity = stroke.complexity || 1.0;
                
                return {
                    // Technical metrics
                    strokeLength: pathLength,
                    strokePressure: pressure,
                    strokeSpeed: speed,
                    strokeComplexity: complexity,
                    
                    // Cognitive indicators
                    intensityLevel: this.calculateIntensity(pressure, speed),
                    focusState: this.calculateFocusState(complexity, pathLength),
                    emotionalTone: this.calculateEmotionalTone(pressure, speed, complexity),
                    
                    // Temporal patterns
                    timeOfDay: new Date().getHours(),
                    sessionDuration: Date.now() - (this.sessionStartTime || Date.now()),
                    
                    // Learning context
                    currentChapter: this.getCurrentChapter(),
                    learningPhase: this.getLearningPhase()
                };
            },
            
            /**
             * Calculate pattern confidence based on cognitive state
             */
            calculatePatternConfidence(patternType, cognitiveFingerprint) {
                let baseConfidence = 0.7;
                
                // Adjust confidence based on focus state
                if (cognitiveFingerprint.focusState > 0.8) {
                    baseConfidence += 0.2;
                }
                
                // Adjust based on emotional tone
                if (cognitiveFingerprint.emotionalTone === 'calm_focused') {
                    baseConfidence += 0.1;
                } else if (cognitiveFingerprint.emotionalTone === 'intense_engaged') {
                    baseConfidence += 0.05;
                }
                
                return Math.min(1.0, baseConfidence);
            },
            
            /**
             * Calculate stroke intensity (for cognitive analysis)
             */
            calculateIntensity(pressure, speed) {
                return Math.min(1.0, (pressure * 0.6 + speed * 0.4));
            },
            
            /**
             * Calculate focus state based on stroke characteristics
             */
            calculateFocusState(complexity, pathLength) {
                // Higher complexity + moderate length = better focus
                const focusScore = (complexity * 0.7) + (Math.min(pathLength / 500, 1.0) * 0.3);
                return Math.min(1.0, focusScore);
            },
            
            /**
             * Determine emotional tone from stroke characteristics
             */
            calculateEmotionalTone(pressure, speed, complexity) {
                if (pressure > 0.8 && speed > 0.7) {
                    return 'intense_engaged';
                } else if (pressure < 0.4 && speed < 0.3) {
                    return 'gentle_reflective';
                } else if (complexity > 0.6 && pressure > 0.5) {
                    return 'focused_deliberate';
                } else {
                    return 'calm_focused';
                }
            },
            
            detectCircle(strokes) {
                // Enhanced circle detection
                return Math.random() > 0.6;
            },
            
            detectLine(strokes) {
                // Enhanced line detection
                return Math.random() > 0.5;
            },
            
            detectFlowState(strokes) {
                // Detect when user is in creative flow
                if (strokes.length < 5) return false;
                
                const avgComplexity = strokes.reduce((sum, s) => sum + (s.complexity || 1), 0) / strokes.length;
                const timeSpread = strokes[strokes.length - 1].timestamp - strokes[0].timestamp;
                
                return avgComplexity > 1.5 && timeSpread < 10000; // 10 seconds of complex drawing
            },
            
            /**
             * Helper methods for cognitive analysis
             */
            calculatePathLength(path) {
                try {
                    return path && path.getTotalLength ? path.getTotalLength() : 100;
                } catch (e) {
                    return 100;
                }
            },
            
            calculateStrokeSpeed(stroke) {
                const duration = stroke.endTime - stroke.startTime || 1000;
                const length = this.calculatePathLength(stroke.path);
                return Math.min(1.0, length / duration * 100); // Normalized speed
            },
            
            getCurrentLearningContext() {
                return {
                    chapter: this.getCurrentChapter(),
                    timeInSession: Date.now() - (this.sessionStartTime || Date.now()),
                    totalStrokes: this.strokeHistory ? this.strokeHistory.length : 0
                };
            },
            
            getCurrentChapter() {
                try {
                    return this.app && this.app.currentChapter ? this.app.currentChapter.id : 'unknown';
                } catch (e) {
                    return 'demo';
                }
            },
            
            getLearningPhase() {
                const sessionTime = Date.now() - (this.sessionStartTime || Date.now());
                if (sessionTime < 5 * 60 * 1000) return 'warm_up';
                if (sessionTime < 20 * 60 * 1000) return 'engaged';
                return 'deep_focus';
            }
        };
    }

    /**
     * Initialize creative achievements system
     */
    initializeCreativeAchievements() {
        return {
            achievements: new Map(),
            
            unlock(achievementId) {
                this.achievements.set(achievementId, {
                    id: achievementId,
                    unlockedAt: Date.now()
                });
                console.log(`🏆 Achievement unlocked: ${achievementId}`);
                return true;
            },
            
            isUnlocked(achievementId) {
                return this.achievements.has(achievementId);
            },
            
            getAll() {
                return Array.from(this.achievements.values());
            }
        };
    }

    /**
     * Override parent init to add Scribble Saga features
     */
    async init() {
        this.log('🎨 Initializing Scribble Saga Core Module...');
        
        // Initialize parent marginalia system
        await super.init();
        
        // Load creative progress
        this.loadCreativeProgress();
        
        // Start new creative session
        this.startCreativeSession();
        
        // Setup creative event listeners
        this.setupCreativeEventListeners();
        
        // Apply current creative level styling
        this.applyCreativeLevelStyling();
        
        this.log('✨ Scribble Saga Core Module ready!');
    }

    /**
     * Load creative progress from storage
     */
    loadCreativeProgress() {
        try {
            const saved = localStorage.getItem('scribbleSaga_creativeProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.creativeLevel = progress.level || 0;
                this.creativeXP = progress.xp || 0;
                this.unlockedTools = new Set(progress.unlockedTools || ['pen']);
                this.patternLibrary = new Map(progress.patternLibrary || []);
            }
            
            this.log(`📊 Creative progress loaded - Level: ${this.creativeLevel}, XP: ${this.creativeXP}`);
        } catch (error) {
            this.log('⚠️ Could not load creative progress, using defaults', error);
        }
    }

    /**
     * Save creative progress to storage
     */
    saveCreativeProgress() {
        try {
            const progress = {
                level: this.creativeLevel,
                xp: this.creativeXP,
                unlockedTools: Array.from(this.unlockedTools),
                patternLibrary: Array.from(this.patternLibrary.entries()),
                lastSaved: Date.now()
            };
            
            localStorage.setItem('scribbleSaga_creativeProgress', JSON.stringify(progress));
            this.log('💾 Creative progress saved');
        } catch (error) {
            this.log('⚠️ Could not save creative progress', error);
        }
    }

    /**
     * Start a new creative session
     */
    startCreativeSession() {
        this.sessionStartTime = Date.now();
        this.currentSession = {
            id: `session_${Date.now()}`,
            startTime: Date.now(),
            strokes: 0,
            patterns: [],
            achievements: [],
            xpEarned: 0,
            cognitiveState: 'initializing',
            ephemeralDrawings: new Map(), // Track drawings for auto-fade
            captureableMoments: [], // Intelligent capture candidates
            creativeSparks: this.generateCreativeSparks()
        };
        
        // Initialize ephemeral system
        this.initializeEphemeralSystem();
        
        // Initialize intelligent capture system
        this.initializeIntelligentCapture();
        
        this.log('🎬 New creative session started:', this.currentSession.id);
    }
    
    /**
     * Initialize ephemeral creation system - drawings fade after 24-48 hours
     */
    initializeEphemeralSystem() {
        this.ephemeralSystem = {
            fadeSchedule: new Map(),
            defaultLifespan: 24 * 60 * 60 * 1000, // 24 hours
            maxLifespan: 48 * 60 * 60 * 1000, // 48 hours
            
            /**
             * Mark a drawing for ephemeral fade
             */
            scheduleForFade(drawingId, element, lifespan = null) {
                const fadeTime = Date.now() + (lifespan || this.defaultLifespan);
                
                this.fadeSchedule.set(drawingId, {
                    element: element,
                    fadeTime: fadeTime,
                    created: Date.now()
                });
                
                // Schedule actual fade
                setTimeout(() => {
                    this.fadeDrawing(drawingId);
                }, lifespan || this.defaultLifespan);
                
                console.log(`🌅 Drawing ${drawingId} scheduled to fade in ${Math.round((lifespan || this.defaultLifespan) / 1000 / 60)} minutes`);
            },
            
            /**
             * Fade a drawing gradually
             */
            fadeDrawing(drawingId) {
                const scheduled = this.fadeSchedule.get(drawingId);
                if (!scheduled || !scheduled.element) return;
                
                const element = scheduled.element;
                let opacity = 1.0;
                
                const fadeInterval = setInterval(() => {
                    opacity -= 0.05;
                    element.style.opacity = opacity;
                    
                    if (opacity <= 0) {
                        clearInterval(fadeInterval);
                        if (element.parentNode) {
                            element.parentNode.removeChild(element);
                        }
                        this.fadeSchedule.delete(drawingId);
                        console.log(`👻 Drawing ${drawingId} has faded away`);
                    }
                }, 100);
            },
            
            /**
             * Check if a drawing should be saved before fading
             */
            checkForIntelligentCapture(drawingId) {
                const scheduled = this.fadeSchedule.get(drawingId);
                if (!scheduled) return;
                
                // Analyze if this drawing is worth capturing
                const captureScore = this.calculateCaptureWorthiness(scheduled);
                
                if (captureScore > 0.7) {
                    this.proposeIntelligentCapture(drawingId, scheduled, captureScore);
                }
            },
            
            calculateCaptureWorthiness(scheduled) {
                // Factors that make a drawing worth capturing
                const age = Date.now() - scheduled.created;
                const complexity = this.estimateComplexity(scheduled.element);
                const interaction = this.getInteractionLevel(scheduled.element);
                
                let score = 0;
                
                // Older drawings that survived are more interesting
                if (age > 12 * 60 * 60 * 1000) score += 0.3; // 12+ hours
                
                // Complex drawings are more valuable
                if (complexity > 0.5) score += 0.4;
                
                // Interactive elements (user returned to them) are significant
                if (interaction > 0.3) score += 0.3;
                
                return Math.min(1.0, score);
            },
            
            estimateComplexity(element) {
                try {
                    const pathData = element.getAttribute('d') || '';
                    const commands = pathData.split(/[MLHVCSQTAZ]/i).length;
                    return Math.min(1.0, commands / 20);
                } catch (e) {
                    return 0.5;
                }
            },
            
            getInteractionLevel(element) {
                // This would track how often user looks at/interacts with this drawing
                return Math.random() * 0.6; // Placeholder
            }
        };
    }
    
    /**
     * Initialize intelligent capture system with surprise notifications
     */
    initializeIntelligentCapture() {
        const parentContext = this;
        this.intelligentCapture = {
            captureThreshold: 0.75,
            lastSurpriseTime: 0,
            surpriseInterval: 10 * 60 * 1000, // 10 minutes between surprises
            
            /**
             * Analyze stroke for capture potential
             */
            analyzeForCapture(stroke, cognitiveFingerprint) {
                const captureScore = this.calculateCaptureScore(stroke, cognitiveFingerprint);
                
                if (captureScore > this.captureThreshold && this.canShowSurprise()) {
                    this.proposeCapture(stroke, captureScore, cognitiveFingerprint);
                }
                
                return captureScore;
            },
            
            calculateCaptureScore(stroke, cognitiveFingerprint) {
                let score = 0;
                
                // High focus states create more capturable moments
                if (cognitiveFingerprint.focusState > 0.8) score += 0.3;
                
                // Emotional engagement adds value
                if (cognitiveFingerprint.emotionalTone === 'intense_engaged') score += 0.2;
                if (cognitiveFingerprint.emotionalTone === 'focused_deliberate') score += 0.25;
                
                // Complex strokes are more interesting
                if (cognitiveFingerprint.strokeComplexity > 1.5) score += 0.3;
                
                // Longer strokes show investment
                if (cognitiveFingerprint.strokeLength > 300) score += 0.2;
                
                // Random serendipity factor
                score += Math.random() * 0.1;
                
                return Math.min(1.0, score);
            },
            
            canShowSurprise() {
                const now = Date.now();
                return (now - this.lastSurpriseTime) > this.surpriseInterval;
            },
            
            proposeCapture(stroke, score, cognitiveFingerprint) {
                this.lastSurpriseTime = Date.now();
                
                const messages = [
                    `Αυτό το σχήμα που έκανες έχει μια ενδιαφέρουσα ${this.getShapeQuality(cognitiveFingerprint)}. Θέλεις να το κρατήσουμε στο 'Sketchbook' σου;`,
                    `Παρατηρήσαμε ότι οι γραμμές σου έγιναν πιο ${this.getIntensityDescription(cognitiveFingerprint)}. Αυτό δείχνει βαθιά συγκέντρωση. Αποθηκεύουμε αυτό το 'γνωστικό αποτύπωμα';`,
                    `Το σχέδιό σου εκφράζει μια ${cognitiveFingerprint.emotionalTone.replace('_', ' ')} ενέργεια. Θέλεις να το μετατρέψουμε σε μόνιμο;`,
                    `Η δημιουργική σου ροή φαίνεται ιδιαίτερα ${this.getFlowDescription(cognitiveFingerprint)}. Αξίζει να το διατηρήσουμε;`
                ];
                
                const message = messages[Math.floor(Math.random() * messages.length)];
                
                setTimeout(() => {
                    if (confirm(`🎨 ${message}`)) {
                        this.captureToSketchbook(stroke, score, cognitiveFingerprint);
                    }
                }, 1000);
            },
            
            captureToSketchbook: (stroke, score, cognitiveFingerprint) => {
                const sketchbook = parentContext.getSketchbook();
                const captureId = `capture_${Date.now()}`;
                
                sketchbook.set(captureId, {
                    stroke: stroke.path ? stroke.path.cloneNode(true) : null,
                    score: score,
                    cognitiveState: cognitiveFingerprint,
                    capturedAt: Date.now(),
                    tags: parentContext.intelligentCapture.generateTags(cognitiveFingerprint)
                });
                
                parentContext.saveSketchbook(sketchbook);
                
                // Show success message
                parentContext.intelligentCapture.showCaptureSuccess(captureId, cognitiveFingerprint);
                
                console.log(`📚 Captured drawing to sketchbook:`, captureId);
            },
            
            getShapeQuality(fingerprint) {
                if (fingerprint.strokeComplexity > 2) return 'συμμετρία';
                if (fingerprint.focusState > 0.8) return 'ακρίβεια';
                if (fingerprint.strokeLength > 400) return 'ροή';
                return 'ενέργεια';
            },
            
            getIntensityDescription(fingerprint) {
                if (fingerprint.intensityLevel > 0.8) return 'έντονες και περίπλοκες';
                if (fingerprint.intensityLevel > 0.5) return 'σταθερές και σκόπιμες';
                return 'απαλές και στοχαστικές';
            },
            
            getFlowDescription(fingerprint) {
                if (fingerprint.emotionalTone === 'intense_engaged') return 'παθιασμένη';
                if (fingerprint.emotionalTone === 'focused_deliberate') return 'συγκεντρωμένη';
                if (fingerprint.emotionalTone === 'gentle_reflective') return 'στοχαστική';
                return 'ήρεμη';
            },
            
            generateTags(fingerprint) {
                const tags = [];
                
                if (fingerprint.intensityLevel > 0.7) tags.push('intense');
                if (fingerprint.focusState > 0.8) tags.push('focused');
                if (fingerprint.strokeComplexity > 1.5) tags.push('complex');
                if (fingerprint.emotionalTone) tags.push(fingerprint.emotionalTone);
                if (fingerprint.learningPhase) tags.push(fingerprint.learningPhase);
                
                return tags;
            },
            
            showCaptureSuccess(captureId, fingerprint) {
                // This will be enhanced with better UI later
                const message = `✨ Αποθηκεύτηκε στο Sketchbook!\n\nΓνωστικό αποτύπωμα: ${fingerprint.emotionalTone}\nΠοιότητα εστίασης: ${Math.round(fingerprint.focusState * 100)}%`;
                
                setTimeout(() => {
                    alert(message);
                }, 500);
            }
        };
    }
    
    /**
     * Generate creative sparks - playful challenges
     */
    generateCreativeSparks() {
        const sparks = [
            {
                id: 'single_line',
                title: 'Μία Συνεχή Γραμμή',
                description: 'Δοκίμασε να σχεδιάσεις κάτι χρησιμοποιώντας μόνο μία συνεχή γραμμή.',
                difficulty: 'easy',
                xpReward: 25
            },
            {
                id: 'five_circles',
                title: 'Πέντε Κύκλοι',
                description: 'Τι μπορείς να φτιάξεις με 5 κύκλους;',
                difficulty: 'easy',
                xpReward: 30
            },
            {
                id: 'emotion_drawing',
                title: 'Σχεδίασε ένα Συναίσθημα',
                description: 'Μπορείς να σχεδιάσεις πώς νιώθεις αυτή τη στιγμή;',
                difficulty: 'medium',
                xpReward: 50
            },
            {
                id: 'memory_sketch',
                title: 'Μνήμη από Σήμερα',
                description: 'Σχεδίασε κάτι που σε εντυπωσίασε σήμερα.',
                difficulty: 'medium',
                xpReward: 45
            },
            {
                id: 'opposite_hand',
                title: 'Αντίθετο Χέρι',
                description: 'Δοκίμασε να σχεδιάσεις με το αντίθετο χέρι.',
                difficulty: 'hard',
                xpReward: 75
            },
            {
                id: 'geometric_face',
                title: 'Γεωμετρικό Πρόσωπο',
                description: 'Φτιάξε ένα πρόσωπο χρησιμοποιώντας μόνο γεωμετρικά σχήματα.',
                difficulty: 'hard',
                xpReward: 80
            }
        ];
        
        // Return 2-3 random sparks for this session
        const shuffled = sparks.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
    }
    
    /**
     * Get or create sketchbook
     */
    getSketchbook() {
        try {
            const saved = localStorage.getItem('scribbleSaga_sketchbook');
            return new Map(JSON.parse(saved) || []);
        } catch (e) {
            return new Map();
        }
    }
    
    /**
     * Save sketchbook to storage
     */
    saveSketchbook(sketchbook) {
        try {
            localStorage.setItem('scribbleSaga_sketchbook', JSON.stringify(Array.from(sketchbook.entries())));
        } catch (e) {
            console.warn('Could not save sketchbook:', e);
        }
    }

    /**
     * Setup creative event listeners
     */
    setupCreativeEventListeners() {
        // Listen για app events
        if (this.app.on) {
            this.app.on('chapter:loaded', () => {
                this.updateCanvasSize();
            });
            
            this.app.on('responsive:change', () => {
                this.updateCanvasSize();
            });
        }
    }

    /**
     * Override parent handleStart to add creative XP tracking
     */
    handleStart(e) {
        super.handleStart(e);
        
        if (this.isDrawing) {
            // Award XP for starting a stroke
            this.awardCreativeXP('stroke_start');
            
            // Track stroke in current session
            this.currentSession.strokes++;
        }
    }

    /**
     * Override parent handleEnd to add pattern recognition and XP
     */
    handleEnd(e) {
        super.handleEnd(e);
        
        if (this.currentPath) {
            const strokeEndTime = Date.now();
            
            // Award XP for completing a stroke
            this.awardCreativeXP('stroke_complete');
            
            // Create enhanced stroke object with cognitive data
            const strokeData = {
                path: this.currentPath.cloneNode(true),
                startTime: this.strokeStartTime || strokeEndTime - 1000,
                endTime: strokeEndTime,
                timestamp: strokeEndTime,
                tool: this.settings.tool,
                complexity: this.calculateStrokeComplexity(this.currentPath),
                pressure: this.currentPressure || 1.0
            };
            
            // Add stroke to history για pattern recognition
            this.strokeHistory.push(strokeData);
            
            // Schedule for ephemeral fade (demo: 5 minutes instead of 24 hours)
            const drawingId = `stroke_${strokeEndTime}`;
            const demoLifespan = 5 * 60 * 1000; // 5 minutes for demo
            this.ephemeralSystem.scheduleForFade(drawingId, this.currentPath, demoLifespan);
            
            // Run pattern recognition with cognitive analysis
            setTimeout(() => this.analyzeForPatterns(), 100);
        }
        
        // Clear stroke tracking
        this.strokeStartTime = null;
        this.currentPressure = null;
    }
    
    /**
     * Override parent handleStart to track stroke timing and pressure
     */
    handleStart(e) {
        super.handleStart(e);
        
        if (this.isDrawing) {
            this.strokeStartTime = Date.now();
            this.currentPressure = e.pressure || 1.0;
            
            // Award XP for starting a stroke
            this.awardCreativeXP('stroke_start');
            
            // Track stroke in current session
            this.currentSession.strokes++;
            
            // Initialize cursor ink trail effect
            this.initializeCursorInkTrail(e);
        }
    }
    
    /**
     * Initialize cursor ink trail effect
     */
    initializeCursorInkTrail(e) {
        if (!this.cursorInkTrail) {
            this.cursorInkTrail = {
                trail: [],
                maxTrailLength: 20,
                trailElements: [],
                lastPosition: null,
                
                updateTrail: (x, y) => {
                    // Add new position to trail
                    this.cursorInkTrail.trail.push({ x, y, time: Date.now() });
                    
                    // Limit trail length
                    if (this.cursorInkTrail.trail.length > this.cursorInkTrail.maxTrailLength) {
                        this.cursorInkTrail.trail.shift();
                    }
                    
                    // Create visual trail elements
                    this.cursorInkTrail.createTrailElement(x, y);
                    
                    // Clean up old trail elements
                    this.cursorInkTrail.cleanupTrailElements();
                },
                
                createTrailElement: (x, y) => {
                    const trail = document.createElement('div');
                    trail.className = 'cursor-ink-trail';
                    trail.style.cssText = `
                        position: fixed;
                        left: ${x - 2}px;
                        top: ${y - 2}px;
                        width: 4px;
                        height: 4px;
                        background: ${this.settings.strokeColor || '#3b82f6'};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 9999;
                        opacity: 0.8;
                        transition: opacity 0.3s ease-out;
                    `;
                    
                    document.body.appendChild(trail);
                    this.cursorInkTrail.trailElements.push({
                        element: trail,
                        created: Date.now()
                    });
                },
                
                cleanupTrailElements: () => {
                    const now = Date.now();
                    this.cursorInkTrail.trailElements = this.cursorInkTrail.trailElements.filter(item => {
                        const age = now - item.created;
                        if (age > 500) { // 500ms lifetime
                            if (item.element.parentNode) {
                                item.element.parentNode.removeChild(item.element);
                            }
                            return false;
                        }
                        
                        // Fade out effect
                        const opacity = Math.max(0, 0.8 - (age / 500) * 0.8);
                        item.element.style.opacity = opacity;
                        
                        return true;
                    });
                }
            };
            
            // Add mouse move listener for ink trail
            document.addEventListener('mousemove', (e) => {
                if (this.isDrawing && this.cursorInkTrail) {
                    this.cursorInkTrail.updateTrail(e.clientX, e.clientY);
                }
            });
            
            // Add touch move listener for mobile
            document.addEventListener('touchmove', (e) => {
                if (this.isDrawing && this.cursorInkTrail && e.touches.length > 0) {
                    const touch = e.touches[0];
                    this.cursorInkTrail.updateTrail(touch.clientX, touch.clientY);
                }
            });
        }
    }

    /**
     * Award creative XP with multipliers
     */
    awardCreativeXP(action, customAmount = null) {
        const baseXP = customAmount || this.creativeXPSystem.rewards[action] || 0;
        
        if (baseXP === 0) return;
        
        // Apply multipliers
        const complexityMultiplier = this.creativeXPSystem.multipliers.complexity();
        const aiqBonus = this.creativeXPSystem.multipliers.aiq_bonus();
        const streakBonus = this.creativeXPSystem.multipliers.streak_bonus();
        
        const totalXP = Math.round(baseXP * complexityMultiplier * aiqBonus * streakBonus);
        
        this.creativeXP += totalXP;
        this.currentSession.xpEarned += totalXP;
        
        // Check for level up
        this.checkForLevelUp();
        
        // Save progress
        this.saveCreativeProgress();
        
        this.log(`🎯 Awarded ${totalXP} XP for ${action} (base: ${baseXP})`);
    }

    /**
     * Check if player should level up
     */
    checkForLevelUp() {
        const nextLevel = this.creativeLevel + 1;
        const nextLevelData = this.creativeLevels[nextLevel];
        
        if (nextLevelData && this.creativeXP >= nextLevelData.xpRequired) {
            this.levelUp(nextLevel);
        }
    }

    /**
     * Handle level up
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
        
        // Show level up notification
        this.showLevelUpNotification(oldLevel, newLevel);
        
        // Update styling
        this.applyCreativeLevelStyling();
        
        // Award achievement
        this.creativeAchievements.unlock(`level_${newLevel}`);
        
        // Emit event for other modules
        if (this.app.emit) {
            this.app.emit('scribbleSaga:levelUp', {
                oldLevel,
                newLevel,
                levelData
            });
        }
        
        this.log(`🌟 LEVEL UP! ${oldLevel} → ${newLevel}: ${levelData.name}`);
    }

    /**
     * Calculate stroke complexity for XP multiplier
     */
    calculateStrokeComplexity(path) {
        try {
            const pathData = path.getAttribute('d');
            const pathLength = path.getTotalLength ? path.getTotalLength() : 100;
            const commands = pathData.split(/[MLHVCSQTAZ]/i).length;
            
            // Complexity based on path length and number of commands
            const complexity = Math.min(3.0, 1.0 + (commands / 10) + (pathLength / 1000));
            
            return complexity;
        } catch (error) {
            return 1.0; // Default complexity
        }
    }

    /**
     * Get complexity multiplier for XP calculation
     */
    getComplexityMultiplier() {
        if (this.strokeHistory.length === 0) return 1.0;
        
        const recentStrokes = this.strokeHistory.slice(-5);
        const avgComplexity = recentStrokes.reduce((sum, stroke) => sum + stroke.complexity, 0) / recentStrokes.length;
        
        return Math.max(0.5, Math.min(2.0, avgComplexity));
    }

    /**
     * Get AI-Q bonus multiplier
     */
    getAIQBonus() {
        try {
            const aiq = this.aiqModule ? this.aiqModule.getAIQ() : 85;
            return 1.0 + (aiq - 85) / 200; // Range: 0.75x to 1.5x
        } catch (error) {
            return 1.0;
        }
    }

    /**
     * Get streak bonus multiplier
     */
    getStreakBonus() {
        // Placeholder για now
        return 1.0;
    }

    /**
     * Pattern recognition and analysis with cognitive fingerprinting
     */
    async analyzeForPatterns() {
        if (this.strokeHistory.length < 1) return;
        
        try {
            const recentStrokes = this.strokeHistory.slice(-10);
            const patterns = await this.patternRecognition.analyze(recentStrokes);
            
            patterns.forEach(pattern => {
                this.onPatternDetected(pattern);
                
                // Check for intelligent capture based on cognitive state
                if (pattern.cognitiveState) {
                    const lastStroke = recentStrokes[recentStrokes.length - 1];
                    this.intelligentCapture.analyzeForCapture(lastStroke, pattern.cognitiveState);
                }
            });
            
            // Also check for flow state and cognitive insights
            this.analyzeSessionCognitiveState();
            
        } catch (error) {
            this.log('⚠️ Pattern analysis failed:', error);
        }
    }
    
    /**
     * Analyze session cognitive state for insights
     */
    analyzeSessionCognitiveState() {
        if (!this.patternRecognition.cognitiveHistory || this.patternRecognition.cognitiveHistory.length < 3) return;
        
        const recentCognitive = this.patternRecognition.cognitiveHistory.slice(-5);
        
        // Detect cognitive shifts
        const intensityTrend = this.detectIntensityTrend(recentCognitive);
        const focusTrend = this.detectFocusTrend(recentCognitive);
        const emotionalPattern = this.detectEmotionalPattern(recentCognitive);
        
        // Generate insights based on cognitive trends
        if (intensityTrend === 'increasing' && focusTrend === 'improving') {
            this.showCognitiveInsight('deep_focus', 'Φαίνεται πως μπαίνεις σε βαθιά συγκέντρωση! Οι γραμμές σου γίνονται πιο ακριβείς.');
        } else if (emotionalPattern === 'contemplative_shift') {
            this.showCognitiveInsight('contemplative', 'Οι κινήσεις σου έγιναν πιο στοχαστικές. Μήπως επεξεργάζεσαι κάτι σημαντικό;');
        } else if (intensityTrend === 'creative_burst') {
            this.showCognitiveInsight('creative_burst', 'Έκρηξη δημιουργικότητας! Η ενέργειά σου φαίνεται στις γραμμές.');
        }
    }
    
    /**
     * Detect trends in cognitive patterns
     */
    detectIntensityTrend(cognitiveHistory) {
        if (cognitiveHistory.length < 3) return 'stable';
        
        const intensities = cognitiveHistory.map(h => h.fingerprint.intensityLevel);
        const latest = intensities.slice(-3);
        const earlier = intensities.slice(0, -3);
        
        const latestAvg = latest.reduce((a, b) => a + b, 0) / latest.length;
        const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
        
        if (latestAvg > earlierAvg + 0.2) return 'increasing';
        if (latestAvg < earlierAvg - 0.2) return 'decreasing';
        if (latestAvg > 0.8) return 'creative_burst';
        return 'stable';
    }
    
    detectFocusTrend(cognitiveHistory) {
        if (cognitiveHistory.length < 3) return 'stable';
        
        const focusLevels = cognitiveHistory.map(h => h.fingerprint.focusState);
        const latest = focusLevels.slice(-2);
        const improvement = latest[1] - latest[0];
        
        if (improvement > 0.1) return 'improving';
        if (improvement < -0.1) return 'declining';
        return 'stable';
    }
    
    detectEmotionalPattern(cognitiveHistory) {
        const emotions = cognitiveHistory.map(h => h.fingerprint.emotionalTone);
        const uniqueEmotions = [...new Set(emotions)];
        
        // Check for shift to contemplative
        if (emotions.slice(-2).every(e => e === 'gentle_reflective') && 
            emotions.slice(-4, -2).some(e => e !== 'gentle_reflective')) {
            return 'contemplative_shift';
        }
        
        // Check for emotional consistency 
        if (uniqueEmotions.length === 1) {
            return 'consistent_' + uniqueEmotions[0];
        }
        
        return 'varied';
    }
    
    /**
     * Show cognitive insight to user
     */
    showCognitiveInsight(type, message) {
        // Only show insights occasionally to avoid being intrusive
        if (Math.random() > 0.3) return;
        
        const insight = document.createElement('div');
        insight.className = 'cognitive-insight';
        insight.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            animation: slideDown 0.3s ease-out;
        `;
        
        insight.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 18px;">🧠</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(insight);
        
        // Add slide down animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            insight.style.opacity = '0';
            insight.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                if (insight.parentNode) insight.remove();
                if (style.parentNode) style.remove();
            }, 500);
        }, 4000);
        
        this.log(`🧠 Cognitive insight (${type}): ${message}`);
    }

    /**
     * Handle detected pattern with enhanced analysis
     */
    onPatternDetected(pattern) {
        this.log(`🔍 Pattern detected: ${pattern.type} (confidence: ${pattern.confidence})`);
        
        // Award XP for pattern detection
        this.awardCreativeXP('pattern_detected');
        
        // Add to session patterns
        this.currentSession.patterns.push(pattern);
        
        // Perform doodle analysis based on Manus's specifications
        const doodleAnalysis = this.analyzeDoodle(pattern);
        
        // Show analysis to user occasionally
        if (doodleAnalysis && Math.random() > 0.7) {
            this.showDoodleAnalysis(doodleAnalysis);
        }
        
        // Check for pattern completion achievement
        if (pattern.confidence > 0.8) {
            this.awardCreativeXP('pattern_completion');
            this.creativeAchievements.unlock(`pattern_${pattern.type}`);
        }
    }
    
    /**
     * Analyze doodle based on Manus's doodle analysis system
     * Returns complexity, flow, and color metrics
     */
    analyzeDoodle(pattern) {
        try {
            if (!pattern.strokes || pattern.strokes.length === 0) return null;
            
            // Calculate complexity metric
            const complexityMetric = this.calculateComplexityMetric(pattern.strokes);
            
            // Calculate flow metric (number of strokes)
            const flowMetric = pattern.strokes.length;
            
            // Calculate color diversity
            const colorDiversity = this.calculateColorDiversity(pattern.strokes);
            
            // Calculate total path length
            const totalLength = this.calculateTotalPathLength(pattern.strokes);
            
            const analysis = {
                complexity_metric: Math.round(totalLength), 
                flow_metric: flowMetric,              
                color_diversity: colorDiversity,
                
                // Additional cognitive metrics
                intensity_level: pattern.cognitiveState ? pattern.cognitiveState.intensityLevel : 0.5,
                focus_quality: pattern.cognitiveState ? pattern.cognitiveState.focusState : 0.5,
                emotional_tone: pattern.cognitiveState ? pattern.cognitiveState.emotionalTone : 'neutral',
                
                // Pattern-specific metrics
                pattern_type: pattern.type,
                confidence_score: pattern.confidence,
                
                // Achievement triggers
                achievements: this.generateDoodleAchievements(complexityMetric, flowMetric, colorDiversity, totalLength)
            };
            
            return analysis;
            
        } catch (error) {
            this.log('⚠️ Doodle analysis failed:', error);
            return null;
        }
    }
    
    /**
     * Calculate complexity metric as per pseudocode
     */
    calculateComplexityMetric(strokes) {
        let totalLength = 0;
        
        strokes.forEach((stroke, i) => {
            if (i > 0) {
                // Simplified distance calculation
                totalLength += this.calculateStrokeLength(stroke);
            }
        });
        
        return totalLength;
    }
    
    /**
     * Calculate total path length for all strokes
     */
    calculateTotalPathLength(strokes) {
        return strokes.reduce((total, stroke) => {
            return total + this.calculateStrokeLength(stroke);
        }, 0);
    }
    
    /**
     * Calculate length of individual stroke
     */
    calculateStrokeLength(stroke) {
        try {
            if (stroke.path && stroke.path.getTotalLength) {
                return stroke.path.getTotalLength();
            }
            // Fallback calculation based on complexity
            return (stroke.complexity || 1) * 100;
        } catch (e) {
            return 100; // Default length
        }
    }
    
    /**
     * Calculate color diversity in the drawing
     */
    calculateColorDiversity(strokes) {
        const colors = new Set();
        
        strokes.forEach(stroke => {
            if (stroke.color) {
                colors.add(stroke.color);
            }
        });
        
        // Add current drawing color
        if (this.settings && this.settings.strokeColor) {
            colors.add(this.settings.strokeColor);
        }
        
        return colors.size || 1;
    }
    
    /**
     * Generate achievements based on doodle metrics
     */
    generateDoodleAchievements(complexity, flow, colorDiversity, totalLength) {
        const achievements = [];
        
        // Complexity achievements
        if (complexity > 1000) {
            achievements.push({
                id: 'the_long_path',
                title: 'The Long Path',
                description: `Complexity: ${Math.round(complexity)}`
            });
        }
        
        // Flow achievements
        if (flow === 1) {
            achievements.push({
                id: 'single_stroke_master',
                title: 'Single Stroke Master',
                description: 'Drawn in one continuous stroke'
            });
        } else if (flow >= 10) {
            achievements.push({
                id: 'detail_artist',
                title: 'Detail Artist',
                description: `${flow} individual strokes`
            });
        }
        
        // Color achievements
        if (colorDiversity >= 3) {
            achievements.push({
                id: 'color_explorer',
                title: 'Color Explorer',
                description: `Used ${colorDiversity} different colors`
            });
        }
        
        // Total length achievements
        if (totalLength > 2000) {
            achievements.push({
                id: 'marathon_drawer',
                title: 'Marathon Drawer',
                description: `Drew ${Math.round(totalLength)}px of lines`
            });
        }
        
        return achievements;
    }
    
    /**
     * Show doodle analysis to user
     */
    showDoodleAnalysis(analysis) {
        const analysisMessage = this.formatAnalysisMessage(analysis);
        
        const analysisDiv = document.createElement('div');
        analysisDiv.className = 'doodle-analysis';
        analysisDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(59, 130, 246, 0.95);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-size: 13px;
            max-width: 300px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideUp 0.3s ease-out;
        `;
        
        analysisDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 16px;">📊</span>
                <strong>Doodle Analysis</strong>
            </div>
            ${analysisMessage}
        `;
        
        document.body.appendChild(analysisDiv);
        
        // Add slide up animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            analysisDiv.style.opacity = '0';
            analysisDiv.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                if (analysisDiv.parentNode) analysisDiv.remove();
                if (style.parentNode) style.remove();
            }, 500);
        }, 5000);
        
        // Award achievements
        if (analysis.achievements && analysis.achievements.length > 0) {
            analysis.achievements.forEach(achievement => {
                this.creativeAchievements.unlock(achievement.id);
                console.log(`🏆 Achievement unlocked: ${achievement.title}`);
            });
        }
    }
    
    /**
     * Format analysis message for display
     */
    formatAnalysisMessage(analysis) {
        let message = `
            <div style="margin: 0.5rem 0;">
                <strong>Metrics:</strong><br>
                • Complexity: ${analysis.complexity_metric}<br>
                • Strokes: ${analysis.flow_metric}<br>
                • Colors: ${analysis.color_diversity}
            </div>
        `;
        
        if (analysis.emotional_tone) {
            const toneTranslations = {
                'intense_engaged': 'Έντονη δέσμευση',
                'focused_deliberate': 'Στοχευμένη προσέγγιση',
                'gentle_reflective': 'Απαλή στοχαστικότητα',
                'calm_focused': 'Ήρεμη εστίαση'
            };
            
            message += `
                <div style="margin: 0.5rem 0;">
                    <strong>Cognitive State:</strong><br>
                    ${toneTranslations[analysis.emotional_tone] || analysis.emotional_tone}
                </div>
            `;
        }
        
        if (analysis.achievements && analysis.achievements.length > 0) {
            message += `
                <div style="margin: 0.5rem 0;">
                    <strong>🏆 Achievements:</strong><br>
                    ${analysis.achievements.map(a => `• ${a.title}`).join('<br>')}
                </div>
            `;
        }
        
        return message;
    }

    /**
     * Get XP progress percentage for current level
     */
    getXPProgress() {
        const currentLevelXP = this.creativeLevel > 0 ? this.creativeLevels[this.creativeLevel].xpRequired : 0;
        const nextLevelXP = this.getNextLevelXP();
        
        if (nextLevelXP === currentLevelXP) return 100;
        
        const progressXP = this.creativeXP - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        
        return Math.min(100, (progressXP / requiredXP) * 100);
    }

    /**
     * Get XP required for next level
     */
    getNextLevelXP() {
        const nextLevel = this.creativeLevel + 1;
        return this.creativeLevels[nextLevel] ? this.creativeLevels[nextLevel].xpRequired : this.creativeXP;
    }

    /**
     * Apply creative level styling to the interface
     */
    applyCreativeLevelStyling() {
        const levelData = this.creativeLevels[this.creativeLevel];
        
        document.documentElement.style.setProperty('--scribble-saga-primary-color', levelData.color);
        document.body.className = document.body.className.replace(/creative-level-\d+/g, '');
        document.body.classList.add(`creative-level-${this.creativeLevel}`);
    }

    /**
     * Show basic level up notification
     */
    showLevelUpNotification(oldLevel, newLevel) {
        const levelData = this.creativeLevels[newLevel];
        
        // Simple alert για basic version
        const message = `🌟 Level Up!\n\n${levelData.name}\n${levelData.description}\n\nXP: ${this.creativeXP}`;
        
        setTimeout(() => {
            alert(message);
        }, 100);
    }

    /**
     * Get current creative stats
     */
    getCreativeStats() {
        return {
            level: this.creativeLevel,
            xp: this.creativeXP,
            xpProgress: this.getXPProgress(),
            nextLevelXP: this.getNextLevelXP(),
            unlockedTools: Array.from(this.unlockedTools),
            currentSession: this.currentSession,
            totalAchievements: this.creativeAchievements.getAll().length
        };
    }

    /**
     * Enhanced logging με Scribble Saga prefix
     */
    log(...args) {
        if (this.config && this.config.debug) {
            console.log('[🎨 ScribbleSaga Core]', ...args);
        }
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Save progress before destroying
        this.saveCreativeProgress();
        
        // Call parent destroy
        if (super.destroy) {
            super.destroy();
        }
        
        this.log('🎨 Scribble Saga Core Module destroyed');
    }
}

// Export για module system
window.ScribbleSagaModule = ScribbleSagaModule;