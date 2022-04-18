import AlternativesCard from "./AlternativeCard.js";
import { SymbolCard, SquareCard } from "./CountCard.js";
import { GlobalEvent } from "./classes/EventEmitter.js";

const container = document.querySelector('.cards_container');
const container_ = document.querySelector('.container_for_quantity_cards');
const container__ = document.querySelector('.container_for_that_other_stuff_cards');

const list = [];

for (let i = 1; i <= 10; i++) {

    const options = {
        number: i,
        comment: '',
    };

    const card = new AlternativesCard(options);

    //repeat(random(10), 'card.alternative.next()');
    //repeat(random(10), 'card.indicator.next()');
    
    function repeat(times, code) {
        for (let i = 0; i < times; i++) eval(code);
    };

    function random(range) {
        return Math.floor(Math.random() * range);
    };

    list.push(card.container);
};

const isso = ['A', 'B', 'C', 'D', 'E'];
const store = {};

for (let i = 0; i < 5; i++) {
    const enzo = new SymbolCard(isso[i]);
    
    store[isso[i]] = enzo;
    container_.appendChild(enzo.container);
};

const isso1 = ['#00FF29', '#FAFF00', '#FF0000'];
const store1 = {};

for (let i = 0; i < 3; i++) {
    const enzo = new SquareCard(isso1[i]);
    
    store1[isso1[i]] = enzo;
    container__.appendChild(enzo.container);
};

GlobalEvent.on('indicator_state_change', data => {

    store1[data.to]?.add();
    store1[data.from]?.sub();
})

GlobalEvent.on('alternative_state_change', data => {
    store[data.to]?.add();
    store[data.from]?.sub();
})

GlobalEvent.on('balloon_R_click', data => console.log('Enzo'));

container.append(...list)

// ----------------------- //


/**/