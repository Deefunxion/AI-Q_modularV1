/**
 * Event Manager - Centralized event handling system
 */

class EventManager {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
        this.debug = false;
    }

    /**
     * Add event listener
     */
    on(event, callback, context = null) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        const listener = {
            callback,
            context,
            id: this.generateId()
        };

        this.listeners.get(event).push(listener);

        if (this.debug) {
            console.log(`[EventManager] Added listener for '${event}'`);
        }

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Add one-time event listener
     */
    once(event, callback, context = null) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, []);
        }

        const listener = {
            callback,
            context,
            id: this.generateId()
        };

        this.onceListeners.get(event).push(listener);

        if (this.debug) {
            console.log(`[EventManager] Added one-time listener for '${event}'`);
        }

        // Return unsubscribe function
        return () => this.offOnce(event, callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback = null) {
        if (!this.listeners.has(event)) {
            return false;
        }

        const listeners = this.listeners.get(event);

        if (callback === null) {
            // Remove all listeners for this event
            this.listeners.delete(event);
            if (this.debug) {
                console.log(`[EventManager] Removed all listeners for '${event}'`);
            }
            return true;
        }

        // Remove specific callback
        const index = listeners.findIndex(listener => listener.callback === callback);
        if (index !== -1) {
            listeners.splice(index, 1);
            if (listeners.length === 0) {
                this.listeners.delete(event);
            }
            if (this.debug) {
                console.log(`[EventManager] Removed listener for '${event}'`);
            }
            return true;
        }

        return false;
    }

    /**
     * Remove one-time event listener
     */
    offOnce(event, callback = null) {
        if (!this.onceListeners.has(event)) {
            return false;
        }

        const listeners = this.onceListeners.get(event);

        if (callback === null) {
            // Remove all one-time listeners for this event
            this.onceListeners.delete(event);
            return true;
        }

        // Remove specific callback
        const index = listeners.findIndex(listener => listener.callback === callback);
        if (index !== -1) {
            listeners.splice(index, 1);
            if (listeners.length === 0) {
                this.onceListeners.delete(event);
            }
            return true;
        }

        return false;
    }

    /**
     * Emit event
     */
    emit(event, data = null) {
        if (this.debug) {
            console.log(`[EventManager] Emitting '${event}'`, data);
        }

        let listenersNotified = 0;

        // Handle regular listeners
        if (this.listeners.has(event)) {
            const listeners = [...this.listeners.get(event)]; // Copy to avoid issues if listeners are modified during emission
            
            listeners.forEach(listener => {
                try {
                    if (listener.context) {
                        listener.callback.call(listener.context, data);
                    } else {
                        listener.callback(data);
                    }
                    listenersNotified++;
                } catch (error) {
                    console.error(`[EventManager] Error in listener for '${event}':`, error);
                }
            });
        }

        // Handle one-time listeners
        if (this.onceListeners.has(event)) {
            const listeners = [...this.onceListeners.get(event)]; // Copy array
            this.onceListeners.delete(event); // Remove all one-time listeners for this event

            listeners.forEach(listener => {
                try {
                    if (listener.context) {
                        listener.callback.call(listener.context, data);
                    } else {
                        listener.callback(data);
                    }
                    listenersNotified++;
                } catch (error) {
                    console.error(`[EventManager] Error in one-time listener for '${event}':`, error);
                }
            });
        }

        if (this.debug && listenersNotified === 0) {
            console.log(`[EventManager] No listeners for '${event}'`);
        }

        return listenersNotified;
    }

    /**
     * Check if event has listeners
     */
    hasListeners(event) {
        return (this.listeners.has(event) && this.listeners.get(event).length > 0) ||
               (this.onceListeners.has(event) && this.onceListeners.get(event).length > 0);
    }

    /**
     * Get listener count for event
     */
    getListenerCount(event) {
        let count = 0;
        
        if (this.listeners.has(event)) {
            count += this.listeners.get(event).length;
        }
        
        if (this.onceListeners.has(event)) {
            count += this.onceListeners.get(event).length;
        }
        
        return count;
    }

    /**
     * Get all events with listeners
     */
    getEvents() {
        const events = new Set();
        
        this.listeners.forEach((listeners, event) => {
            if (listeners.length > 0) {
                events.add(event);
            }
        });
        
        this.onceListeners.forEach((listeners, event) => {
            if (listeners.length > 0) {
                events.add(event);
            }
        });
        
        return Array.from(events);
    }

    /**
     * Enable/disable debug mode
     */
    setDebug(enabled) {
        this.debug = enabled;
    }

    /**
     * Generate unique ID for listeners
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Clear all listeners
     */
    clear() {
        this.listeners.clear();
        this.onceListeners.clear();
        
        if (this.debug) {
            console.log('[EventManager] Cleared all listeners');
        }
    }

    /**
     * Create namespaced event emitter
     */
    namespace(prefix) {
        return {
            on: (event, callback, context) => this.on(`${prefix}:${event}`, callback, context),
            once: (event, callback, context) => this.once(`${prefix}:${event}`, callback, context),
            off: (event, callback) => this.off(`${prefix}:${event}`, callback),
            emit: (event, data) => this.emit(`${prefix}:${event}`, data),
            hasListeners: (event) => this.hasListeners(`${prefix}:${event}`),
            getListenerCount: (event) => this.getListenerCount(`${prefix}:${event}`)
        };
    }

    /**
     * Pipe events from one emitter to another
     */
    pipe(sourceEvent, targetEvent = null, transform = null) {
        const target = targetEvent || sourceEvent;
        
        return this.on(sourceEvent, (data) => {
            const transformedData = transform ? transform(data) : data;
            this.emit(target, transformedData);
        });
    }

    /**
     * Create event middleware
     */
    middleware(event, middlewareFunction) {
        const originalListeners = this.listeners.get(event) || [];
        
        // Remove original listeners
        this.listeners.delete(event);
        
        // Add middleware listener
        this.on(event, (data) => {
            const processedData = middlewareFunction(data);
            
            // Call original listeners with processed data
            originalListeners.forEach(listener => {
                try {
                    if (listener.context) {
                        listener.callback.call(listener.context, processedData);
                    } else {
                        listener.callback(processedData);
                    }
                } catch (error) {
                    console.error(`[EventManager] Error in middleware listener for '${event}':`, error);
                }
            });
        });
    }

    /**
     * Batch emit multiple events
     */
    emitBatch(events) {
        if (!Array.isArray(events)) {
            throw new Error('Events must be an array');
        }

        const results = [];
        
        events.forEach(({ event, data }) => {
            const count = this.emit(event, data);
            results.push({ event, listenersNotified: count });
        });
        
        return results;
    }

    /**
     * Wait for event (returns Promise)
     */
    waitFor(event, timeout = null) {
        return new Promise((resolve, reject) => {
            let timeoutId = null;
            
            const cleanup = this.once(event, (data) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                resolve(data);
            });
            
            if (timeout) {
                timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error(`Timeout waiting for event '${event}'`));
                }, timeout);
            }
        });
    }

    /**
     * Destroy event manager
     */
    destroy() {
        this.clear();
        this.listeners = null;
        this.onceListeners = null;
    }
}

// Export for use in other modules
window.EventManager = EventManager;

