// grabbing all the element from dom
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
let interValId = null;
let startWatch = false;
let previousTimeInMs = 0;
let allLapStateArr = [];
let lapsTimeArray = [];

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

function getTimeTakenEachLap(time) {
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

function slowestOrFastest(timesArray, lapStateObj) {
    let flagLaps = 0;
    let lapRow = "";
    let firstRowInTr = "";
    allLapStateArr.push(lapStateObj);
    tableFlagData.innerHTML = "";
    if (allLapStateArr.length === 1) {
        return `
        <tr>
            <td>1</td>
            ${lapStateObj.eachLapTime}
            <td>
                ${lapStateObj.hourCount >= 10 ? lapStateObj.hourCount : `0${lapStateObj.hourCount}`}:
                ${lapStateObj.minuteCount >= 10 ? lapStateObj.minuteCount : `0${lapStateObj.minuteCount}`}:
                ${lapStateObj.secondCount >= 10 ? lapStateObj.secondCount : `0${lapStateObj.secondCount}`}:
                ${lapStateObj.milliSecondCount >= 10 ? lapStateObj.milliSecondCount : `0${lapStateObj.milliSecondCount}`}
            </td>
        </tr>`;
    }
    for (let allLapStateArrElement of allLapStateArr) {
        flagLaps++;
        if (Math.max(...timesArray) === allLapStateArrElement.time) {
            firstRowInTr = `<td>${flagLaps}&nbsp;<span>Slowest</span></td>`;
        } else if (Math.min(...timesArray) === allLapStateArrElement.time) {
            firstRowInTr = `<td>${flagLaps}&nbsp;<span>Fastest</span></td>`;
        } else {
            firstRowInTr = `<td>${flagLaps}</td>`;
        }
        lapRow = "<tr>" + firstRowInTr +
            `${allLapStateArrElement.eachLapTime}
            <td>
                ${allLapStateArrElement.hourCount >= 10 ? allLapStateArrElement.hourCount : `0${allLapStateArrElement.hourCount}`}:
                ${allLapStateArrElement.minuteCount >= 10 ? allLapStateArrElement.minuteCount : `0${allLapStateArrElement.minuteCount}`}:
                ${allLapStateArrElement.secondCount >= 10 ? allLapStateArrElement.secondCount : `0${allLapStateArrElement.secondCount}`}:
                ${allLapStateArrElement.milliSecondCount >= 10 ? allLapStateArrElement.milliSecondCount : `0${allLapStateArrElement.milliSecondCount}`}
            </td>` +
            "<tr>" + lapRow;
    }
    return lapRow;
}


function addFlags() {
    tableDiv.removeAttribute("hidden");
    let currentTimeInMs = hourCount * 3600 * 1000 + minuteCount * 60 * 1000 + secondCount * 1000 + milliSecondCount * 10;
    let eachLapTime = getTimeTakenEachLap(currentTimeInMs - previousTimeInMs);
    lapsTimeArray.push(currentTimeInMs - previousTimeInMs);
    tableFlagData.innerHTML = slowestOrFastest(lapsTimeArray, {
        time: currentTimeInMs - previousTimeInMs,
        eachLapTime,
        hourCount,
        minuteCount,
        secondCount,
        milliSecondCount
    });
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
    previousTimeInMs = 0;
    allLapStateArr = [];
    lapsTimeArray = [];
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