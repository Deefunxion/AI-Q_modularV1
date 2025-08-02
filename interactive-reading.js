
class interactiveReadingModule {
    constructor(app) {
        this.app = app;
        this.config = app.config;
        this.eventManager = app.eventManager;
        this.aiqModule = app.getModule('aiq');
    }

    async init() {
        this.log('Initializing Interactive Reading Module...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.eventManager.on('chapter:loaded', (chapterData) => {
            this.enhanceChapter(chapterData);
        });
    }

    enhanceChapter(chapterData) {
        const contentWrapper = document.getElementById('main-content');
        if (!contentWrapper) return;

        const elements = contentWrapper.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        elements.forEach(element => {
            this.makeInteractive(element);
        });
    }

    makeInteractive(element) {
        if (element.classList.contains('interactive-enhanced')) return;

        const interactionContainer = document.createElement('div');
        interactionContainer.className = 'element-interaction-container';
        element.parentNode.insertBefore(interactionContainer, element);
        interactionContainer.appendChild(element);
        element.classList.add('interactive-enhanced');

        const commitButton = this.createCommitButton();
        interactionContainer.appendChild(commitButton);

        commitButton.addEventListener('click', () => this.commitElement(element, commitButton));

        interactionContainer.addEventListener('mouseenter', () => {
            if (!element.classList.contains('element-committed')) {
                commitButton.classList.add('visible');
            }
        });

        interactionContainer.addEventListener('mouseleave', () => {
            if (!commitButton.classList.contains('clicked')) {
                commitButton.classList.remove('visible');
            }
        });
    }

    createCommitButton() {
        const button = document.createElement('button');
        button.className = 'commit-button';
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        return button;
    }

    commitElement(element, button) {
        if (element.classList.contains('element-committed')) return;

        element.classList.add('element-committed');
        button.classList.add('clicked');

        const xp = this.getElementXP(element);
        this.eventManager.emit('interactive:elementCommitted', { element, xp });

        if (this.aiqModule) {
            const typographyLevel = this.aiqModule.getAIQLevel ? this.aiqModule.getAIQLevel() : 0;
            this.applyTypographyLevel(element, typographyLevel);
            this.aiqModule.increaseAIQ(xp);
        }

        this.triggerAnimations(element, button);

        setTimeout(() => button.remove(), 400);
    }

    triggerAnimations(element, button) {
        // Brain cell glowing
        const brainCell = document.createElement('span');
        brainCell.className = 'status-icon brain-cell-active';
        brainCell.innerHTML = '🧠';
        element.insertBefore(brainCell, element.firstChild);

        // Electrical synapse animation
        const aiqIndicator = document.getElementById('aiq-indicator');
        if (aiqIndicator) {
            this.createElectricalSynapseAnimation(button, aiqIndicator);
        }

        // Particle effects
        this.createSparkleBurst(button);
    }

    getElementXP(element) {
        const tagName = element.tagName.toLowerCase();
        const textLength = element.textContent.trim().length;
        
        switch (tagName) {
            case 'h1': return 50;
            case 'h2': return 35;
            case 'h3': return 25;
            case 'h4': case 'h5': case 'h6': return 15;
            case 'p':
                if (textLength < 50) return 5;
                if (textLength < 150) return 10;
                if (textLength < 300) return 15;
                return 20;
            case 'li':
                if (textLength < 30) return 3;
                if (textLength < 100) return 5;
                return 8;
            default: return 5;
        }
    }

    applyTypographyLevel(element, levelNumber) {
        const level = `level-${levelNumber}`;
        element.classList.remove('level-0', 'level-1', 'level-2', 'level-3', 'level-4');
        element.classList.add(level);
    }

    createElectricalSynapseAnimation(fromElement, toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        const spark = document.createElement('div');
        spark.className = 'electrical-spark';
        document.body.appendChild(spark);

        spark.style.setProperty('--spark-start-x', `${fromRect.left + fromRect.width / 2}px`);
        spark.style.setProperty('--spark-start-y', `${fromRect.top + fromRect.height / 2}px`);
        spark.style.setProperty('--spark-end-x', `${toRect.left + toRect.width / 2}px`);
        spark.style.setProperty('--spark-end-y', `${toRect.top + toRect.height / 2}px`);

        spark.style.animation = 'electrical-spark-travel 0.8s ease-out forwards';

        setTimeout(() => spark.remove(), 800);
    }

    createSparkleBurst(element) {
        const rect = element.getBoundingClientRect();
        const burstContainer = document.createElement('div');
        burstContainer.className = 'particle-burst';
        document.body.appendChild(burstContainer);

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'sparkle-particle';
            burstContainer.appendChild(particle);
        }

        setTimeout(() => burstContainer.remove(), 1000);
    }

    log(...args) {
        if (this.config && this.config.debug) {
            console.log('[InteractiveReadingModule]', ...args);
        }
    }
}

window.interactiveReadingModule = interactiveReadingModule;
