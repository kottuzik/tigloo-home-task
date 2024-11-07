var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var values = ['1', '2', '3', '4', '5', '6', '7', '8'];
var gameBoard = document.getElementById("memoryGameBoard");
var cards = [];
var firstCard = null;
var secondCard = null;
var lockBoard = false;
function setupGame() {
    var deck = __spreadArray(__spreadArray([], values, true), values, true).map(function (value, index) { return ({ id: index, value: value, isFlipped: false, isMatched: false }); })
        .sort(function () { return Math.random() - 0.5; }); //Shuffle the deck
    cards = deck;
    createBoard();
}
function createBoard() {
    gameBoard.innerHTML = "";
    cards.forEach(function (card) {
        var cardElement = document.createElement('li');
        cardElement.classList.add('memory-card');
        cardElement.textContent = card.isFlipped || card.isMatched ? card.value : "";
        cardElement.addEventListener('click', function () { return flipCard(card); });
        if (card.isFlipped)
            cardElement.classList.add('flipped');
        if (card.isMatched)
            cardElement.classList.add('matched');
        gameBoard.appendChild(cardElement);
    });
}
function flipCard(card) {
    if (lockBoard || card.isFlipped || card.isMatched)
        return;
    card.isFlipped = true;
    createBoard();
    if (!firstCard) {
        firstCard = card;
    }
    else if (!secondCard) {
        secondCard = card;
        lockBoard = true;
        checkFotMatch();
    }
}
function checkFotMatch() {
    if (firstCard && secondCard && firstCard.value === secondCard.value) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        resetBoard();
    }
    else {
        setTimeout(function () {
            if (firstCard)
                firstCard.isFlipped = false;
            if (secondCard)
                secondCard.isFlipped = false;
            resetBoard();
        }, 1000);
    }
    createBoard();
    checkForWin();
}
function resetBoard() {
    var _a;
    _a = [null, null, false], firstCard = _a[0], secondCard = _a[1], lockBoard = _a[2];
}
function checkForWin() {
    var winnerMessage = document.getElementById('winnerMessage').value;
    if (cards.every(function (card) { return card.isMatched; })) {
        winnerMessage = "You won this game!";
        setupGame();
    }
}
setupGame();
