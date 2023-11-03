let progressBar = document.querySelector(".progress_bar");
let progress = document.querySelector(".progress");
let progressValue = document.querySelector(".progress_value");

let dataArr = [];

async function fetchRandomWord(numberOfWords, wordLength) {
    let url = `https://random-word-api.herokuapp.com/word?number=${numberOfWords}&length=${wordLength}`;
    let response = await fetch(url);
    let rawData = await response.json();
    return rawData;
}


function main(timeInSec, timeout = 1000) {
    let progressWidth = 100;
    // progressValue.textContent = progressWidth.toFixed(0).toString() + '%'
    let intervalId = setInterval(() => {
        if (timeInSec > 0) {
            progressWidth -= (progressWidth / timeInSec);
            // progressValue.textContent = progressWidth.toFixed(0).toString() + '%'
            timeInSec--;
        } else {
            clearInterval(intervalId);
            progressValue.textContent = "";
            console.log("clear interval id", intervalId);
        }
        progress.style.width = progressWidth.toFixed(0).toString() + '%';
    }, timeout);
    fetchRandomWord(10, 5).then((data) => {
        dataArr = data;
        console.log(dataArr);
    });
}

main(10);