interface Card {
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
}
const values = ['1', '2', '3', '4', '5', '6', '7', '8'];
const gameBoard = document.getElementById("memoryGameBoard") as HTMLElement;
let cards: Card[] = [];
let firstCard: Card | null = null;
let secondCard: Card | null = null;
let lockBoard = false;

function setupGame() {
    const deck = [...values, ...values] //Duplicate values to get pairs
        .map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5); //Shuffle the deck

        cards = deck;
        createBoard();
}

function createBoard() {
    gameBoard.innerHTML = "";
    cards.forEach(card => {
        const cardElement = document.createElement('li');
        cardElement.classList.add('memory-card');
        cardElement.textContent = card.isFlipped || card.isMatched ? card.value : "";
        cardElement.addEventListener('click', () => flipCard(card));
        if(card.isFlipped) cardElement.classList.add('flipped');
        if(card.isMatched) cardElement.classList.add('matched');
        gameBoard.appendChild(cardElement);
    })
}

function flipCard(card: Card) {
    if (lockBoard || card.isFlipped || card.isMatched) return;
    card.isFlipped = true;
    createBoard();

    if(!firstCard) {
        firstCard = card;
    } else if(!secondCard) {
        secondCard = card;
        lockBoard = true;
        checkFotMatch();
    }
}

function checkFotMatch() {
    if(firstCard && secondCard && firstCard.value === secondCard.value) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        resetBoard();
    } else{
        setTimeout(() => {
            if (firstCard) firstCard.isFlipped = false;
            if (secondCard) secondCard.isFlipped = false;
            resetBoard();
        }, 1000);
    }
    createBoard();
    checkForWin();
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function checkForWin() {
    let winnerMessage = (document.getElementById('winnerMessage') as HTMLInputElement).value;
    if(cards.every(card => card.isMatched)){
        winnerMessage = "You won this game!"
        setupGame()
    }
}
 setupGame();