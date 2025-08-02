/**
 * Content Manager - Handles loading and managing content data
 */

class ContentManager {
    constructor(options = {}) {
        this.contentPath = options.contentPath || '/data';
        this.preload = options.preload || false;
        this.cache = new Map();
        this.contentData = null;
    }

    /**
     * Initialize the content manager
     */
    async init() {
        try {
            // Load main content file
            await this.loadContentData();
            
            // Preload chapters if enabled
            if (this.preload) {
                await this.preloadChapters();
            }
            
        } catch (error) {
            console.error('Failed to initialize ContentManager:', error);
            throw error;
        }
    }

    /**
     * Load content data from embedded source or external file
     */
    async loadContentData() {
        try {
            // First try to load from embedded data (for file:// protocol compatibility)
            if (window.EMBEDDED_CONTENT_DATA) {
                this.log('Loading content from embedded data');
                this.contentData = window.EMBEDDED_CONTENT_DATA;
                return;
            }
            
            // Fallback to fetch for HTTP/HTTPS protocols
            this.log('Loading content from external file');
            const response = await fetch('/data/content.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.contentData = await response.json();
            this.log('Content data loaded successfully');
            
        } catch (error) {
            console.error('Failed to load content data:', error);
            
            // Fallback to default content structure
            this.log('Using fallback content structure');
            this.contentData = this.getDefaultContent();
        }
    }

    /**
     * Get chapter data by ID
     */
    async getChapter(chapterId) {
        if (!this.contentData) {
            await this.loadContentData();
        }

        const chapter = this.contentData.chapters[chapterId];
        if (!chapter) {
            throw new Error(`Chapter not found: ${chapterId}`);
        }

        return chapter;
    }

    /**
     * Get all available chapters
     */
    getAvailableChapters() {
        if (!this.contentData) {
            return [];
        }

        return this.contentData.navigation.chapters.filter(chapter => chapter.available);
    }

    /**
     * Get user progress data
     */
    getUserProgress() {
        if (!this.contentData) {
            return null;
        }

        return this.contentData.userProgress;
    }

    /**
     * Update user progress
     */
    updateUserProgress(progressData) {
        if (!this.contentData) {
            return;
        }

        this.contentData.userProgress = { ...this.contentData.userProgress, ...progressData };
        
        // Save to localStorage
        this.saveProgressToStorage();
    }

    /**
     * Mark chapter as completed
     */
    markChapterCompleted(chapterId) {
        if (!this.contentData) {
            return;
        }

        const progress = this.contentData.userProgress;
        if (!progress.completedChapters.includes(chapterId)) {
            progress.completedChapters.push(chapterId);
        }

        // Update current chapter to next available
        const chapters = this.contentData.navigation.chapters;
        const currentIndex = chapters.findIndex(ch => ch.id === chapterId);
        if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            if (nextChapter.available) {
                progress.currentChapter = nextChapter.id;
            }
        }

        this.saveProgressToStorage();
    }

    /**
     * Get metadata
     */
    getMetadata() {
        if (!this.contentData) {
            return null;
        }

        return this.contentData.metadata;
    }

    /**
     * Search content
     */
    searchContent(query) {
        if (!this.contentData || !query) {
            return [];
        }

        const results = [];
        const searchTerm = query.toLowerCase();

        // Search through chapters
        Object.values(this.contentData.chapters).forEach(chapter => {
            // Search in title
            if (chapter.title.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'chapter',
                    id: chapter.id,
                    title: chapter.title,
                    match: 'title'
                });
            }

            // Search in elements
            chapter.elements.forEach((element, index) => {
                if (element.content && element.content.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'content',
                        chapterId: chapter.id,
                        elementIndex: index,
                        title: chapter.title,
                        content: this.extractTextFromHTML(element.content),
                        match: 'content'
                    });
                }
            });
        });

        return results;
    }

    /**
     * Extract text from HTML content
     */
    extractTextFromHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    /**
     * Preload chapters
     */
    async preloadChapters() {
        // Content is already loaded in the main file
        // This method can be extended for additional resources
        console.log('Content preloaded');
    }

    /**
     * Save progress to localStorage
     */
    saveProgressToStorage() {
        try {
            const progress = this.getUserProgress();
            localStorage.setItem('aiOrchestrator:progress', JSON.stringify(progress));
        } catch (error) {
            console.error('Failed to save progress to storage:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgressFromStorage() {
        try {
            const saved = localStorage.getItem('aiOrchestrator:progress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.updateUserProgress(progress);
                return progress;
            }
        } catch (error) {
            console.error('Failed to load progress from storage:', error);
        }
        return null;
    }

    /**
     * Get chapter navigation info
     */
    getChapterNavigation(currentChapterId) {
        if (!this.contentData) {
            return null;
        }

        const chapters = this.contentData.navigation.chapters;
        const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);
        
        if (currentIndex === -1) {
            return null;
        }

        return {
            current: chapters[currentIndex],
            previous: currentIndex > 0 ? chapters[currentIndex - 1] : null,
            next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
            total: chapters.length,
            position: currentIndex + 1
        };
    }

    /**
     * Check if chapter is available
     */
    isChapterAvailable(chapterId) {
        if (!this.contentData) {
            return false;
        }

        const chapter = this.contentData.navigation.chapters.find(ch => ch.id === chapterId);
        return chapter ? chapter.available : false;
    }

    /**
     * Get reading statistics
     */
    getReadingStats() {
        if (!this.contentData) {
            return null;
        }

        const progress = this.contentData.userProgress;
        const totalChapters = this.contentData.navigation.chapters.length;
        const completedChapters = progress.completedChapters.length;
        
        return {
            totalChapters,
            completedChapters,
            completionPercentage: Math.round((completedChapters / totalChapters) * 100),
            currentLevel: progress.currentLevel,
            totalReadingTime: progress.totalReadingTime,
            aiqPoints: progress.aiqPoints
        };
    }

    /**
     * Add reading time
     */
    addReadingTime(minutes) {
        if (!this.contentData) {
            return;
        }

        this.contentData.userProgress.totalReadingTime += minutes;
        this.saveProgressToStorage();
    }

    /**
     * Add AI-Q points
     */
    addAIQPoints(points) {
        if (!this.contentData) {
            return;
        }

        this.contentData.userProgress.aiqPoints += points;
        this.saveProgressToStorage();
    }

    /**
     * Get content for specific element type
     */
    getElementsOfType(type) {
        if (!this.contentData) {
            return [];
        }

        const elements = [];
        Object.values(this.contentData.chapters).forEach(chapter => {
            chapter.elements.forEach(element => {
                if (element.type === type) {
                    elements.push({
                        ...element,
                        chapterId: chapter.id,
                        chapterTitle: chapter.title
                    });
                }
            });
        });

        return elements;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.cache.clear();
        this.contentData = null;
    }
}

// Export for use in other modules
window.ContentManager = ContentManager;


    /**
     * Get default content structure for fallback
     */
    getDefaultContent() {
        return {
            "metadata": {
                "title": "AI Orchestrator's Ascent",
                "subtitle": "Ο Οδηγός του Έξυπνου Αρχάρια",
                "author": "AI Orchestrator Team",
                "version": "1.0.0",
                "language": "el",
                "totalChapters": 1
            },
            "chapters": [
                {
                    "id": "demo-chapter",
                    "title": "Δοκιμαστικό Κεφάλαιο",
                    "subtitle": "Εισαγωγή στο νέο σύστημα",
                    "level": "Beginner",
                    "estimatedTime": "10 λεπτά",
                    "content": {
                        "introduction": "Καλώς ήρθατε στο νέο modular σύστημα του AI Orchestrator's Ascent!",
                        "sections": [
                            {
                                "id": "section-1",
                                "title": "Νέα Αρχιτεκτονική",
                                "content": "Αυτό το σύστημα έχει ανασχεδιαστεί από την αρχή με modular αρχιτεκτονική που υποστηρίζει όλες τις υπάρχουσες λειτουργίες και προετοιμάζει το έδαφος για μελλοντικές επεκτάσεις.",
                                "type": "text"
                            },
                            {
                                "id": "section-2", 
                                "title": "Διαδραστικές Λειτουργίες",
                                "content": "Το σύστημα περιλαμβάνει:\n- Interactive Reading με progress tracking\n- SVG Marginalia για σημειώσεις\n- AI-Q progression system\n- Responsive design για όλες τις συσκευές",
                                "type": "text"
                            },
                            {
                                "id": "exercise-1",
                                "title": "Δοκιμαστική Άσκηση",
                                "content": "Αυτή είναι μια δοκιμαστική άσκηση για να δείτε πώς λειτουργεί το σύστημα.",
                                "type": "exercise",
                                "difficulty": "easy",
                                "expectedTime": 300000
                            }
                        ]
                    },
                    "exercises": [
                        {
                            "id": "exercise-1",
                            "title": "Πρώτη Άσκηση",
                            "description": "Δοκιμάστε τις βασικές λειτουργίες",
                            "type": "interactive",
                            "difficulty": "easy"
                        }
                    ],
                    "navigation": {
                        "previous": null,
                        "next": null
                    }
                }
            ]
        };
    }



// Export to global scope
window.ContentManager = ContentManager;

