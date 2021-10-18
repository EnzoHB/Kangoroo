import CircularStrip from "./CircularStrip.js";
import Events from "./eventEmitter.js";

function createOuterBox() {

    // Standalone
    const outerBox = document.createElement('div');
    const questionNumber = document.createElement('div');

    // Score Indicator
    const score = document.createElement('div');
    const likelihood = document.createElement('div')

    // Alternative section
    const letter = document.createElement('p');
    const letterSquare = document.createElement('div');
    const square = document.createElement('div');

    // Comment section
    const balloon = document.createElement('object');
    const pseudoBalloon = document.createElement('div');

    // Comment indicator section;
    const commentIndicator = document.createElement('div');
    const lineA = document.createElement('div');
    const lineB = document.createElement('div');
    const lineC = document.createElement('div');

    // ------------------ //
    outerBox.setAttribute('class', 'outer_box disable-select');
    questionNumber.setAttribute('class', 'question_number');

    // ------------------ //

    score.setAttribute('class', 'score_indicator');
    likelihood.setAttribute('class', 'likelihood_indicator');
    likelihood.style.visibility = 'hidden';

    // ------------------ //

    letter.setAttribute('class', 'letter');
    letterSquare.setAttribute('class', 'letter_square');
    square.setAttribute('class', 'pseudo_letter_square');

    // ------------------ //

    balloon.setAttribute('class', 'balloon');
    balloon.setAttribute('data', '../svg/comment_balloon.svg');
    pseudoBalloon.setAttribute('class', 'pseudo_balloon');
    pseudoBalloon.style.visibility = 'hidden';

    // ------------------ //

    commentIndicator.setAttribute('class', 'comment_indicator');
    lineA.setAttribute('class', 'lines a');
    lineB.setAttribute('class', 'lines b');
    lineC.setAttribute('class', 'lines c');

    // Appeding everything into the outerbox
    score.append(likelihood)
    square.append(letter);
    pseudoBalloon.append(commentIndicator, lineA, lineB, lineC)
    outerBox.append(letterSquare, square, balloon, pseudoBalloon, score, questionNumber);

    square.addEventListener('click', event => this.alternative.next());
    square.addEventListener('contextmenu', event => (

        event.preventDefault(), 
        this.alternative.prev()
    ));

    likelihood.addEventListener('click', event => (

        event.stopPropagation(),
        this.likelihood.next()
    ));

    likelihood.addEventListener('contextmenu', event => (

        event.preventDefault(), 
        event.stopPropagation(),

        this.likelihood.prev()
    ));

    score.addEventListener('click', event => (
    
        this.alternative.get() != ' ' ? 
        this.indicator.next() :
        this.absence.next()

    ));

    score.addEventListener('contextmenu', event => (
        event.preventDefault(),
        
        this.alternative.get() != ' ' ? 
        this.indicator.prev() :
        this.absence.prev()
    ));

    return outerBox;
};

const AA = [' ', 'A', 'B', 'C', 'D', 'E'];
const AL = ['#00FF29', '#FF0000'];
const AI = ['#00FF29', '#FAFF00', '#FF0000'];
const AB = ['#FFFFFF', '#757575'];

class AlternativesCard {
    constructor({ number, comment, alternatives, indicators, absences, likelihoods }) {

        const container = createOuterBox.call(this);

        const alternative = new CircularStrip(AA, alternatives);
        const likelihood = new CircularStrip(AL, likelihoods);
        const indicator = new CircularStrip(AI, indicators);
        const absence = new CircularStrip(AB, absences);
        const Event = new Events();

        const letter = container.querySelector('.letter');
        const score = container.querySelector('.score_indicator');
        const likeli = container.querySelector('.likelihood_indicator');
        const balloon = container.querySelector('.pseudo_balloon');
        const corner = container.querySelector('.question_number');

        Event.on(`alternative`, data => letter.innerText = data.to);
        Event.on(`alternative`, data => {
            data.to == ' '?
                score.style.background = absence.get() :
                score.style.background = indicator.get();
        });

        Event.on(`alternative`, data => {

            data.to == ' '?
                likeli.style.visibility = 'hidden' :
                indicator.get() == '#FAFF00'? 
                (
                    likeli.style.visibility = 'visible',
                    score.style.background = indicator.get()
                ) : 0;
        });

        Event.on('number', number => corner.innerText = String(number).padStart(2, '0'));
        Event.on('indicator', data => score.style.background =  data.to);
        Event.on('indicator', data => {

            if (data.to == '#FAFF00') {
                likeli.style.background = likelihood.get();
                likeli.style.visibility = 'visible';
            }
            else  
                likeli.style.visibility = 'hidden';

        });

        Event.on('likelihood', data => likeli.style.background = data.to)
        Event.on('comment', comment => {
            comment == ''?
                balloon.style.visibility = 'hidden' :
                balloon.style.visibility = 'visible';
        });

        this.container = container;
        this.localEvent = Event; 

        this.setComment(comment);
        this.setNumber(number);

        this.absence = Interface(absence, 'indicator');
        this.indicator = Interface(indicator, 'indicator');
        this.likelihood = Interface(likelihood, 'likelihood');
        this.alternative = Interface(alternative, 'alternative');

        function Interface(value, name) {
            return {

                next() {
                    const from = value.get();
                    const to = value.next().get();
                    Event.em(name, { from, to });
                },

                prev() {
                    const from = value.get();
                    const to = value.prev().get();
                    Event.em(name, { from, to });
                },

                get() {
                    return value.get();
                }
            };
        };
    };

    setNumber(number) {
        this.number = number;
        this.localEvent.em('number', number);
    };

    setComment(comment) {
        this.comment = comment;
        this.localEvent.em('comment', comment);
    };
}

export default AlternativesCard;