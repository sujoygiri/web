// grabbing all the element from dom
let timePara = document.querySelector(".time");
let playPauseBtn = document.querySelector(".play-pause-btn");
let playPauseImage = document.querySelector(".play-pause-image");
let flagButton = document.querySelector(".flag-btn");
let resetButton = document.querySelector(".reset-btn");
let hoursSpan = document.querySelector(".hours");
let minutesSpan = document.querySelector(".minutes");
let secondsSpan = document.querySelector(".seconds");
let milliSecondsSpan = document.querySelector(".milli-seconds");
let tableDiv = document.querySelector(".flags");
let tableFlagData = document.querySelector(".flag-data");

// initial value of all timer
let milliSecondCount = 0;
let secondCount = 0;
let minuteCount = 0;
let hourCount = 0;
let flagLaps = 0;
let interValId = null;
let startWatch = false;
let previousTimeInMs = 0;


function updateHour() {
    hourCount++;
    if (hourCount > 99) {
        clearInterval(interValId);
        hourCount = 0;
    }
    hoursSpan.textContent = hourCount >= 10 ? hourCount : `0${hourCount}`;
}

function updateMinute() {
    minuteCount++;
    if (minuteCount > 59) {
        updateHour();
        minuteCount = 0;
    }
    minutesSpan.textContent = minuteCount >= 10 ? minuteCount : `0${minuteCount}`;
}

function updateSecond() {
    secondCount++;
    if (secondCount > 59) {
        updateMinute();
        secondCount = 0;
    }
    secondsSpan.textContent = secondCount >= 10 ? secondCount : `0${secondCount}`;
}

function updateMilliSecond() {
    milliSecondCount++;
    if (milliSecondCount > 99) {
        updateSecond();
        milliSecondCount = 0;
    }
    milliSecondsSpan.textContent = milliSecondCount >= 10 ? milliSecondCount : `0${milliSecondCount}`;
}

function start() {
    interValId = setInterval(() => {
        updateMilliSecond();
    }, 10,);
}

function stop() {
    clearInterval(interValId);
}

function getTimeTaken(time) {
    let getHour = Math.floor(time / (3600 * 1000));
    let getMinute = Math.floor(time / (60 * 1000));
    let getSecond = Math.floor(time / 1000);
    let getMillSecond = Math.floor((time % 1000) / 10);
    return `
    <td> 
        ${getHour >= 10 ? getHour : `0${getHour}`}:
        ${getMinute >= 10 ? getMinute : `0${getMinute}`}:
        ${getSecond >= 10 ? getSecond : `0${getSecond}`}:
        ${getMillSecond >= 10 ? getMillSecond : `0${getMillSecond}`} 
    </td>
    `;
}

function addFlags() {
    tableDiv.removeAttribute("hidden");
    flagLaps++;
    let currentTimeInMs = hourCount * 3600 * 1000 + minuteCount * 60 * 1000 + secondCount * 1000 + milliSecondCount * 10;
    let timeTakenPerLaps = getTimeTaken(currentTimeInMs - previousTimeInMs);
    ;
    tableFlagData.innerHTML = `
    <tr>
        <td>${flagLaps}</td>
        ${timeTakenPerLaps}
        <td> 
            ${hourCount >= 10 ? hourCount : `0${hourCount}`}:
            ${minuteCount >= 10 ? minuteCount : `0${minuteCount}`}:
            ${secondCount >= 10 ? secondCount : `0${secondCount}`}:
            ${milliSecondCount >= 10 ? milliSecondCount : `0${milliSecondCount}`} 
        </td>
    </tr>
    ` + tableFlagData.innerHTML;
    previousTimeInMs = currentTimeInMs;
}

function reset() {
    milliSecondCount = 0;
    secondCount = 0;
    minuteCount = 0;
    hourCount = 0;
    milliSecondsSpan.textContent = "00";
    secondsSpan.textContent = "00";
    minutesSpan.textContent = "00";
    hoursSpan.textContent = "00";
    startWatch = false;
    flagLaps = 0;
    previousTimeInMs = 0;
    playPauseImage.setAttribute("src", "assets/play.svg");
    tableFlagData.innerHTML = "";
    tableDiv.setAttribute("hidden", "");
    flagButton.setAttribute("disabled", "");
    resetButton.setAttribute("disabled", "");
    clearInterval(interValId);
}

function main() {
    reset();
    flagButton.setAttribute("disabled", "");
    resetButton.setAttribute("disabled", "");
    playPauseBtn.addEventListener("click", () => {
        startWatch = !startWatch;
        if (startWatch) {
            playPauseImage.setAttribute("src", "assets/pause.svg");
            flagButton.removeAttribute("disabled");
            resetButton.removeAttribute("disabled");
            start();
        } else {
            playPauseImage.setAttribute("src", "assets/play.svg");
            flagButton.setAttribute("disabled", "");
            stop();
        }
    });

    flagButton.addEventListener("click", () => {
        addFlags();
    });

    resetButton.addEventListener("click", () => {
        reset();
    });
}

main();