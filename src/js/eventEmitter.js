class EventEmitter extends Map {

    on(name, callback) {

        this.set(name, (
        this.get(name) || new Set ).add(callback));
    };

    rm(name, callback) {

        this.set(name, (
        this.get(name) || new Set ).delete(callback));
    };

    em(name, data, context = {}) {
        this.get(name)?.forEach(func => func.call(context, data));
    };
};

const Events = EventEmitter;
const GlobalEvents = new EventEmitter;

export { Events, GlobalEvents }