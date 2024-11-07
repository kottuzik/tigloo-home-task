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
var moveCounter = document.getElementById("moveCounter");
var timerDisplay = document.getElementById("timer");
var restartGame = document.getElementById("restartGame");
var cards = [];
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var moves = 0;
var timer;
var time = 0;
var countdownMode = false;
var countdownStart = 90; //Countdown start time in seconds
restartGame.addEventListener("click", setupGame);
function setupGame() {
    resetGame();
    createDeck();
    createBoard();
    startTimer();
}
function createDeck() {
    var deck = __spreadArray(__spreadArray([], values, true), values, true).map(function (value, index) { return ({ id: index, value: value, isFlipped: false, isMatched: false }); })
        .sort(function () { return Math.random() - 0.5; }); //Shuffle the deck
    cards = deck;
    createBoard();
}
function resetGame() {
    cards = [];
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    moveCounter.textContent = "0";
    time = countdownMode ? countdownStart : 0;
    timerDisplay.textContent = countdownMode ? formatTime(countdownStart) : "0:00";
}
function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return "".concat(mins, ":").concat(secs < 10 ? "0" : "").concat(secs);
}
function resetBoard() {
    var _a;
    _a = [null, null, false], firstCard = _a[0], secondCard = _a[1], lockBoard = _a[2];
}
function startTimer() {
    time = countdownStart;
    timerDisplay.textContent = formatTime(time);
    clearInterval(timer);
    timer = setInterval(function () {
        time--;
        timerDisplay.textContent = formatTime(time);
        if (time <= 0) {
            clearInterval(timer);
            alert("Time is gone! Game over!");
            setupGame();
        }
        timerDisplay.textContent = formatTime(time);
    }, 1000);
}
function createBoard() {
    gameBoard.innerHTML = "";
    cards.forEach(function (card) {
        var cardElement = document.createElement('li');
        cardElement.classList.add('memory-card');
        cardElement.textContent = card.isFlipped || card.isMatched ? card.value : "";
        cardElement.addEventListener('click', function () { return flipCard(card); });
        if (card.isFlipped) {
            cardElement.classList.remove('flipped');
            setTimeout(function () { return cardElement.classList.add('flipped'); }, 0);
        }
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
        // First card is selected
        firstCard = card;
    }
    else if (!secondCard) {
        // Second card is selected
        secondCard = card;
        lockBoard = true;
        moves++;
        moveCounter.textContent = moves.toString();
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
            createBoard();
        }, 1000);
    }
    createBoard();
    checkForWin();
}
function checkForWin() {
    var winnerMessage = document.getElementById('winnerMessage');
    var confetti = document.getElementById('confetti');
    if (winnerMessage && confetti && cards.every(function (card) { return card.isMatched; })) {
        clearInterval(timer);
        winnerMessage.innerText = "You won the game!";
        confetti.attributeStyleMap.clear();
        setTimeout(function () {
            winnerMessage.innerText = "";
            confetti.attributeStyleMap.set("display", "none");
        }, 6000);
        setupGame();
    }
}
setupGame();
