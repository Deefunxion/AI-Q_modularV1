class marginaliaModule {
    constructor(app) {
        this.app = app;
        this.config = app.config;
        this.eventManager = app.eventManager;
        this.aiqModule = app.getModule('aiq');
        this.isActive = false;
        this.svg = null;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentPath = null;
        this.lastPoint = null;

        this.settings = {
            strokeColor: '#0000FF',
            strokeWidth: 3,
            opacity: 1.0,
            tool: 'pen', // pen, highlighter, eraser
        };

        this.marginWidth = 120;
        this.fadeZoneWidth = 200;
    }

    async init() {
        this.log('Initializing Marginalia Module...');
        this.createSVGOverlay();
        this.createCanvas();
        this.createControls();
        this.setupEventListeners();
        this.loadAnnotations();
        this.isActive = true;
    }

    createSVGOverlay() {
        this.svg = document.getElementById('marginalia-svg');
        if (!this.svg) {
            this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.svg.id = 'marginalia-svg';
            document.body.appendChild(this.svg);
        }
        this.updateSVGDimensions();
    }

    createCanvas() {
        this.canvas = document.getElementById('fullscreen-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'fullscreen-canvas';
            document.body.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.updateCanvasDimensions();
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'marginalia-controls';
        controls.innerHTML = `
            <button data-tool="pen">Pen</button>
            <button data-tool="highlighter">Highlighter</button>
            <button data-tool="eraser">Eraser</button>
            <input type="color" data-setting="strokeColor" value="${this.settings.strokeColor}">
            <input type="range" data-setting="strokeWidth" min="1" max="20" value="${this.settings.strokeWidth}">
            <button data-action="clear">Clear</button>
        `;
        document.body.appendChild(controls);

        controls.addEventListener('click', (e) => {
            if (e.target.dataset.tool) this.settings.tool = e.target.dataset.tool;
            if (e.target.dataset.action === 'clear') this.clearAnnotations();
        });

        controls.addEventListener('input', (e) => {
            if (e.target.dataset.setting) {
                this.settings[e.target.dataset.setting] = e.target.value;
            }
        });
    }

    setupEventListeners() {
        this.app.eventManager.on('responsive:change', () => {
            this.updateSVGDimensions();
            this.updateCanvasDimensions();
        });

        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleEnd(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleStart(e.touches[0]), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e.touches[0]), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleEnd(e));
    }

    handleStart(e) {
        if (!this.isInDrawingZone(e.clientX, e.clientY)) return;

        this.isDrawing = true;
        this.lastPoint = { x: e.clientX, y: e.clientY };

        if (this.settings.tool === 'pen' || this.settings.tool === 'highlighter') {
            this.currentPath = this.createNewPath(this.lastPoint);
            this.svg.appendChild(this.currentPath);
        } else if (this.settings.tool === 'eraser') {
            this.eraseAtPoint(this.lastPoint);
        }
    }

    handleMove(e) {
        if (!this.isDrawing) return;

        const currentPoint = { x: e.clientX, y: e.clientY };

        if (this.settings.tool === 'pen' || this.settings.tool === 'highlighter') {
            this.addPointToPath(this.currentPath, currentPoint);
        } else if (this.settings.tool === 'eraser') {
            this.eraseAtPoint(currentPoint);
        }

        this.lastPoint = currentPoint;
    }

    handleEnd(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.saveAnnotations();
    }

    isInDrawingZone(x, y) {
        return x <= this.marginWidth || x >= window.innerWidth - this.marginWidth;
    }

    createNewPath(startPoint) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const style = this.getAIQStrokeStyle();
        path.setAttribute('d', `M ${startPoint.x} ${startPoint.y}`);
        path.setAttribute('stroke', this.settings.strokeColor);
        path.setAttribute('stroke-width', style.width);
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', this.getOpacityForPosition(startPoint.x));
        if (style.filter) {
            path.setAttribute('filter', style.filter);
        }
        return path;
    }

    addPointToPath(path, point) {
        if (!path) return;
        const d = path.getAttribute('d') || '';
        path.setAttribute('d', `${d} L ${point.x} ${point.y}`);
    }

    eraseAtPoint(point) {
        const elements = document.elementsFromPoint(point.x, point.y);
        elements.forEach(element => {
            if (element.tagName === 'path' && element.parentElement.id === 'marginalia-svg') {
                element.remove();
            }
        });
    }

    getAIQStrokeStyle() {
        const aiq = this.aiqModule ? this.aiqModule.getAIQ() : 0;
        if (aiq < 100) return { width: this.settings.strokeWidth, filter: null };
        if (aiq < 120) return { width: this.settings.strokeWidth * 1.2, filter: 'url(#glow-filter)' };
        return { width: this.settings.strokeWidth * 1.5, filter: 'url(#master-glow-filter)' };
    }

    isInMarginZone(x) {
        return x <= this.marginWidth || x >= window.innerWidth - this.marginWidth;
    }

    getOpacityForPosition(x) {
        if (this.isInMarginZone(x)) return this.settings.opacity;
        const distanceFromMargin = Math.min(x - this.marginWidth, window.innerWidth - this.marginWidth - x);
        if (distanceFromMargin < this.fadeZoneWidth) {
            return this.settings.opacity * (distanceFromMargin / this.fadeZoneWidth);
        }
        return 0;
    }

    updateSVGDimensions() {
        const docHeight = document.documentElement.scrollHeight;
        this.svg.setAttribute('height', `${docHeight}px`);
    }

    updateCanvasDimensions() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    saveAnnotations() {
        const svgData = this.svg.innerHTML;
        localStorage.setItem('marginalia-annotations', svgData);
    }

    loadAnnotations() {
        const svgData = localStorage.getItem('marginalia-annotations');
        if (svgData) {
            this.svg.innerHTML = svgData;
        }
    }

    clearAnnotations() {
        this.svg.innerHTML = '';
        localStorage.removeItem('marginalia-annotations');
    }

    log(...args) {
        if (this.config && this.config.debug) {
            console.log('[MarginaliaModule]', ...args);
        }
    }
}

window.marginaliaModule = marginaliaModule;