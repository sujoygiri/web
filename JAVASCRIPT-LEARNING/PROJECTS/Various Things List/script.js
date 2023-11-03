let userInput = document.querySelector("input");
let addButton = document.querySelector(".add_btn");
let domList = document.querySelector(".list");

let allListItem = [];

function addListItem() {
    let userInputValue = userInput.value;
    allListItem.push(userInputValue);
    localStorage.removeItem("list_item");
    localStorage.setItem("list_item", JSON.stringify(allListItem));
}

function updateListItem(index) {
    let editBtn = document.querySelectorAll(".edit_btn")[index];
    let listItem = document.querySelectorAll(".list_item")[index];
    // console.log(saveIcon);
    if (editBtn.textContent === "✏️") {
        listItem.setAttribute("contenteditable", "true");
        listItem.focus();
        editBtn.textContent = "💾";
        // listItem.addEventListener("blur", () => {
        //     listItem.removeAttribute("contenteditable");
        //     editBtn.textContent = "✏️";
        // });
    } else {
        allListItem[index] = listItem.textContent;
        localStorage.removeItem("list_item");
        localStorage.setItem("list_item", JSON.stringify(allListItem));
        listItem.removeAttribute("contenteditable");
        editBtn.textContent = "✏️";
        showListItem();
    }
}

function showListItem() {
    let listAsString = localStorage.getItem("list_item");
    if (listAsString) {
        allListItem = JSON.parse(listAsString);
        domList.innerHTML = "";
        for (let itemIndex in allListItem) {
            domList.innerHTML += `<li><span class="list_item">${allListItem[itemIndex]}</span><span class="update_btn_section"><button class="edit_btn" onclick="updateListItem(${itemIndex})">✏️</button><button class="delete_btn" onclick="deleteListItem(${itemIndex})">🗑️</button></span></li>`;
        }
    } else {
        localStorage.setItem("list_item", JSON.stringify(allListItem));
    }
}

function deleteListItem(index) {
    allListItem.splice(index, 1);
    localStorage.removeItem("list_item");
    localStorage.setItem("list_item", JSON.stringify(allListItem));
    showListItem();
}

function main() {
    showListItem();
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addListItem();
            showListItem();
            userInput.value = "";
            userInput.focus();
        }
    });
    addButton.addEventListener("click", () => {
        addListItem();
        showListItem();
        userInput.value = "";
        userInput.focus();
    });
}

main();

