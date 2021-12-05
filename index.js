var blackjackratio = 5;
var playerCards = [];
var dealerCards = [];
var playerSum = 0;
var dealerSum = 0;
var hasBlackJack = false;
var isAlive = false;
var aceRights = 0;
var dealerAceRights = 0;
var message = "";
const messageEl = document.getElementById("message-el");
const PlayerSumEl = document.getElementById("player-sum-el");
const dealerSumEl = document.getElementById("dealer-sum-el");
const cardsEl = document.getElementById("player-cards-el");
const dealerCardsEl = document.getElementById("dealer-cards-el");
const potEl = document.getElementById("pot-input")
const playerEl = document.getElementById("player-el");
const startButton = document.getElementById("start-btn");
const doneButton = document.getElementById("done-btn");
const newCardButton = document.getElementById("new-card-btn");
const dealersFirstCardEl = document.getElementById("dealers-first-card")
var player = {
    name: sessionStorage.getItem("username"),
    chips: 100
};
var pot = parseFloat(potEl.value, 10);
var shuffledDeck = [];
var originalDeck = [];
var deckindex = 0;

playerEl.textContent = player.name + ": $" + player.chips;

if (localStorage.getItem("recordvalue") === null) {
    localStorage.setItem("recordowner", "Hiçkimse");
    localStorage.setItem("recordvalue", "0");
}
const recordEl = document.getElementById("record-board");
var recordOwner = localStorage.getItem("recordowner");
var recordValue = parseFloat(localStorage.getItem("recordvalue"));
recordEl.textContent = "Rekor: " + JSON.parse(recordOwner) + " ($" + recordValue + ")";

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
                originalDeck.push(new Card("A", suit, 11));
                break;
            case 11:
                originalDeck.push(new Card("J", suit, 10));
                break;
            case 12:
                originalDeck.push(new Card("Q", suit, 10));
                break;
            case 13:
                originalDeck.push(new Card("K", suit, 10));
                break;
            default:
                originalDeck.push(new Card(i, suit, i));
                break;
        }
    }
};

function startGame() {
    pot = parseFloat(potEl.value, 10);
    if (pot < 0 ) {
        message = "Bahis negatif bir sayı olamaz.";
        messageEl.textContent = message;
    }
    else {
        isAlive = true;
        hasBlackJack = false;
        shuffledDeck = shuffle(originalDeck);
        aceRights = 0;
        dealerAceRights = 0;
        potEl.setAttribute("disabled", "");
        clearDeck()
        let firstCard = shuffledDeck[0];
        if (firstCard.name === "A") {aceRights ++};
        document.getElementById("first-card").setAttribute("src", "images/PNG-cards-1.3/" + firstCard.suit + firstCard.name + ".png")
        document.getElementById("first-card").setAttribute("alt", firstCard.suit + " " + firstCard.name)
        let secondCard = shuffledDeck[1];
        if (secondCard.name === "A") {aceRights ++};
        document.getElementById("second-card").setAttribute("src", "images/PNG-cards-1.3/" + secondCard.suit + secondCard.name + ".png")
        document.getElementById("second-card").setAttribute("alt", secondCard.suit + " " + secondCard.name)
        deckindex = 2;
        playerCards = [firstCard.suit, firstCard.name, secondCard.suit, secondCard.name];
        playerSum = firstCard.cardvalue + secondCard.cardvalue;
        dealerCardsEl.innerText = dealerCards;
        dealerSum = 0;
        dealerSumEl.innerText = "";
        startButton.style.display = "none";
        newCardButton.style.display = "";
        doneButton.style.display = "";
        dealerNewCard();
        renderGame();
    }
};

function renderGame() {
    cardsEl.textContent = "Kartların: ";
    for (let i = 0; i < playerCards.length; i=i+2) {
        cardsEl.textContent += playerCards[i] + playerCards[i+1]+ " "
    };
    if (playerSum>21 && playerCards.includes("A") && aceRights>0 ) {
        playerSum -= 10;
        aceRights--;
    };
    PlayerSumEl.textContent = "Toplam: " + playerSum;
    if (playerSum <= 20) {
        message = "Bir Kart daha ister misin?";
    } else if (playerSum === 21) {
        message = "21! Tebrikler";
        hasBlackJack = true;
        player.chips += blackjackratio * pot;
        potEl.removeAttribute("disabled");
        writeScore();
        checkRecord();
    } else {
        message = "Kaybettin!";
        isAlive = false;
        player.chips -= pot;
        potEl.removeAttribute("disabled");
        writeScore();
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
        let addedCard = shuffledDeck[deckindex];
        if (addedCard.name === "A") {aceRights++};
        deckindex ++;
        playerSum += addedCard.cardvalue;
        playerCards.push(addedCard.suit);
        playerCards.push(addedCard.name);
        var img = document.createElement('img'); 
        img.src = "images/PNG-cards-1.3/" + addedCard.suit + addedCard.name + ".png";
        img.alt = addedCard.suit + " " + addedCard.name;
        img.classList.add("added-card")
        document.getElementById("player-hand").appendChild(img);
        renderGame();
    };
};

function finishGame() {
    startButton.style.display = "";
    newCardButton.style.display ="none";
    doneButton.style.display = "none";
    startButton.innerText = "YENİ OYUN";
    potEl.removeAttribute("disabled");
    dealersFirstCardEl.style.display = "none"
    dealerTurn();
};

function dealerTurn(){
    if (dealerSum>21 && dealerAceRights>0) {
        dealerSum -= 10;
        dealerAceRights --;
    }
    if (dealerSum<12) {dealerTaps()}
    else {
        switch (dealerSum) {
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
    dealerNewCard();
    dealerTurn();
}
function dealerNewCard() {
    addedCard = shuffledDeck[deckindex];
    if (addedCard.name === "A") {dealerAceRights ++};
    deckindex ++;
    dealerSum += addedCard.cardvalue;
    dealerCards += addedCard.suit + addedCard.name + " ";
    dealerCardsEl.textContent = dealerCards;
    dealerSumEl.innerText = "Dealer Toplam: " + dealerSum;
    var img = document.createElement('img'); 
    img.src = "images/PNG-cards-1.3/" + addedCard.suit + addedCard.name + ".png";
    img.alt = addedCard.suit + " " + addedCard.name;
    img.classList.add("added-card")
    document.getElementById("dealer-hand").appendChild(img);
}

function dealerWaves() {
    if (dealerSum<playerSum || dealerSum>21) {
        message = "Kazandınız Tebrikler! Bir oyun daha?";
        player.chips += pot;
        checkRecord();
    }
    else if (dealerSum === playerSum) {
        message = "Berabere... Bir oyun daha?"
    }
    else {
        isAlive = false;
        message = "Üzgünüm kaybettiniz. Bir oyun daha?";
        player.chips -= pot;
    }
    writeScore();
    messageEl.textContent = message;
};

function clearDeck() {
    dealerCards = []
    while (document.querySelector(".added-card")) {
        var discardedCards = document.querySelector(".added-card")
        discardedCards.remove()
        dealersFirstCardEl.style.display = "initial"
    }
    
}

function checkRecord() {
    if (localStorage.getItem("recordvalue") < player.chips) {
        localStorage.setItem("recordowner", JSON.stringify(player.name));
        localStorage.setItem("recordvalue", JSON.stringify(player.chips));
        message = "Şimdiye kadar kazandığınız en yüksek değer bu! Bir oyun daha?";
        recordOwner = localStorage.getItem("recordowner");
        recordValue = parseFloat(localStorage.getItem("recordvalue"));
        recordEl.textContent = "Rekor: " + JSON.parse(recordOwner) + " ($" + recordValue + ")";
    }
}

function writeScore() {
    playerEl.textContent = player.name + ": $" + player.chips;
}