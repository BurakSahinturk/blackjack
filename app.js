/* Issues I've encountered:
    1-in Game class on line 210, Game.dealerTurn method can't be called. To fix the problem game.dealerTurn command is used. it'll be checked if it's about the setTimeOut function or not
    2- */

class Card {
    constructor (name, suit, value) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.imageSrc = 'images/' + this.suit + this.name + ".png"  //Cards are stored in image folder according to this naming rule //(Kartlar görsel dizininde bu kurala göre kayıtlılar)
    this.alt = this.suit + " " + this.name  
    }
};

class Deck {         //Deck is constructed with card objects and stored in a "completeDeck" variable, which will be shuffled when the game will begin with the .shuffle method //(Deste kart sınıfıyla oluşturulmuş ve "completeDeck" adlı bir dizide sıralı olarak saklanmıştır. Oyun başlarken kartlar .shuffle metoduyla karılır)
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
    
    drawCard = function() {                     //(Destede sıradaki kartı verir)
        return this.completeDeck.shift();
    };
}


let playerTargetCount = 0;        //This counter is set for Player instances. (Oyuncu ID'lerini atayan sayaç)

class Player {
    constructor() {
        this.hand = [];         //Player's cards (Oyuncu'nun elindeki kartlar)
        this.sum = 0;           //Sum of cards' values (Oyuncu'nun kartlarının değerleri toplamı)
        this.numOfAces = 0;
        this.numOfFaces = 0;
        this.isAlive = false;
        this.chips = 100;
        this.id = playerTargetCount
        playerTargetCount ++
        this.handDivId = "#hand-" + this.id
        this.sumEl = document.getElementById("sum-el-" + this.id)
    }

    addCard(card) {
        this.hand.push(card);
        this.sum += card.value;
        if (card.name === "A") {this.numOfAces ++};                                               //to check if there are any Aces in the hand to modify the value as either 11 or 1 //(As var mı diye kontrol etmek amacıyla Player attribute, ki Aslar 1 mi yoksa 11 değerini mi alacaklar belirlenebilsin)
        if (card.name === "J" || card.name === "Q" || card.name === "K") { this.numOfFaces ++};
        let img = document.createElement('img');
        img.src = card.imageSrc;
        img.alt = card.alt;
        img.classList.add("added-card");
        document.querySelector(this.handDivId).appendChild(img);
    }

    isBJ() {
        if (this.sum === 21 && this.numOfFaces === 1 && this.numOfAces === 1) {return true}     //Checks blackjack only a combination of a face and an ace counts as BJ //(Sadece resimli kart varsa blackjack sayılır)
    };

    calculateSum() {           // Calculates the sum of cards in the hand and shows it on the page //(Eldeki kartların değerlerini toplar ve bunu sayfada gösterir)
        if (this.sum>21 && this.numOfAces>0) {      //If sum is over 21 and there is an ace in the hand decreases the sum by 10 to make the ace count as "1" //(Toplam değer 21'in üstündeyse ve elde as varsa, toplamdan 10 azaltılır)
            this.sum -= 10;
            this.numOfAces --;
        };
        this.sumEl.innerText = "Toplam: " + this.sum; // "Total: " + this.sum;
    };

    reset() {
        this.hand = [];
        this.sum = 0;
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
    };

    hideStarterCards() {
        playerFirstCardEl.style.display = "none";
        playerSecondCardEl.style.display = "none";
        dealerFirstCardEl.style.display = "none";
        dealerSecondCardEl.style.display = "none";      //Havem't used a loop because maybe I can use it on React.js later? //(Belki proje react.js'de çalışılır diyerek loop kullanılmadı)
    };

    writeScore() {
        playerEl.textContent = player.name + ": $" + player.chips;
    };

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
    };

    releasePot() {
        potEl.removeAttribute("disabled");
    };

    lockPot() {
        potEl.setAttribute("disabled", "");
    };

    finish() {
        this.toggleButtonsOff();
        potEl.removeAttribute("disabled"); //Release Pot input (Bahis girişini kapatır)
        playerEl.textContent = player.name + ": $" + player.chips; //Show current score (Oyuncu'nun mevcut kazancını gösterir)
    };
}

class Game {
    constructor() {
        this.numOfPlayers = 1  //Hardcoded 1 for now but obviously will be changed if multiplayer support is added
    };

    start() {
        pot = parseFloat(potEl.value, 10);
        if (pot < 0 ) {
        message("Bahis negatif bir sayı olamaz.");  // "The pot can't be a negative number"
        }
        else {
        deck = new Deck;
        player.reset();
        dealer.reset();  // Reset the players
        table.lockPot(); // Doesn't matter functionally, it won't recieve the pot value again but disabling it improves interface
        table.reset();
        deck.shuffle();
        player.addCard(deck.drawCard());
        dealer.addCard(deck.drawCard());
        player.addCard(deck.drawCard()); //Draw two cards for the human player (İnsan oyuncu için iki kart çeker)
        dealer.addCard(deck.drawCard()); //Draw two cards for the dealer (Dağıtıcı için iki kart çeker)
        table.hideStarterCards();
        table.toggleButtonsOn();
        document.querySelector('#hand-0 > img.added-card').setAttribute('src', 'images/Card_back_01.png'); // Face down the first Card the dealer gets (Dağıtıcının bir kartı kapanır)
        player.calculateSum()
        document.getElementById("sum-el-0").innerText = "Açık kart: " + dealer.hand[1].value // This really lets player to learn the value of the first card with console commands.
        game.render();
        }
    }
    render() {
        player.calculateSum();
        if (player.sum < 21) {
            message("Bir Kart daha ister misin?");  //"Do you want another card?"
        }
        else if (player.sum === 21) {
            if (player.isBJ()) {player.chips += blackjackratio*pot} //Only a 21 with an ace and a face counts as blackjack (Sadece bir yüz ve As kombinasyonu Blackjack sayılır)
            else {player.chips += pot}                              //Otherwise its counted as just a win and player gets the normal pot (Diğer durumda oyuncu normal bahisle kazanır)
            message("21! Tebrikler");               //"Blackjack! Congrats!"
            table.finish();
        }
        else {
            message("Kaybettin! Bir oyun daha?");                  //"Sorry you lost! Another game?"
            player.isAlive = false;
            player.chips -= pot;
            potEl.removeAttribute("disabled");
            table.finish();
        }
    }
    playerTaps = () => {
        if (player.isAlive && player.sum !== 21) {
            player.addCard(deck.drawCard());
            this.render();
        };
    };

    dealerTurn = () => {
        function dealerTaps() {
            message("Dealer kart çekiyor")                  //"Dealer is picking cards"
            dealer.addCard(deck.drawCard(),);
            dealer.calculateSum();
            setTimeout(game.dealerTurn,1000);  // Easy there cowboy! Fix this bs! check bind() call() or whatever
        };
        function dealerWaves() {
            if (dealer.sum<player.sum || dealer.sum>21) {
                message("Kazandınız Tebrikler! Bir oyun daha?");    //"You won! Another game?"
                player.chips += pot;
            }
            else if (dealer.sum === player.sum) {
                message("Berabere... Bir oyun daha?");              //"It's a draw... Another game?"
            }
            else {
                player.isAlive = false;
                message("Üzgünüm kaybettiniz. Bir oyun daha?");     //"Sorry you lost. Another game?"
                player.chips -= pot;
            };
            table.finish();
        };

        dealer.calculateSum();
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
}

//Display and message elements on html: (html mesaj ve görünüm elemanları)
const messageEl = document.getElementById("message-el");
const potEl = document.getElementById("pot-input")
const playerEl = document.getElementById("player-el");
function message(string) {messageEl.textContent = string;};

//Placeholder cards: (Masada başlangıçtaki kart görselleri)
const dealerFirstCardEl = document.getElementById("dealer-first-card");
const playerFirstCardEl = document.getElementById("player-first-card");
const dealerSecondCardEl = document.getElementById("dealer-second-card");
const playerSecondCardEl = document.getElementById("player-second-card"); //HTML elements linking

//Game Options: (Oyun ayarları:)
var blackjackratio = 5; //The multiplier that will be applied to the pot for having a Blackjack. This is multiplier is supposed to be changed by the player. Interface to be added later
var pot = parseFloat(potEl.value, 10); // Set The Pot, that input thingy is getting numbers as strings. I must be doing something wrong. I need to study that

//Game Setup: (Oyun kurulumu:)
let dealer = new Player; //Dealer is Player no:0. Thus dealer hand div element will have the id hand-0 // (Dealer 0 numaralı oyuncu olarak başlar)
let player = new Player; //Human player is Player no:1. The counter will be incremented if multiplayer support is added // (İnsan oyuncu 1 numara olur. Çoklu oyuncu desteği eklendiğinde diğer oyuncular da ilgili numaraları alacaklar)
let deck = new Deck; //Is naming the class objects as lowercase class names a good idea? I feel like I'm gonna have trouble with that
let table = new Table;
let game = new Game;
playerEl.textContent = player.name + ": $" + player.chips;

//Buttons:
const startButton = document.getElementById("start-btn");       //Yeni oyun butonu
const stayButton = document.getElementById("stay-btn");         //Tamam deme butonu
const newCardButton = document.getElementById("new-card-btn");  //Kart isteme butonu

startButton.addEventListener('click', () => {game.start()}) //Start the game //(Oyunu başlat)
newCardButton.addEventListener('click', () => {game.playerTaps()}) //Human player draws a new card //(İnsan oyuncu yeni bir kart çeker)
stayButton.addEventListener('click', () => { //Human player stays and dealer's turn start  //(İnsan oyuncu pas geçer ve sıra dağıtıcıya gelir)
    document.querySelector('#hand-0 > img.added-card').setAttribute('src', dealer.hand[0].imageSrc);  //Reveal the hidden dealer card //(Kapalı duran dağıtıcı kartını açar)
    dealer.calculateSum();
    newCardButton.style.display = "none";
    stayButton.style.display = "none";
    message("Dealer kartlarına bakıyor...");
    setTimeout(game.dealerTurn,1000);
})