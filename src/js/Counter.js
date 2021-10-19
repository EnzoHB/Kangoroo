class Counter {
    constructor() {
        this.counter = 0;
    };

    padStart(length, string = '0') {
        return (
            this.counter.toString().padStart ( length ||
            this.counter.toString().length, string));
    };

    padEnd(length, string) {
        return (
            this.counter.toString().padEnd ( length ||
            this.counter.toString().length, string));
    };

    add(x = 1) {
        return (
            this.counter += x,
            this
        );
    };

    sub(x = 1) {
        return (
            this.counter -= x,
            this
        );
    };
};

export default Counter;