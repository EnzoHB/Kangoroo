import keyboard from "./keyboard.js";
import AlternativesCard from "./AlternativeCard.js";

const container = document.querySelector('.cards_container');
const list = [];

for (let i = 1; i <= 10; i++) {

    const options = {
        number: i,
        comment: '',
    };

    const card = new AlternativesCard(options);

    repeat(random(10), 'card.alternative.next()');
    repeat(random(10), 'card.indicator.next()');
    
    function repeat(times, code) {
        for (let i = 0; i < times; i++) eval(code);
    };

    function random(range) {
        return Math.floor(Math.random() * range);
    };

    list.push(card.container);
    console.log(card);
};

container.append(...list)

// ----------------------- //

/**/