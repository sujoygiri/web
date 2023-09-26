let userInput = document.querySelector("#user-input");
let checkBtn = document.querySelector("button");
let resultPara = document.querySelector(".result");

function palindrome(str) {
    let start = 0;
    let end = str.length - 1;
    for (let i = 0; i < str.length; i++) {
        if (str[start] !== str[end]) {
            return false;
        }
        if (start === end) {
            break;
        } else {
            start++;
            end--;
        }
    }
    return true;
}

function checkAndUpdate() {
    let inputString = userInput?.value.replaceAll(/[!@~`#$%^&*()_+={\[\]}|\\:"';<>,.?\/]/g, "").toLowerCase();
    if (inputString) {
        let isPalindrome = palindrome(inputString);
        if (isPalindrome) {
            resultPara.innerHTML = `<span>❕${userInput.value}❕</span> is palindrome`;
            resultPara.classList.remove("not-palindrome");
            resultPara.classList.add("palindrome");
        } else {
            resultPara.innerHTML = `<span>❕${userInput.value}❕</span> is not palindrome`;
            resultPara.classList.remove("palindrome");
            resultPara.classList.add("not-palindrome");
        }
    }
}

function main() {
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            checkAndUpdate();
        }
    });
    checkBtn.addEventListener("click", () => {
        checkAndUpdate();
    });
}

main();