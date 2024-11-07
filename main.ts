interface Card {
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
}
const values = ['1', '2', '3', '4', '5', '6', '7', '8'];
const gameBoard = document.getElementById("memoryGameBoard") as HTMLElement;
const moveCounter = document.getElementById("moveCounter") as HTMLElement;
const timerDisplay = document.getElementById("timer") as HTMLElement;
const restartGame = document.getElementById("restartGame") as HTMLElement;


let cards: Card[] = [];
let firstCard: Card | null = null;
let secondCard: Card | null = null;
let lockBoard = false;
let moves = 0;
let timer: number;
let time = 0;
let countdownMode = false;
let countdownStart = 90; //Countdown start time in seconds

restartGame.addEventListener("click", setupGame);

function setupGame() {
    resetGame();
    createDeck();
    createBoard();
    startTimer();
}
function createDeck() {
    const deck = [...values, ...values] //Duplicate values to get pairs
        .map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5); //Shuffle the deck

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
    timerDisplay.textContent = countdownMode ? formatTime(countdownStart) : "0:00"
}

//Write the time in format: 0:00
function formatTime(seconds : number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startTimer() {
    time = countdownStart;
    timerDisplay.textContent = formatTime(time);

    clearInterval(timer);
    timer = setInterval(() => {
            time--;
            timerDisplay.textContent = formatTime(time);
            
            if(time <= 0){
                clearInterval(timer);
                alert("Time is gone! Game over!")
                setupGame();
            }
        
        timerDisplay.textContent = formatTime(time);
    }, 1000);
}

function createBoard() {
    gameBoard.innerHTML = "";
    cards.forEach(card => {
        const cardElement = document.createElement('li');
        cardElement.classList.add('memory-card');
        cardElement.textContent = card.isFlipped || card.isMatched ? card.value : "";
        cardElement.addEventListener('click', () => flipCard(card));
        if(card.isFlipped) {
            cardElement.classList.remove('flipped');
            setTimeout(() => cardElement.classList.add('flipped'), 0);
        }
        if(card.isMatched) cardElement.classList.add('matched');
        gameBoard.appendChild(cardElement);
    })
}

function flipCard(card: Card) {
    if (lockBoard || card.isFlipped || card.isMatched) return;
    card.isFlipped = true;
    createBoard();

    if(!firstCard) {
        // First card is selected
        firstCard = card;
    } else if(!secondCard) {
        // Second card is selected
        secondCard = card;
        lockBoard = true;
        moves++;
        moveCounter.textContent = moves.toString();
        checkForMatch();
    } 
}

function checkForMatch() {
    if(firstCard && secondCard && firstCard.value === secondCard.value) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        resetBoard();
    } else{
        setTimeout(() => {
            if (firstCard) firstCard.isFlipped = false;
            if (secondCard) secondCard.isFlipped = false;
            resetBoard();
            createBoard(); //Flips the cards back if there is no match
        }, 1000);
    }
    createBoard();
    checkForWin();
}


function checkForWin() {
    const winnerMessage = document.getElementById('winnerMessage')
    const confetti = document.getElementById('confetti');
    if(winnerMessage && confetti && cards.every(card => card.isMatched)){
        clearInterval(timer);
        winnerMessage.innerText = "You won the game!";
        confetti.attributeStyleMap.clear();
          setTimeout(() => {
            winnerMessage.innerText = "";
            confetti.attributeStyleMap.set("display", "none");
        }, 6000);
        setupGame();
    }
}
 setupGame();