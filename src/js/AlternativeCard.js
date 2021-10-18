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

    // Tiding everything up

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
        
        const alternative = new CircularStrip(AA, alternatives);
        const likelihood = new CircularStrip(AL, likelihoods);
        const indicator = new CircularStrip(AI, indicators);
        const absence = new CircularStrip(AB, absences);

        const Event = new Events();
        const container = createOuterBox.call(this);

        // ------------------ //

        this.container = container;
        this.localEvent = Event; 

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

        Event.on(`alternative`, data => {
            this.container.querySelector('.letter').innerText = data.to;
        });

        Event.on(`alternative`, data => {
            data.to == ' '?
                this.container.querySelector('.score_indicator').style.background = this.absence.get() :
                this.container.querySelector('.score_indicator').style.background = this.indicator.get();
        });

        Event.on(`alternative`, data => {

            data.to == ' '?
                this.container.querySelector('.likelihood_indicator').style.visibility = 'hidden' :
                this.indicator.get() == '#FAFF00'? 
                (
                    this.container.querySelector('.likelihood_indicator').style.visibility = 'visible',
                    this.container.querySelector('.score_indicator').style.background = this.indicator.get()
                ) : 0;
        });

        Event.on('indicator', data => {
            this.container.querySelector('.score_indicator').style.background =  data.to;
        });

        Event.on('indicator', data => {

            if (data.to == '#FAFF00') {
                this.container.querySelector('.likelihood_indicator').style.background = this.likelihood.get();
                this.container.querySelector('.likelihood_indicator').style.visibility = 'visible';
            }
            else  
                this.container.querySelector('.likelihood_indicator').style.visibility = 'hidden';

        });

        Event.on('likelihood', data => {
            this.container.querySelector('.likelihood_indicator').style.background = data.to;
        })

        Event.on('comment', comment => {
            comment == ''?
                this.container.querySelector('.pseudo_balloon').style.visibility = 'hidden' :
                this.container.querySelector('.pseudo_balloon').style.visibility = 'visible';
        });

        Event.on('number', number => {
            this.container.querySelector('.question_number').innerText = String(number).padStart(2, '0');
        });

        this.setComment(comment);
        this.setNumber(number);
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

/*

/*

        // ------------------ //

        this.setAlternative(0);
        this.setLikelihood(1, 0)
        this.setAbsence(0);
        this.setComment('');
        this.setNumber(0);

        // Changing alternatives right-click
        square.addEventListener('click', () => {

            this.setAlternative(1)

            const previous = this.alternative.lookup(-1);
            const get = this.alternative.get();

            if (get == ' ') {
                this.setAbsence(0);
                this.setLikelihood(1, 0)
            }

            if (previous == ' ') {
                this.setIndicator(0);

                if (this.indicator.get() == '#FAFF00') 
                    this.setLikelihood(1, 1);
            }
        });

        // Changing alternatives left-click
        square.addEventListener('contextmenu', event => {
            event.preventDefault();
            this.setAlternative(-1)

            const prev = this.alternative.lookup(1);
            const get = this.alternative.get();

            if (get == ' ') {
                this.setAbsence(0);
                this.setLikelihood(1, 0)
            }

            if (prev == ' ') {
                this.setIndicator(0);

                if (this.indicator.get() == '#FAFF00') 
                    this.setLikelihood(1, 1);
            }
        });

        // Changing indicator right-click
        score.addEventListener('click', () => {

            const alternative = this.alternative.get();

            if (alternative == ' ')
                this.setAbsence(1);
            else this.setIndicator(1);

            const indicator = this.indicator.get();

            if (indicator == '#FAFF00' && alternative != ' ') {
                this.setLikelihood(1, 1);
                this.setLikelihood(0, 0);
            };

            if (indicator != '#FAFF00' && alternative != ' ')
                this.setLikelihood(1, 0);
        });

        // Changing indicator left-click
        score.addEventListener('contextmenu', event => {
            event.preventDefault();

            const alternative = this.alternative.get();
            
            if (alternative == ' ')
                this.setAbsence(-1);
            else this.setIndicator(-1);

            const indicator = this.indicator.get();

            if (indicator == '#FAFF00'  && alternative != ' ') {
                this.setLikelihood(1, 1);
                this.setLikelihood(0, 0);
            };

            if (indicator != '#FAFF00' && alternative != ' ')
                this.setLikelihood(1, 0);

                this.alternative.get()
        });

        likelihood.addEventListener('click', event => {
            event.stopPropagation();

            this.setLikelihood(0, 1);
        });

        likelihood.addEventListener('contextmenu', event => {
            event.stopPropagation();
            event.preventDefault();

            this.setLikelihood(0, -1);
        });
    };

    setAbsence(type, value) {

        const absence = this.absence;
        const score = this.container.querySelector('.score_indicator');

        type == 0?
            score.style.background = absence.get() :
            type == 2?
                score.style.background = value :
                type == 1?
                    score.style.background = absence.next().get() :
                    score.style.background = absence.next().get() ;
    };

    setIndicator(type, value) {

        const indicator = this.indicator;
        const score = this.container.querySelector('.score_indicator');

        type == 0?
            score.style.background = indicator.get() :
            type == 2?
                score.style.background = value :
                type == 1?
                    score.style.background = indicator.next().get() :
                    score.style.background = indicator.next().get() ;

        
    };

    setAlternative(type) {

        const alternative = this.alternative;
        const letter = this.container.querySelector('.letter');

        type == 0?
            letter.innerText = alternative.get() :
            type == 1?
                letter.innerText = alternative.next().get() :
                letter.innerText = alternative.next().get() ;
    };

    setComment(text) {

        const comment = this.comment = text;
        const pseudoBalloon = this.container.querySelector('.pseudo_balloon');

        if (comment !== '')
            return pseudoBalloon.style.visibility = 'visible';
            return pseudoBalloon.style.visibility = 'hidden';
    };

    setLikelihood(type, command) {

        const likelihood = this.likelihood;
        const likelihood = this.container.querySelector('.likelihood_indicator');
    
        type == 1?
            command == 1 ?
                likelihood.style.visibility = 'visible' :
                likelihood.style.visibility = 'hidden' :
            command == 0 ?
                likelihood.style.background = likelihood.get() :
                command == 1?
                    likelihood.style.background = likelihood.next().get() :
                    likelihood.style.background = likelihood.prev().get() ;


    };

    setNumber() {
        const number = this.number;
        const questionNumber = this.container.querySelector('.question_number')

        questionNumber.innerText = String(number).padStart(2, '0');
    };

};

function a() {

    letterSquare.addEventListener('click', event => alternative.next());
    letterSquare.addEventListener('contextmenu', event => (

        event.preventDefault(), 
        this.alternative.prev()
    ));

    score.addEventListener('click', event => indicator.next());
    score.addEventListener('contextmenu', event => (

        event.preventDefault(), 
        this.indicator.prev()
    ));

    likelihood.addEventListener('click', event => likelihood.next());
    likelihood.addEventListener('contextmenu', event => (

        event.preventDefault(), 
        this.likelihood.prev()
    ));
};

// Inside alternative 
/*
{
    value: CircularArray[]
    next() {};
    prev() {};
}


// Inside alternative.next
function an() {

    const from = value.get();
    const to = value.next().get();

    emit('alternative', { from, to });
};

/**/
