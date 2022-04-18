import CircularStrip from "./classes/CircularStrip.js";
import { ClassNames, EventNames } from './names.js';
import { Events, GlobalEvent } from "./classes/EventEmitter.js";

// ---------------- Available ---------------- //

// Table with the available Alternatives, Indicators
// Likelihoods, and absences.

const AA = [' ', 'A', 'B', 'C', 'D', 'E'];
const AL = ['#00FF29', '#FF0000'];
const AI = ['#00FF29', '#FAFF00', '#FF0000'];
const AB = ['#FFFFFF', '#757575'];

// ---------------- Alternatives Card ---------------- //

// Main class that holds and emits information
// about the state of the alternatives, score and comment
// Event-Driven Architecture

class AlternativesCard {
    constructor({ number, comment }) {

        // ------------- Container Creator ------------- //

        // This function creates the HTML for an Alternative 
        // Card and sets up some listeners for clicks

        function createOuterBox() {
        
            // --------- HTML Elements --------- //
        
            // Creating the HTML elements is actually 
            // a pretty ugly part of the code. That's why
            // its separated in parts
        
            const outerBox = document.createElement('div');
            const questionNumber = document.createElement('div');
        
            // ------ Score Indicator section ------ //
        
            const score = document.createElement('div');
            const likelihood = document.createElement('div')
        
            // ------ Alternative section ------ //
        
            const letter = document.createElement('p');
            const letterSquare = document.createElement('div');
            const square = document.createElement('div');
        
            // ------ Comment section ------ //
        
            const balloon = document.createElement('object');
            const pBalloon = document.createElement('div');
        
            // ------ Comment indicator section ------ //
        
            const commentIndicator = document.createElement('div');
            const lineA = document.createElement('div');
            const lineB = document.createElement('div');
            const lineC = document.createElement('div');
        
            // --------------------------------------- //
        
            outerBox.classList.add(ClassNames.box, 'disable_select');
            questionNumber.classList.add(ClassNames.number);
        
            // --------------------------------------- //
        
            score.classList.add(ClassNames.score)
            likelihood.classList.add(ClassNames.likelihood)
            likelihood.style.visibility = 'hidden';
        
            // --------------------------------------- //
        
            letter.classList.add(ClassNames.letter);
            square.classList.add(ClassNames.letterContainer);
            letterSquare.classList.add(ClassNames.letterDecorator);
        
            // --------------------------------------- //
        
            balloon.setAttribute('class', 'balloon');
            balloon.setAttribute('data', '../svg/comment_balloon.svg');
            pBalloon.setAttribute('class', 'pseudo_balloon');
            pBalloon.style.visibility = 'hidden';
        
            // --------------------------------------- //
        
            commentIndicator.setAttribute('class', 'comment_indicator');
            lineA.setAttribute('class', 'lines a');
            lineB.setAttribute('class', 'lines b');
            lineC.setAttribute('class', 'lines c');
        
            // ------------ Apending ----------------- //
        
            // Appeding everything together into a single
            // container and creating the final element
        
            score.append(likelihood);
            square.append(letter);
            outerBox.append(letterSquare, square, balloon, pBalloon, score, questionNumber);
            pBalloon.append(commentIndicator, lineA, lineB, lineC);
        
            // ------------ Listeners ----------------- //
        
            // Listening for clicks from both left 
            // and right button of the mouse, sometimes
            // preventing the propagagtion and default behavior
        
            // Click in the letter
            square.addEventListener('click', event => this.alternative.next());
            square.addEventListener('contextmenu', event => (
            
                event.preventDefault(), 
                this.alternative.prev()
            ));
            
            // Right-Click in the little circle
            likelihood.addEventListener('click', event => (
            
                event.stopPropagation(),
                this.likelihood.next()
            ));
            
            // Left-Click in the little circle
            likelihood.addEventListener('contextmenu', event => (
            
                event.preventDefault(), 
                event.stopPropagation(),
            
                this.likelihood.prev()
            ));
            
            // Right-Click in the little circle
            score.addEventListener('click', event => (
            
                this.alternative.get() != ' ' ? 
                this.indicator.next() :
                this.absence.next()
            
            ));
            
            // Left-Click in the little circle
            score.addEventListener('contextmenu', event => (
                event.preventDefault(),

                this.alternative.get() != ' ' ? 
                this.indicator.prev() :
                this.absence.prev()
            ));

            balloon.addEventListener('click', () => {
                console.log('Enzo');
                GlobalEvent.em('balloon_R_click', { card: this })
            });

            balloon.addEventListener('contextmenu', event => {
                event.preventDefault();

                GlobalEvent.em('balloon_L_click', { card: this })
            });

             // ------------ End ----------------- //
            
            return outerBox;
        };

        // ----------------- Main code ----------------- //

        // Consists in creating the container, setting up
        // the logic and some event listeners.
 
        const Event = new Events();
        const container = createOuterBox.call(this);

        // -------------- Interface ------------------- //

        // The interface has methods similar to the CircularStrip
        // Class, but acts as a wrapper for emitting events.

        const indicator = Interface ( 
             'indicator',
             new CircularStrip(AI),
        );

        const alternative = Interface ( 
            'alternative',
            new CircularStrip(AA),
        );

        const absence = Interface ( 
             'absence',
             new CircularStrip(AB),
        );

        const likelihood = Interface ( 
             'likelihood',
             new CircularStrip(AL),
        );

        // ----------------- HTML Elements ----------------- //

        // Queries the main elements needed in order for the
        // Alterantive Card to work. 

        const letter = container.querySelector('.letter');
        const score = container.querySelector('.score_indicator');
        const likeli = container.querySelector('.likelihood_indicator');
        const balloon = container.querySelector('.pseudo_balloon');
        const corner = container.querySelector('.question_number');

        // ----------------- Event Listeners ----------------- //

        // In order to separate the logic from everything else, 
        // I decided to use Event-Driven Architeture. 

        // Setting things in a straight forward way
        Event.on('likelihood', data => likeli.style.background = data.to);
        Event.on('alternative', data => letter.innerText = data.to);
        Event.on('indicator', data => score.style.background = data.to);
        Event.on('absence', data => score.style.background = data.to);

        // If the letter is empty, clear the score and hide the likeli 
        Event.on('alternative', data => {
            if (data.to == ' ') {
                absence.set();
                indicator.unset();
                
                likeli.style.visibility = 'hidden';
            }
        });

        // If the letter is not empty, take things back to where they were
        Event.on('alternative', data => {
            if (data.from == ' ') {
                if (indicator.get() == '#FAFF00')
                    likeli.style.visibility = 'visible';

                    likelihood.set();
                    indicator.set();
            };
        });

        // If the color is yellow, turn the likeli visible 
        Event.on('indicator', data => {
            likelihood.set();

            data.to == '#FAFF00'? 
                likeli.style.visibility = 'visible' :
                likeli.style.visibility = 'hidden' ;
        });

        // Emitting globally
        Event.on('alternative', data => GlobalEvent.em('alternative_state_change', data));
        Event.on('indicator', data => GlobalEvent.em('indicator_state_change', data));
        Event.on('absence', data => GlobalEvent.em('indicator_state_change', data));

        // Internal 
        Event.on('number', number => corner.innerText = String(number).padStart(2, '0'));
        Event.on('comment', comment => {
            comment != ''?
                balloon.style.visibility = 'visible' :
                balloon.style.visibility = 'hidden' ;
        });

        // -------- Assigning to the constructor --------- //

        // Pretty straight forward, just assigning 
        // everything to the constructor

        this.container = container;
        this.localEvent = Event; 

        this.setComment(comment);
        this.setNumber(number);

        this.absence = absence;
        this.indicator = indicator;
        this.likelihood = likelihood;
        this.alternative = alternative;

        // --------------- Interface ------------------- //

        // Interface is a wrapper around the CircularStrip
        // class that

        function Interface(name, strip) {
            let from;
            let to;

            return {

                next() {
                    from = strip.get();
                    to = strip.next().get();

                    Event.em(name, { from, to });
                },

                prev() {
                    from = strip.get();
                    to = strip.prev().get();

                    Event.em(name, { from, to });
                },

                set() {
                    to = strip.get();

                    Event.em(name, { to });
                },

                unset() {
                    from = strip.get()

                    Event.em(name, { from })
                },

                get() {
                    return strip.get();
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