import { Events, GlobalEvent } from "./classes/EventEmitter.js";
import Counter from "./classes/Counter.js";

class CounterCard {
    constructor(container) {
        this.container = container();
        this.counter = new Counter();
        this.localEvent = new Events();
    };

    add() {
        this.localEvent.em('add', 
        this.counter.add());
    };

    sub() {
        this.localEvent.em('sub', 
        this.counter.sub());
    };
}

class SquareCard extends CounterCard {
    constructor(color) {

        function createOuter() {
    
            // Standalone
            const outer = document.createElement('div');
            const inner = document.createElement('div');
            const square = document.createElement('div');
            const quantity = document.createElement('div');
        
            // ------------- //

            outer.classList.add('green', 'ones');
            inner.classList.add('inner_square');
            square.classList.add('square');
            quantity.classList.add('quantity');

            // Tiding

            square.append(inner);
            outer.append(square, quantity);

            return outer;
        };

        super(createOuter);

        const number_ = this.container.querySelector('.quantity');
        const square_ = this.container.querySelector('.inner_square');

        this.localEvent.on('add', counter => number_.innerText = counter.padStart(2))
        this.localEvent.on('sub', counter => number_.innerText = counter.padStart(2))
        this.localEvent.on('init',counter => number_.innerText = counter.padStart(2), square_.style.background = color)
        this.localEvent.em('init', this.counter);
    };
};

class SymbolCard extends CounterCard {
    constructor(symbol) {

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

        super(createOuter);

        const number_ = this.container.querySelector('.number');
        const symbol_ = this.container.querySelector('.letter_')

        this.localEvent.on('add', counter => number_.innerText = counter.padStart(2))
        this.localEvent.on('sub', counter => number_.innerText = counter.padStart(2))
        this.localEvent.on('init',counter => number_.innerText = counter.padStart(2), symbol_.innerText = symbol)
        this.localEvent.em('init', this.counter);
    };
};

export {  
    SymbolCard,
    SquareCard
}