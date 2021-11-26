var cards = [];
var blackjackratio = 5;
var dealerCards = [];
var sum = 0;
var dealerSum = 0;
var hasBlackJack = false;
var isAlive = false;
var aceRights = 0;
var dealerAceRights = 0;
var message = "";
const messageEl = document.getElementById("message-el");
const sumEl = document.getElementById("sum-el");
const dealerSumEl = document.getElementById("dealer-sum-el");
const cardsEl = document.getElementById("cards-el");
const dealerCardsEl = document.getElementById("dealer-cards-el");
const playerEl = document.getElementById("player-el");
const startButton = document.getElementById("start-btn");
const doneButton = document.getElementById("done-btn");
const newCardButton = document.getElementById("new-card-btn");
newCardButton.style.display = "none";
doneButton.style.display = "none";
var player = {
    name: "Oyuncu",
    chips: 100
};
var pot = 10;
var shuffledDeck = [];
var originalDeck = [];
var deckindex = 0;

playerEl.textContent = player.name + ": $" + player.chips + " Pot: $" + pot;

class kart {
    constructor (name, suit, cardvalue) {
    this.name = name;
    this.suit = suit;
    this.cardvalue = cardvalue;
    }
};

for (let j=0; j<4; j++) {
    let suits = ["♣","♦","♠","♥"];
    let suit = suits[j] ;
    for (let i=1; i<14; i++) {
        if (i===1) {
            originalDeck.push(new kart("A", suit, 11))
        }
        else if (i===11) {
            originalDeck.push(new kart("V", suit, 10))
        }
        else if (i===12) {
            originalDeck.push(new kart("D", suit, 10))
        }
        else if (i===13) {
            originalDeck.push(new kart("R", suit, 10))
        }
        else {
            originalDeck.push(new kart(i, suit, i))
        }
    }
};

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};


function startGame() {
    isAlive = true;
    shuffledDeck = shuffle(originalDeck);
    aceRights = 0;
    dealerAceRights = 0;
    let firstCard = shuffledDeck[0];
    if (firstCard.name === "A") {aceRights ++};
    let secondCard = shuffledDeck[1];
    if (secondCard.name === "A") {aceRights ++};
    deckindex = 2;
    cards = [firstCard.suit, firstCard.name, secondCard.suit, secondCard.name];
    sum = firstCard.cardvalue + secondCard.cardvalue;
    dealerCards = [];
    dealerCardsEl.innerText = dealerCards;
    dealerSum = 0;
    dealerSumEl.innerText = "";
    startButton.style.display = "none";
    newCardButton.style.display = "";
    doneButton.style.display = "";
    hasBlackJack = false;
    renderGame();
};

function renderGame() {
    cardsEl.textContent = "Kartların: "
    for (let i = 0; i < cards.length; i=i+2) {
        cardsEl.textContent += cards[i] + cards[i+1]+ " "
    };
    if (sum>21 && cards.includes("A") && aceRights>0 ) {
        sum -=10
        aceRights--
    };
    sumEl.textContent = "Toplam: " + sum;
    if (sum <= 20) {
        message = "Bir kart daha ister misin?"
    } else if (sum === 21) {
        message = "21! Tebrikler"
        hasBlackJack = true
        player.chips += blackjackratio * pot
        playerEl.textContent = player.name + ": $" + player.chips + " Pot: $" + pot
    } else {
        message = "Kaybettin!"
        isAlive = false
        player.chips -= pot
        playerEl.textContent = player.name + ": $" + player.chips + " Pot: $" + pot
    };
    messageEl.textContent = message;
    if (isAlive === false || hasBlackJack) {
        startButton.innerText = "YENİ OYUN";
        startButton.style.display = "";
        newCardButton.style.display = "none";
        doneButton.style.display = "none";
    }
}

function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let yeniKart = shuffledDeck[deckindex];
        if (yeniKart.name === "A") {aceRights++};
        deckindex ++;
        sum += yeniKart.cardvalue;
        cards.push(yeniKart.suit);
        cards.push(yeniKart.name);
        renderGame();
    };
};

function finishGame() {
    startButton.style.display = "";
    newCardButton.style.display ="none";
    doneButton.style.display = "none";
    dealerCards = "Dealer Kartları:";
    startButton.innerText = "YENİ OYUN";
    dealerTurn();
};

function dealerTurn() {
    if (dealerSum>21 && dealerAceRights>0) {
        dealerSum -= 10;
        dealerAceRights --;
    }
    if (dealerSum>18) {dealerDone()}
    else if (dealerSum===18){
        if (Math.random()<0.04) {dealerCard()}
        else {dealerDone()}
    }
    else if (dealerSum===17){
        if (Math.random()<0.08) {dealerCard()}
        else {dealerDone()}
    }
    else if (dealerSum===16){
        if (Math.random()<0.3) {dealerCard()}
        else {dealerDone()}
    }
    else if (dealerSum===15){
        if (Math.random()<0.5) {dealerCard()}
        else {dealerDone()}
    }
    else if (dealerSum===14){
        if (Math.random()<0.7) {dealerCard()}
        else {dealerDone()}
    }
    else if (dealerSum===13){
        if (Math.random()<0.85) {dealerCard()}
        else {dealerDone()}
    }
    else if (dealerSum===12){
        if (Math.random()<0.92) {dealerCard()}
        else {dealerDone()}
    }
    else {dealerCard()}
}

function dealerCard() {
    yeniKart = shuffledDeck[deckindex];
    if (yeniKart.name === "A") {dealerAceRights ++};
    deckindex ++;
    dealerSum += yeniKart.cardvalue;
    dealerCards += yeniKart.suit + yeniKart.name + " ";
    dealerCardsEl.textContent = dealerCards;
    dealerSumEl.innerText = "Dealer Toplam: " + dealerSum;
    dealerTurn();
}

function dealerDone() {
    if (dealerSum<sum || dealerSum>21) {
        message="Kazandınız Tebrikler! Bir oyun daha?";
        player.chips += pot;
        playerEl.textContent = player.name + ": $" + player.chips + " Pot: $" + pot;
        }
    else {
        isAlive=false;
        message= "Üzgünüm kaybettiniz. Bir oyun daha?";
        player.chips -= pot;
        playerEl.textContent = player.name + ": $" + player.chips + " Pot: $" + pot;
    }
    messageEl.textContent = message;
};