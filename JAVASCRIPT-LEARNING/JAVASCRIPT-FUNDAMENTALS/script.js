const input = document.querySelector(".numberInput");
const para = document.querySelector("p");

// utility functions

function squared(num) {
    return num * num;
}

function cubed(num) {
    return num * num * num;
}

function squreRoot(num) {
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
        para.textContent += `Square root of ${num}  is ${squreRoot(num)}. `;
        para.textContent += `Cube root of ${num} is ${cubeRoot(num)}. `;
    }
});


const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

btn.addEventListener("click", () => {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
});

document.querySelector("ul").addEventListener("click",()=>{
    alert("Hi")
})