var blackjackratio = 5;
var cards = [];
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
const potEl = document.getElementById("pot-input")
const playerEl = document.getElementById("player-el");
const startButton = document.getElementById("start-btn");
const doneButton = document.getElementById("done-btn");
const newCardButton = document.getElementById("new-card-btn");
newCardButton.style.display = "none";
doneButton.style.display = "none";
var player = {
    name: JSON.parse(sessionStorage.getItem("username")),
    chips: 100
};
var pot = parseFloat(potEl.value, 10);
var shuffledDeck = [];
var originalDeck = [];
var deckindex = 0;

playerEl.textContent = player.name + ": $" + player.chips

if (localStorage.getItem("recordvalue") === null) {
    localStorage.setItem("recordowner", "Hiçkimse")
    localStorage.setItem("recordvalue", "0")
}
const recordEl = document.getElementById("record-board")
var recordOwner = localStorage.getItem("recordowner")
var recordValue = parseFloat(localStorage.getItem("recordvalue"))
recordEl.textContent = "Rekor: " + JSON.parse(recordOwner) + " ($" + recordValue + ")"


class Card {
    constructor (name, suit, cardvalue) {
    this.name = name;
    this.suit = suit;
    this.cardvalue = cardvalue;
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

for (let j=0; j<4; j++) {
    let suits = ["♣","♦","♠","♥"];
    let suit = suits[j];
    for (let i=1; i<14; i++) {
        switch (i) {
            case 1: 
                originalDeck.push(new Card("A", suit, 11))
                break;
            case 11:
                originalDeck.push(new Card("V", suit, 10))
                break;
            case 12:
                originalDeck.push(new Card("D", suit, 10))
                break;
            case 13:
                originalDeck.push(new Card("R", suit, 10))
                break;
            default:
                originalDeck.push(new Card(i, suit, i))
                break;
        }
    }
};



function startGame() {
    pot = parseFloat(potEl.value, 10)
    if (pot < 0 ) {
        message = "Bahis negatif bir sayı olamaz.";
        messageEl.textContent = message;
    }
    else {
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
    }
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
        message = "Bir Kart daha ister misin?"
    } else if (sum === 21) {
        message = "21! Tebrikler"
        hasBlackJack = true;
        player.chips += blackjackratio * pot;
        playerEl.textContent = player.name + ": $" + player.chips;
    } else {
        message = "Kaybettin!"
        isAlive = false;
        player.chips -= pot;
        playerEl.textContent = player.name + ": $" + player.chips;
    };
    messageEl.textContent = message;
    if (isAlive === false || hasBlackJack) {
        startButton.innerText = "YENİ OYUN";
        startButton.style.display = "";
        newCardButton.style.display = "none";
        doneButton.style.display = "none";
    }
};

function newCard() {
    if (isAlive && hasBlackJack === false) {
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
function dealerTurn(){
    if (dealerSum>21 && dealerAceRights>0) {
        dealerSum -= 10;
        dealerAceRights --;
    }
    if (dealerSum<12) {dealerCard()}
    else {
        switch (dealerSum) {
            case 18:
                if (Math.random()<0.04) {dealerCard()}
                else {dealerDone()}
                break;
            case 17:
                if (Math.random()<0.08) {dealerCard()}
                else {dealerDone()}
                break;
            case 16:
                if (Math.random()<0.3) {dealerCard()}
                else {dealerDone()}
                break;
            case 15:
                if (Math.random()<0.5) {dealerCard()}
                else {dealerDone()}
                break;
            case 14:
                if (Math.random()<0.7) {dealerCard()}
                else {dealerDone()}
                break;
            case 13:
                if (Math.random()<0.85) {dealerCard()}
                else {dealerDone()}
                break;
            case 12:
                if (Math.random()<0.92) {dealerCard()}
                else {dealerDone()}
                break;
            default:
                dealerDone()
                break;
        }
    }
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
        message = "Kazandınız Tebrikler! Bir oyun daha?";
        player.chips += pot;
        playerEl.textContent = player.name + ": $" + player.chips;
        if (localStorage.getItem("recordvalue") < player.chips) {
            localStorage.setItem("recordowner", JSON.stringify(player.name))
            localStorage.setItem("recordvalue", JSON.stringify(player.chips))
            message = "Şimdiye kadar kazandığınız en yüksek değer bu! Bir oyun daha?"
            recordOwner = localStorage.getItem("recordowner")
            recordValue = parseFloat(localStorage.getItem("recordvalue"))
            recordEl.textContent = "Rekor: " + JSON.parse(recordOwner) + " ($" + recordValue + ")"
        }
    }
    else {
        isAlive=false;
        message= "Üzgünüm kaybettiniz. Bir oyun daha?";
        player.chips -= pot;
        playerEl.textContent = player.name + ": $" + player.chips;
    }
    messageEl.textContent = message;
};