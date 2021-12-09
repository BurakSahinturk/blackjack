class Card {
    constructor (name, suit, value) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.imageSrc = 'images/' + this.suit + this.name + ".png"
    this.alt = this.suit + " " + this.name
    }
};

class Deck {
    constructor () {
        this.completeDeck = [];
        for (let j=0; j<4; j++) {
            let suits = ["♣","♦","♠","♥"];
            let suit = suits[j];
            for (let i=1; i<14; i++) {
                switch (i) {
                    case 1: 
                        this.completeDeck.push(new Card("A", suit, 11));
                        break;
                    case 11:
                        this.completeDeck.push(new Card("J", suit, 10));
                        break;
                    case 12:
                        this.completeDeck.push(new Card("Q", suit, 10));
                        break;
                    case 13:
                        this.completeDeck.push(new Card("K", suit, 10));
                        break;
                    default:
                        this.completeDeck.push(new Card(i, suit, i));
                        break;
                }
            }
        }
    };

    shuffle = function() {
        var m = this.completeDeck.length, t, i;
        while (m) {
          i = Math.floor(Math.random() * m--);
          t = this.completeDeck[m];
          this.completeDeck[m] = this.completeDeck[i];
          this.completeDeck[i] = t;
        }
        return this.completeDeck;
    };
    
    drawCard = function() {
        return this.completeDeck.shift();
    };
}

class Player {
    constructor() {
        this.hand = [];         //Player's cards
        this.sum = 0;           //Sum of cards' values
        this.numOfCards = 0;
        this.numOfAces = 0;
        this.numOfFaces = 0;
        this.isAlive = false;
        this.chips = 100;
    }
    addCard(card, parentElement) {
        this.hand.push(card);
        this.numOfCards ++;
        this.sum += card.value;
        if (card.name === "A") {this.numOfAces ++};
        if (card.name === "J" || card.name === "Q" || card.name === "K") { this.numOfFaces ++};
        let img = document.createElement('img');
        img.src = card.imageSrc;
        img.alt = card.alt;
        img.classList.add("added-card");
        let parentElementString = '#'+parentElement + '-hand';
        document.querySelector(parentElementString).appendChild(img); // I need help here. It could just use objects name instead of this "parentElement" paerameter. Find a solution!!!
    }

    isBJ() {
        if (this.sum === 21 && this.numOfFaces === 1 && this.numOfAces === 1) {return true}
    }
    reset() {
        this.hand = [];
        this.sum = 0;
        this.numOfCards = 0;
        this.numOfAces = 0;
        this.numOfFaces = 0;
        this.isAlive = true;
    }
}

class Table {
    constructor() {
    }
    reset() {
        while (document.querySelector(".added-card")) {
            var discardedCards = document.querySelector(".added-card");
            discardedCards.remove();
        }
    }
    hideStarterCards() {
        playerFirstCardEl.style.display = "none";
        playerSecondCardEl.style.display = "none";
        dealerFirstCardEl.style.display = "none";
        dealerSecondCardEl.style.display = "none";
    }
    writeScore() {
        playerEl.textContent = player.name + ": $" + player.chips;
    }
    toggleButtonsOn() {
        startButton.style.display = "none";
        newCardButton.style.display = "";
        stayButton.style.display = "";
    }
    toggleButtonsOff() {
        startButton.innerText = "YENİ OYUN";
        startButton.style.display = "";
        newCardButton.style.display = "none";
        stayButton.style.display = "none";
    }
    releasePot() {
        potEl.removeAttribute("disabled");
    }
    lockPot() {
        potEl.setAttribute("disabled", "");
    }
    finish() {
        this.toggleButtonsOff();
        potEl.removeAttribute("disabled"); //Release Pot input
        playerEl.textContent = player.name + ": $" + player.chips; //Show current score
    }
}

const messageEl = document.getElementById("message-el");
const playerSumEl = document.getElementById("player-sum-el");
const dealerSumEl = document.getElementById("dealer-sum-el");
const potEl = document.getElementById("pot-input")
const playerEl = document.getElementById("player-el");
const startButton = document.getElementById("start-btn");
const stayButton = document.getElementById("stay-btn");
const newCardButton = document.getElementById("new-card-btn");
const dealerFirstCardEl = document.getElementById("dealer-first-card");
const playerFirstCardEl = document.getElementById("player-first-card");
const dealerSecondCardEl = document.getElementById("dealer-second-card");
const playerSecondCardEl = document.getElementById("player-second-card"); //HTML elements linking

var blackjackratio = 5; //The multiplier that will be applied to the pot for having a Blackjack. This is multiplier is supposed to be changed by the player. Interface to be added later
var pot = parseFloat(potEl.value, 10); // Set The Pot, that input thingy is getting numbers as strings. I must be doing something wrong. I need to study that
let player = new Player; //set Human Player
let dealer = new Player;
let deck = new Deck; //Is naming the class objects as lowercase class names a good idea? I feel like I'm gonna have trouble with that
let table = new Table

startButton.addEventListener('click', () => {startGame()}) //Start the game
newCardButton.addEventListener('click', () => {playerTaps()}) //Human player draws a new card
stayButton.addEventListener('click', function() { //Human player stays and dealer's turn start
    document.querySelector('#dealer-hand > img.added-card').setAttribute('src', dealer.hand[0].imageSrc);
    dealerSumEl.innerText = "Toplam: " + dealer.sum;
    newCardButton.style.display = "none";
    stayButton.style.display = "none";
    message("Dealer kartlarına bakıyor...");
    setTimeout(dealerTurn,1000);
})

function message(string) {
    messageEl.textContent = string;
};

playerEl.textContent = player.name + ": $" + player.chips;

function startGame() {
    pot = parseFloat(potEl.value, 10);
    if (pot < 0 ) {
        message("Bahis negatif bir sayı olamaz.");
    }
    else {
        deck = new Deck;
        player.reset();
        dealer.reset();  // Reset the players
        table.lockPot(); // Doesn't matter functionally, it won't recieve the pot value again but disabling it improves interface
        table.reset();
        deck.shuffle();
        player.addCard(deck.drawCard(), "player");
        dealer.addCard(deck.drawCard(), "dealer");
        player.addCard(deck.drawCard(), "player"); //Draw two cards for the human player
        dealer.addCard(deck.drawCard(), "dealer"); //Draw two cards for the dealer
        table.hideStarterCards();
        table.toggleButtonsOn();
        document.querySelector('#dealer-hand > img.added-card').setAttribute('src', 'images/Card_back_01.png'); // Face down the first Card the dealer gets
        playerSumEl.innerText = "Toplam: " + player.sum;
        dealerSumEl.innerText = "Açık kart: " + dealer.hand[1].value
        renderGame();
    }
};

function renderGame() {
    if (player.sum > 21 && player.numOfAces>0) {
        player.sum -=10;
        player.numOfAces--;
    };
    playerSumEl.textContent = "Toplam: " + player.sum;
    if (player.sum < 21) {
        message("Bir Kart daha ister misin?");
    } else if (player.sum === 21) {
        if (player.isBJ()) {player.chips += blackjackratio*pot} //Only a 21 with an ace and a face counts as blackjack!
        else {player.chips += pot}
        message("21! Tebrikler");
        table.finish();
    } else {
        message("Kaybettin!");
        player.isAlive = false;
        player.chips -= pot;
        potEl.removeAttribute("disabled");
        table.finish();
    };
};

function playerTaps() {
    if (player.isAlive && player.sum !== 21) {
        player.addCard(deck.drawCard(), "player");
        renderGame();
    };
};

function dealerTurn(){
    if (dealer.sum>21 && dealer.numOfAces>0) {
        dealer.sum -= 10;
        dealer.numOfAces --;
    };
    dealerSumEl.innerText = "Toplam: " + dealer.sum;
    if (dealer.sum<12) {dealerTaps()}
    else {
        switch (dealer.sum) {
            case 18:
                if (Math.random()<0.04) {dealerTaps()}
                else {dealerWaves()};
                break;
            case 17:
                if (Math.random()<0.08) {dealerTaps()}
                else {dealerWaves()};
                break;
            case 16:
                if (Math.random()<0.3) {dealerTaps()}
                else {dealerWaves()};
                break;
            case 15:
                if (Math.random()<0.5) {dealerTaps()}
                else {dealerWaves()};
                break;
            case 14:
                if (Math.random()<0.7) {dealerTaps()}
                else {dealerWaves()};
                break;
            case 13:
                if (Math.random()<0.85) {dealerTaps()}
                else {dealerWaves()};
                break;
            case 12:
                if (Math.random()<0.92) {dealerTaps()}
                else {dealerWaves()};
                break;
            default:
                dealerWaves();
                break;
        }
    }
}

function dealerTaps() {
    message("Dealer kart çekiyor")
    dealer.addCard(deck.drawCard(), "dealer");
    dealerSumEl.innerText = "Toplam: " + dealer.sum;
    setTimeout(dealerTurn,1000);
}

function dealerWaves() {
    if (dealer.sum<player.sum || dealer.sum>21) {
        message("Kazandınız Tebrikler! Bir oyun daha?");
        player.chips += pot;
    }
    else if (dealer.sum === player.sum) {
        message("Berabere... Bir oyun daha?");
    }
    else {
        player.isAlive = false;
        message("Üzgünüm kaybettiniz. Bir oyun daha?");
        player.chips -= pot;
    };
    table.finish();
};

function message(string) {
    messageEl.textContent = string;
};

function dealerNewCard() {
    addedCard = shuffledDeck[deckindex];
    dealerSumEl.innerText = "Dealer Toplam: " + dealer.sum;
    var img = document.createElement('img');
    img.src = "images/PNG-cards-1.3/" + addedCard.suit + addedCard.name + ".png";
    img.alt = addedCard.suit + " " + addedCard.name;
    img.classList.add("added-card");
    document.getElementById("dealer-hand").appendChild(img);
};