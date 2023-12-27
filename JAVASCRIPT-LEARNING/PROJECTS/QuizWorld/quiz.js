'use strict';

const loaderBackdrop = document.querySelector(".backdrop");
let questionsArray = [];
let userScore = 0;

function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function shuffleQuestionOptions(options, correct_option) {
    let randomIndex = Math.floor(Math.random() * 4);
    options.splice(randomIndex, 0, correct_option);
    return options;
}

function resetQuestionOptionsBackground(optionNodes) {
    for (let index = 0; index < optionNodes.length; index++) {
        optionNodes[index].style.backgroundColor = "#fff";
        optionNodes[index].style.color = "#000";
        optionNodes[index].style.border = "1px solid #000";
    }
}

function updateOptionBackground(clickedOptionIndex, correctOption, optionNodes) {
    for (let index = 0; index < optionNodes.length; index++) {
        if (index === clickedOptionIndex || optionNodes[index].innerText === correctOption) {
            optionNodes[index].style.backgroundColor = "#31702adb";
            optionNodes[index].style.color = "#ffffff";
            optionNodes[index].style.border = "none";
            if (index === clickedOptionIndex) {
                userScore += 10;
            }
        }
        if (index === clickedOptionIndex && optionNodes[index].innerText !== correctOption) {
            optionNodes[index].style.backgroundColor = "#e35858db";
            optionNodes[index].style.color = "#ffffff";
            optionNodes[index].style.border = "none";
            userScore ? userScore -= 10 : userScore = 0;
        }
    }
}

function loadQuestion(currentIndex) {
    const quizQuestionOptionNodes = document.querySelectorAll(".question-option");
    const quizQuestion = document.querySelector(".question");
    let currentQuestion = questionsArray[currentIndex];
    quizQuestion.innerText = decodeHtml(currentQuestion.question);
    let currentQuestionOptions = shuffleQuestionOptions(currentQuestion.incorrect_answers, currentQuestion.correct_answer);
    let correctOption = decodeHtml(currentQuestion.correct_answer);
    resetQuestionOptionsBackground(quizQuestionOptionNodes);
    quizQuestionOptionNodes.forEach((option, key) => {
        option.innerText = decodeHtml(currentQuestionOptions[key]);
        option.addEventListener("click", (event) => {
            event.stopPropagation()
            updateOptionBackground(key, correctOption, quizQuestionOptionNodes);
        });
    });
}

// show result after finishing the quiz
function showResult() {
    let resultSectionNode = document.querySelector(".result-section");
    let resultNode = document.getElementById("result");
    let restartBtnNode = document.getElementById("restart");
    let backToHomeBtnNode = document.getElementById("back-to-home");
    let totalNumber = questionsArray.length * 10;
    loaderBackdrop.style.display = "block";
    resultSectionNode.style.display = "flex";
    console.log(userScore, totalNumber);
    resultNode.innerText = `You Got ${userScore} Out Of ${totalNumber}`;
    restartBtnNode.addEventListener("click", () => {
        window.location.reload();
    });
    backToHomeBtnNode.addEventListener("click", () => {
        window.location.href = "/";
    });
}

// starting a normal button based interactive quiz
function startNormalInteractionQuiz() {
    const nextBtn = document.querySelector(".next-btn");
    let initialIndex = 0;
    loadQuestion(initialIndex);
    nextBtn.addEventListener("click", () => {
        initialIndex++;
        if (initialIndex && initialIndex < questionsArray.length - 1) {
            loadQuestion(initialIndex);
        } else {
            if (nextBtn.innerText.toLowerCase() === 'next') {
                loadQuestion(initialIndex);
                nextBtn.innerText = "Submit";
                nextBtn.style.backgroundColor = "#055a88";
            } else {
                showResult();
            }
        }
    });
    console.log(questionsArray);
}

function startTimeBasedQuiz(initialIndex) {
    let timeProgressNode = document.querySelector(".progress");
    let intervalId;
    let timeInSecond = 5;
    let totalWidth = 100;
    if (initialIndex === 0) {
        loadQuestion(initialIndex);
        console.log(questionsArray);
    }
    intervalId = setInterval(() => {
        if (timeInSecond < 1 && initialIndex < questionsArray.length - 1) {
            initialIndex++;
            loadQuestion(initialIndex);
            startTimeBasedQuiz(initialIndex);
            clearInterval(intervalId);
        }
        else if (initialIndex === questionsArray.length - 1 && timeInSecond === 0) {
            clearInterval(intervalId);
            showResult();
        }
        timeProgressNode.style.width = totalWidth + '%';
        totalWidth -= (totalWidth / timeInSecond);
        timeInSecond--;
    }, 1000);
}

// construct api url based on quiz option (store in localStorage)
function constructApiUrl(storedOption) {
    let apiUrl = new URL(`https://opentdb.com/api.php`);
    let quizQuestionAmount =
        Number.parseInt(storedOption.noOfQuestions) < 1 ||
            Number.parseInt(storedOption.noOfQuestions) > 50 ||
            !storedOption.noOfQuestions
            ? 10
            : Number.parseInt(storedOption.noOfQuestions);
    let quizQuestionTopic =
        storedOption.quizTopic === "any" || !storedOption.quizTopic
            ? null
            : storedOption.quizTopic;
    let quizQuestionDifficulty = storedOption.difficulty || "easy";
    apiUrl.search =
        `?amount=${quizQuestionAmount}` +
        (quizQuestionTopic ? `&category=${quizQuestionTopic}` : "") +
        `&difficulty=${quizQuestionDifficulty}` +
        "&type=multiple";
    return apiUrl.href;
}

// checking quiz mode and calling that type of quiz mode function
function checkQuizModeAndStart(quizType) {
    let timerBox = document.querySelector(".timer");
    let interactiveButtons = document.querySelector(".interaction-btn");
    if (quizType === "normal") {
        timerBox.style.display = "none";
        startNormalInteractionQuiz();
    } else {
        interactiveButtons.style.display = "none";
        let initialIndex = 0;
        startTimeBasedQuiz(initialIndex);
    }
}

// getting quiz option data form localStorage
(function () {
    let loaderSection = document.querySelector(".loader-section");
    let getStoredOption = JSON.parse(localStorage.getItem("quizOptions"));
    if (getStoredOption) {
        let getApiUrl = constructApiUrl(getStoredOption);
        fetch(getApiUrl).then((response) => {
            return response.json();
        }).then((data) => {
            questionsArray = data.results;
            checkQuizModeAndStart(getStoredOption.quizType);
            loaderBackdrop.style.display = "none";
            loaderSection.style.display = "none";
        }).catch((err) => {
            console.log(err);
        });
    } else {
    }
})();
