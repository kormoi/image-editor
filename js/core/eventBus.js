export default class EventBus {

    constructor() {

        this.events = new Map();

        this.debug = true;

    }

    on(eventName, callback) {

        if (!this.events.has(eventName)) {

            this.events.set(eventName, []);

        }

        this.events.get(eventName).push(callback);

    }

    once(eventName, callback) {

        const wrapper = (...args) => {

            this.off(eventName, wrapper);

            callback(...args);

        };

        this.on(eventName, wrapper);

    }

    off(eventName, callback) {

        if (!this.events.has(eventName)) return;

        const listeners = this.events.get(eventName);

        const index = listeners.indexOf(callback);

        if (index !== -1) {

            listeners.splice(index, 1);

        }

    }

    emit(eventName, payload = null) {

        if (this.debug) {

            console.log(
                `%cEVENT`,
                "color:#4f9cff;font-weight:bold;",
                eventName,
                payload
            );

        }

        if (!this.events.has(eventName)) return;

        const listeners = [...this.events.get(eventName)];

        for (const listener of listeners) {

            try {

                listener(payload);

            } catch (error) {

                console.error(
                    `EventBus Error (${eventName})`,
                    error
                );

            }

        }

    }

    clear(eventName = null) {

        if (eventName === null) {

            this.events.clear();

            return;

        }

        this.events.delete(eventName);

    }

    listenerCount(eventName) {

        if (!this.events.has(eventName)) {

            return 0;

        }

        return this.events.get(eventName).length;

    }

}