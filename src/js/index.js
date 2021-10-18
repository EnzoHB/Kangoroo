import keyboard from "./keyboard.js";
import AlternativesCard from "./AlternativeCard.js";

const container = document.querySelector('.cards_container');

const availableIndicators = ['#00FF29', '#FAFF00', '#FF0000']
const availableAlternatives = [' ', 'A', 'B', 'C', 'D', 'E'];

const list = [];

for (let i = 1; i <= 10; i++) {

    const options = {
        number: i,
        comment: '',
        alternatives: 0/*Math.floor(Math.random() * 6) /**/,
        indicators: 0 /**/,
        absences: 0,
    };

    const alternative = new AlternativesCard(options);

    console.log(alternative);

    list.push(alternative.container);
};

container.append(...list)

// ----------------------- //

/**/