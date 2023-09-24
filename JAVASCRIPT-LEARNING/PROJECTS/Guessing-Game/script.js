let rulesButton = document.querySelector(".rules_button");
let rulesModal = document.querySelector(".rules_modal");
let rulesModalCloseButton = document.querySelector(".modal_close_button");
let userInputValue = document.querySelector(".input_field");
let guessSubmitButton = document.querySelector(".submit_button");
let userMadeGuesses = document.querySelector(".guesses");
let guessResult = document.querySelector(".guess_result");
let resultDiv = document.querySelector(".guess_and_result");
let restartButton = document.querySelector(".restart_button");
let gameStatus = ""

// show a modal of game rules upon clicking rules button
rulesButton.addEventListener("click", () => {
    rulesModal.style.display = "flex";
});
rulesModalCloseButton.addEventListener("click", () => {
    rulesModal.style.display = "none";
});

// Generate a random number between 1 and 100
function generateRandomNumber() {
    return Math.round((Math.random() * 99) + 1);
}

let randomNumber = generateRandomNumber();

// show current and previous guessed value and their status
function showGuessedValue(value, status) {
    const guessedSpan = document.createElement("span");
    if (status === 'correct') {
        guessedSpan.className = "user_guess_number correct_guess";
        guessedSpan.textContent = value;
    } else if (status === 'wrong') {
        guessedSpan.className = "user_guess_number wrong_guess";
        guessedSpan.textContent = value;
    }
    userMadeGuesses.appendChild(guessedSpan);
}

// disable input and guess button
function disableInputAndGuessButton() {
    userInputValue.setAttribute('disabled', '');
    guessSubmitButton.setAttribute('disabled', '');
}

function enableInputAndGuessButton() {
    userInputValue.removeAttribute('disabled');
    guessSubmitButton.removeAttribute('disabled');
    restartButton.style.display = "none";
    guessResult.innerHTML = "";
    userMadeGuesses.innerText = "Guesses you made:-";
    resultDiv.style.display = "none";
    randomNumber = generateRandomNumber();
    gameStatus = "restart"
}

// show result about guessed number
function showResult(userGuess, chances) {
    if (chances > 0 || userGuess === randomNumber) {
        if (userGuess > randomNumber) {
            guessResult.innerText = `Guessed number ${userGuess} is too high!`;
            guessResult.style.backgroundColor = "#07464e";
            showGuessedValue(userGuess, 'wrong');
        } else if (userGuess < randomNumber) {
            guessResult.innerText = `Guessed number ${userGuess} is too low!`;
            guessResult.style.backgroundColor = "#4c5006";
            showGuessedValue(userGuess, 'wrong');
        } else if (userGuess === randomNumber) {
            guessResult.innerText = `You Win`;
            guessResult.style.backgroundColor = "#039619";
            disableInputAndGuessButton();
            restartButton.style.display = "block";
            showGuessedValue(userGuess, 'correct');
            gameStatus = "over"
        }

    } else if (chances === 0) {
        guessResult.innerText = 'Game over!';
        guessResult.style.backgroundColor = "#6d0909";
        disableInputAndGuessButton();
        restartButton.style.display = "block";
        showGuessedValue(userGuess, 'wrong');
        gameStatus = "over"

    }
}

let totalChances = 9;

function startGame(guessedValue){
    resultDiv.style.display = "block";
    showResult(guessedValue, totalChances);
    userInputValue.value = null;
    totalChances--;
    userInputValue.focus();
}

guessSubmitButton.addEventListener("click", () => {
    let guessedValue = parseInt(userInputValue.value);
    // console.log(randomNumber);
    if (guessedValue && gameStatus !== "over") {
        startGame(guessedValue);
    }
});

// listen for "Enter" key press event and guessed the value
userInputValue.addEventListener("keypress",(event) => {
    let guessedValue = parseInt(userInputValue.value);
    if(event.key === "Enter"){
        startGame(guessedValue);
    }
})

// Reset to initial state of the game
restartButton.addEventListener("click", () => {
    totalChances = 9;
    enableInputAndGuessButton();
    userInputValue.focus()
})
userInputValue.focus()

