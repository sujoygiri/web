const input = document.querySelector(".numberInput");
const para = document.querySelector("p");

// utility functions

function squared(num) {
    return num * num;
}

function cubed(num) {
    return num * num * num;
}

function squareRoot(num) {
    return num >= 0 ? Number((num ** 0.5).toFixed(3)) : NaN;
}

function cubeRoot(num) {
    return num >= 0 ? Number((num ** (1 / 3)).toFixed(3)) : NaN;
}

function factorial(num) {
    if (num > 21) return "Out of bound!!";
    if (num < 0) return undefined;
    if (num === 0) return 1;
    let x = num - 1;
    while (x > 1) {
        num *= x;
        x--;
    }
    return num;
}

input.addEventListener("keyup", () => {
    const num = parseFloat(input.value);
    if (isNaN(num)) {
        para.textContent = "You need to enter a number!";
    } else {
        para.textContent = `${num} squared is ${squared(num)}. `;
        para.textContent += `${num} cubed is ${cubed(num)}. `;
        para.textContent += `${num} factorial is ${factorial(num)}. `;
        para.textContent += `Square root of ${num}  is ${squareRoot(num)}. `;
        para.textContent += `Cube root of ${num} is ${cubeRoot(num)}. `;
    }
});


const btn = document.querySelector("button");

function random(number) {
    return Math.floor(Math.random() * (number + 1));
}

btn.addEventListener("click", () => {
    document.body.style.backgroundColor = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
});

document.querySelector("ul").addEventListener("click", () => {
    alert("Hi");
});

// --------->>>>>>>>>>> controlling audio through range input <<<<<<<<<-----------
// Create an AudioContext (cross browser)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// store references to our HTML elements
const audioElement = document.querySelector("audio");
const playBtn = document.querySelector("button");
const volumeSlider = document.querySelector(".volume");

// load the audio source into our audio graph
const audioSource = audioCtx.createMediaElementSource(audioElement);

// play/pause audio
playBtn.addEventListener("click", () => {
    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === "suspended") {
        audioCtx.resume().then(r => console.log(r));
    }

    // if track is stopped, play it
    if (playBtn.getAttribute("class") === "paused") {
        audioElement.play().then(r => console.log(r));
        playBtn.setAttribute("class", "playing");
        playBtn.textContent = "Pause";
        // if track is playing, stop it
    } else if (playBtn.getAttribute("class") === "playing") {
        audioElement.pause();
        playBtn.setAttribute("class", "paused");
        playBtn.textContent = "Play";
    }
});

// if track ends
audioElement.addEventListener("ended", () => {
    playBtn.setAttribute("class", "paused");
    playBtn.textContent = "Play";
    // audioElement.play().then(r => console.log(r));
});

// volume
const gainNode = audioCtx.createGain();

volumeSlider.addEventListener("input", () => {
    gainNode.gain.value = volumeSlider.value;
});

// connect our graph
audioSource.connect(gainNode).connect(audioCtx.destination);