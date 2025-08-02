/**
 * Module Loader - Dynamic module loading and dependency management
 */

class ModuleLoader {
    constructor(options = {}) {
        this.basePath = options.basePath || '/js/modules';
        this.cache = new Map();
        this.loading = new Map();
        this.dependencies = new Map();
        this.loadOrder = [];
        this.debug = options.debug || false;
    }

    /**
     * Load a module
     */
    async loadModule(moduleName, options = {}) {
        try {
            this.log(`Loading module: ${moduleName}`);
            
            // Check if already loaded
            if (this.cache.has(moduleName)) {
                this.log(`Module ${moduleName} already loaded`);
                return this.cache.get(moduleName);
            }
            
            // Check if currently loading
            if (this.loading.has(moduleName)) {
                this.log(`Module ${moduleName} is already loading, waiting...`);
                return await this.loading.get(moduleName);
            }
            
            // Start loading
            const loadPromise = this._loadModuleInternal(moduleName, options);
            this.loading.set(moduleName, loadPromise);
            
            try {
                const module = await loadPromise;
                this.loading.delete(moduleName);
                return module;
            } catch (error) {
                this.loading.delete(moduleName);
                throw error;
            }
            
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }

    /**
     * Internal module loading logic
     */
    async _loadModuleInternal(moduleName, options) {
        // Load dependencies first
        if (this.dependencies.has(moduleName)) {
            const deps = this.dependencies.get(moduleName);
            await this.loadDependencies(deps);
        }
        
        // Load the module script
        await this.loadScript(moduleName, options);
        
        // Get module constructor
        const ModuleConstructor = this.getModuleConstructor(moduleName);
        if (!ModuleConstructor) {
            throw new Error(`Module constructor not found: ${moduleName}Module`);
        }
        
        // Create module instance
        const moduleInstance = new ModuleConstructor(options.app || window.AIOrchestrator);
        
        // Initialize module if it has init method
        if (typeof moduleInstance.init === 'function') {
            await moduleInstance.init();
        }
        
        // Cache the module
        this.cache.set(moduleName, moduleInstance);
        this.loadOrder.push(moduleName);
        
        this.log(`Module ${moduleName} loaded successfully`);
        return moduleInstance;
    }

    /**
     * Load module dependencies
     */
    async loadDependencies(dependencies) {
        const loadPromises = dependencies.map(dep => this.loadModule(dep));
        await Promise.all(loadPromises);
    }

    /**
     * Load module script
     */
    async loadScript(moduleName, options = {}) {
        const scriptPath = options.scriptPath || `${this.basePath}/${moduleName}.js`;
        
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
            if (existingScript) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = scriptPath;
            script.async = true;
            
            script.onload = () => {
                this.log(`Script loaded: ${scriptPath}`);
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${scriptPath}`));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Get module constructor
     */
    getModuleConstructor(moduleName) {
        // Try different naming conventions
        const possibleNames = [
            `${moduleName}Module`,
            `${this.capitalize(moduleName)}Module`,
            `${moduleName.toUpperCase()}Module`,
            moduleName,
            this.capitalize(moduleName)
        ];
        
        for (const name of possibleNames) {
            if (window[name] && typeof window[name] === 'function') {
                return window[name];
            }
        }
        
        return null;
    }

    /**
     * Register module dependencies
     */
    registerDependencies(moduleName, dependencies) {
        this.dependencies.set(moduleName, dependencies);
        this.log(`Registered dependencies for ${moduleName}:`, dependencies);
    }

    /**
     * Preload modules
     */
    async preloadModules(moduleNames) {
        this.log('Preloading modules:', moduleNames);
        
        const loadPromises = moduleNames.map(name => this.loadModule(name));
        const results = await Promise.allSettled(loadPromises);
        
        const successful = [];
        const failed = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                successful.push(moduleNames[index]);
            } else {
                failed.push({
                    module: moduleNames[index],
                    error: result.reason
                });
            }
        });
        
        this.log(`Preloading complete. Successful: ${successful.length}, Failed: ${failed.length}`);
        
        if (failed.length > 0) {
            console.warn('Some modules failed to preload:', failed);
        }
        
        return { successful, failed };
    }

    /**
     * Get loaded module
     */
    getModule(moduleName) {
        return this.cache.get(moduleName);
    }

    /**
     * Check if module is loaded
     */
    isLoaded(moduleName) {
        return this.cache.has(moduleName);
    }

    /**
     * Check if module is loading
     */
    isLoading(moduleName) {
        return this.loading.has(moduleName);
    }

    /**
     * Get all loaded modules
     */
    getLoadedModules() {
        return Array.from(this.cache.keys());
    }

    /**
     * Get load order
     */
    getLoadOrder() {
        return [...this.loadOrder];
    }

    /**
     * Unload module
     */
    unloadModule(moduleName) {
        const module = this.cache.get(moduleName);
        
        if (module) {
            // Call destroy method if available
            if (typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (error) {
                    console.error(`Error destroying module ${moduleName}:`, error);
                }
            }
            
            // Remove from cache
            this.cache.delete(moduleName);
            
            // Remove from load order
            const index = this.loadOrder.indexOf(moduleName);
            if (index !== -1) {
                this.loadOrder.splice(index, 1);
            }
            
            this.log(`Module ${moduleName} unloaded`);
            return true;
        }
        
        return false;
    }

    /**
     * Reload module
     */
    async reloadModule(moduleName, options = {}) {
        this.unloadModule(moduleName);
        return await this.loadModule(moduleName, options);
    }

    /**
     * Load modules in sequence
     */
    async loadSequential(moduleNames, options = {}) {
        const results = [];
        
        for (const moduleName of moduleNames) {
            try {
                const module = await this.loadModule(moduleName, options);
                results.push({ module: moduleName, instance: module, success: true });
            } catch (error) {
                results.push({ module: moduleName, error, success: false });
                
                if (options.stopOnError) {
                    break;
                }
            }
        }
        
        return results;
    }

    /**
     * Load modules in parallel
     */
    async loadParallel(moduleNames, options = {}) {
        const loadPromises = moduleNames.map(async (moduleName) => {
            try {
                const instance = await this.loadModule(moduleName, options);
                return { module: moduleName, instance, success: true };
            } catch (error) {
                return { module: moduleName, error, success: false };
            }
        });
        
        return await Promise.all(loadPromises);
    }

    /**
     * Create module manifest
     */
    createManifest() {
        return {
            loaded: this.getLoadedModules(),
            loadOrder: this.getLoadOrder(),
            dependencies: Object.fromEntries(this.dependencies),
            timestamp: Date.now()
        };
    }

    /**
     * Load from manifest
     */
    async loadFromManifest(manifest, options = {}) {
        // Register dependencies
        Object.entries(manifest.dependencies || {}).forEach(([module, deps]) => {
            this.registerDependencies(module, deps);
        });
        
        // Load modules in order
        if (options.respectOrder && manifest.loadOrder) {
            return await this.loadSequential(manifest.loadOrder, options);
        } else {
            return await this.loadParallel(manifest.loaded || [], options);
        }
    }

    /**
     * Utility: Capitalize string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Logging
     */
    log(...args) {
        if (this.debug) {
            console.log('[ModuleLoader]', ...args);
        }
    }

    /**
     * Get module statistics
     */
    getStats() {
        return {
            totalLoaded: this.cache.size,
            currentlyLoading: this.loading.size,
            loadOrder: this.getLoadOrder(),
            dependencies: Object.fromEntries(this.dependencies)
        };
    }

    /**
     * Clear all modules
     */
    clear() {
        // Unload all modules
        const moduleNames = [...this.cache.keys()];
        moduleNames.forEach(name => this.unloadModule(name));
        
        // Clear all data
        this.cache.clear();
        this.loading.clear();
        this.dependencies.clear();
        this.loadOrder = [];
        
        this.log('All modules cleared');
    }

    /**
     * Destroy module loader
     */
    destroy() {
        this.clear();
    }
}

// Export for use in other modules
window.ModuleLoader = ModuleLoader;

