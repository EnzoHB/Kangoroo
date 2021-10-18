class CircularStrip {
    constructor(array, index = 0) {
        this.array = array;

        if (index < 0){
            index %= this.array.length;
            index += this.array.length;
        }

        this.index = index % 
        this.array.length;
    };

    get() {
        return this.array[this.index];
    };

    next() {
        return this.rotate(1);
    };

    prev() {
        return this.rotate(-1);
    };

    set(times) {
        return this.rotate(times);
    };

    rotate(times) {
        
        if (times < 0) {
            times %= this.array.length;
            times += this.array.length;
        }

        return ( 
             this.index = 
            (this.index + times) % 
             this.array.length,
             this
        );
    };

    lookup(steps) {
        if (steps < 0) {
            steps %= this.array.length;
            steps += this.array.length;
        }

        return this.array[
            (this.index + steps) % 
            this.array.length
        ]
    };
};

export default CircularStrip;