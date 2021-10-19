import keyboard from "./keyboard.js";
import AlternativesCard from "./AlternativeCard.js";
import { SymbolCounterCard } from "./CountCard.js";
import { GlobalEvents } from "./eventEmitter.js";

const container = document.querySelector('.cards_container');
const container_ = document.querySelector('.container_for_quantity_cards');
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
    const enzo = new SymbolCounterCard(isso[i]);
    
    store[isso[i]] = enzo;
    container_.appendChild(enzo.container);
};

GlobalEvents.on('alternative_change', data => {
    store[data.to]?.add();
    store[data.from]?.sub();
})

container.append(...list)

// ----------------------- //

/**/