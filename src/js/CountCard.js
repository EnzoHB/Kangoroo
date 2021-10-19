import { Events } from "./eventEmitter.js";
import Counter from "./Counter.js";

function createOuter() {
    
    // Standalone
    const outer = document.createElement('div');
    const count = document.createElement('div');
    const symbol = document.createElement('div');

    // ------------- //

    outer.classList.add('quantity_card');
    count.classList.add('number')
    symbol.classList.add('letter_')

    // Tiding everyhting up
    outer.append(symbol);
    outer.append(count);

    return outer;
};

class SymbolCounterCard {
    constructor(symbol = '-') {

        this.symbol = symbol;
        this.counter = new Counter();
        this.container = createOuter();
        this.localEvent = new Events();

        const number_ = this.container.querySelector('.number');
        const symbol_ = this.container.querySelector('.letter_')

        this.localEvent.on('add', counter => number_.innerText = counter.padStart(2))
        this.localEvent.on('sub', counter => number_.innerText = counter.padStart(2))
        this.localEvent.on('init',counter => number_.innerText = counter.padStart(2), symbol_.innerText = symbol)
        this.localEvent.em('init', this.counter);
    };

    add() {
        this.localEvent.em('sub', 
        this.counter.add());
    };

    sub() {
        this.localEvent.em('sub', 
        this.counter.sub());
    };
}

export {  
    SymbolCounterCard
}