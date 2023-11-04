let startBtn = document.querySelector(".start-btn");
let optionBtn = document.querySelector(".option-btn");
let aboutBtn = document.querySelector(".about-btn");
let modalBackdrop = document.querySelector(".modal-back_drop");
// let modal = document.querySelector(".modal");
let modalCloseBtn = document.getElementById("modal-close-btn");
let noOfQuestionsInput = document.getElementById("no-of-question");
let difficultySelect = document.getElementById("difficulty");
let topicSelect = document.getElementById("topic");
let quizTypeSelect = document.getElementById("quiz-type");

function domEvents() {
    startBtn.addEventListener("click", () => {
        window.location.href = "quiz.html";
    });
    // modal.addEventListener("mouseenter", () => {
    //     modalCloseBtn.style.display = "block";
    // });
    // modal.addEventListener("mouseleave", () => {
    //     modalCloseBtn.style.display = "none";
    // });
    modalCloseBtn.addEventListener("click", () => {
        modalBackdrop.style.display = "none";
    });
    optionBtn.addEventListener("click", () => {
        modalBackdrop.style.display = "block";
        userChoiceOptions();
    });
}

function userChoiceOptions() {
    let quizOptionsObj = JSON.parse(localStorage.getItem("quizOptions"));
    noOfQuestionsInput.value = quizOptionsObj.noOfQuestions;
    difficultySelect.value = quizOptionsObj.difficulty;
    topicSelect.value = quizOptionsObj.quizTopic;
    quizTypeSelect.value = quizOptionsObj.quizType;
    noOfQuestionsInput.addEventListener("input", (event) => {
        let enteredValue = Number.parseInt(event.target.value);
        if (enteredValue >= 10 && enteredValue <= 50) {
            quizOptionsObj.noOfQuestions = enteredValue;
            createDefaultQuizOption(quizOptionsObj);
        } else {
            console.log("not allowed");
        }
    });
    difficultySelect.addEventListener("change", (event) => {
        quizOptionsObj.difficulty = event.target.value;
        createDefaultQuizOption(quizOptionsObj);
    });
    topicSelect.addEventListener("change", (event) => {
        quizOptionsObj.quizTopic = event.target.value;
        createDefaultQuizOption(quizOptionsObj);
    });
    quizTypeSelect.addEventListener("change", (event) => {
        quizOptionsObj.quizType = event.target.value;
        createDefaultQuizOption(quizOptionsObj);
    });
}

function createDefaultQuizOption(options) {
    localStorage.setItem("quizOptions", JSON.stringify(options));
}

function main() {
    domEvents();
    let quizOptions = localStorage.getItem("quizOptions");
    if (!quizOptions) {
        let quizOptionsObj = {
            noOfQuestions: 10,
            difficulty: "easy",
            quizTopic: "any",
            quizType: "normal"
        };
        createDefaultQuizOption(quizOptionsObj);
    }
}

main()


