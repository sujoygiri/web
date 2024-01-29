import { noteApi, checkUserAuthentication, authApi } from "./supabase-api.js";
import { encodeHTML,handelError } from "./util.js";

const profileDropdownBtnNode = document.getElementById("profile-dropdown");
const logOutBtn = document.getElementById("logout-btn");

function main() {
    const noteCreateLinkNode = document.querySelector(".note-create-link")
    const noteWriterNode = document.getElementById("note-writer");
    const typingStatusNode = document.getElementById("typing-status");
    const noteSaveBtnNode = document.getElementById("note-save-btn");
    const saveBtnSpinnerNode = document.getElementById("save-btn-spinner");
    const alertNode = document.querySelector(".alert");
    let timeOutId = null;
    let noteContent = window.localStorage.getItem("note");
    window.location.pathname === "/create-note.html" && noteCreateLinkNode.classList.add("active")
    if (noteContent && noteContent.length) {
        noteWriterNode.value = noteContent;
    }
    noteWriterNode.addEventListener("input", (event) => {
        typingStatusNode.innerText = "Typing...";
        let inputValue = encodeHTML(event.target.value)
        window.clearTimeout(timeOutId);
        timeOutId = window.setTimeout(() => {
            noteSaveBtnNode.setAttribute("disabled", "true");
            typingStatusNode.innerText = "Saved locally";
            window.localStorage.setItem("note", inputValue);
            window.clearTimeout(timeOutId);
            noteSaveBtnNode.removeAttribute("disabled");
        },1000);
    });
    noteSaveBtnNode.addEventListener("click", async () => {
        saveBtnSpinnerNode.classList.remove("d-none");
        noteSaveBtnNode.setAttribute("disabled", "true");
        let noteContent = window.localStorage.getItem("note");
        try {
            let creationDate = new Date().toLocaleDateString()
            let creationTime = new Date().toLocaleTimeString()
            let data = await noteApi.addNote(noteContent,creationDate,creationTime);
            if (data) {
                noteWriterNode.value = null;
                window.localStorage.removeItem("note");
                window.location.href = "/view-note.html";
            } else {
                let error = new Error("Something went wrong! Failed to save your note.");
                handelError(error, "danger", alertNode);
            }
        } catch (error) {
            handelError(error, "danger", alertNode);
        }
        saveBtnSpinnerNode.classList.add("d-none");
        noteSaveBtnNode.removeAttribute("disabled");
    });

    logOutBtn.addEventListener("click", async () => {
        try {
            await authApi.logOut();
            window.location.href = "/";
        } catch (error) {
            handelError(error, "danger", alertNode);
        }
    });
}

checkUserAuthentication().then(session => {
    if (session) {
        main();
        profileDropdownBtnNode.classList.remove("d-none");
    } else {
        window.location.href = "/";
    }
}).catch(error => {
    if (error) {
        window.location.href = "/";
    }
});