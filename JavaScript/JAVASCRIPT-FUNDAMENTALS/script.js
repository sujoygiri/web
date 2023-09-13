let rulesButton = document.querySelector(".rules_button");
let rulesModal = document.querySelector(".rules_modal");
let rulesModalCloseButton = document.querySelector(".modal_close_button");
let userInputValue = document.querySelector(".input_field");
let guessSubmitButton = document.querySelector(".submit_button");
let userMadeGuesses = document.querySelector(".guesses");
let guessResult = document.querySelector(".guess_result");

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
const randomNumber = generateRandomNumber();

// show current and previous guessed value
function showGuessedValue(value, status) {
    const guessedSpan = document.createElement("span");
    if (status === 'correct') {
        guessedSpan.className = "user_guess correct_guess";
        guessedSpan.textContent = value;
    } else if (status === 'wrong') {
        guessedSpan.className = "user_guess wrong_guess";
        guessedSpan.textContent = value;
    }
    userMadeGuesses.appendChild(guessedSpan);
}

// show result about guessed number
function showResult(userGuess, chances) {
    if(chances > 0){
        if (userGuess > randomNumber) {
            guessResult.innerText = `Guessed number ${userGuess} is too high!`;
            showGuessedValue(userGuess,'wrong')
        } else if (userGuess < randomNumber) {
            guessResult.innerText = `Guessed number ${userGuess} is too low!`;
            showGuessedValue(userGuess,'wrong')
        } else if (userGuess === randomNumber) {
            guessResult.innerText = `You Win`;
            showGuessedValue(userGuess,'correct')
        }
    }else if(chances === 0){
        guessResult.innerText = 'Game over!'
        userInputValue.setAttribute('disabled','')
        guessSubmitButton.setAttribute('disabled','')
        
    }
}

let totalChances = 9;

guessSubmitButton.addEventListener("click", () => {
    let guessedValue = parseInt(userInputValue.value);
    console.log(randomNumber);
    if(guessedValue){
        showResult(guessedValue,totalChances);
        userInputValue.value = null;
        totalChances--;
    }
})


