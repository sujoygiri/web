import { noteApi, checkUserAuthentication } from "./supabse-api.js";
import { handelError } from "./util.js";

function main() {
    const noteWriterNode = document.getElementById("note-writer");
    const typingStatusNode = document.getElementById("typing-status");
    const noteSaveBtnNode = document.getElementById("note-save-btn");
    const saveBtnSpinnerNode = document.getElementById("save-btn-spinner");
    const alertNode = document.querySelector(".alert");
    let timeOutId = null;
    let noteContent = window.localStorage.getItem("note");
    if (noteContent && noteContent.length) {
        noteWriterNode.value = noteContent;
    }
    noteWriterNode.addEventListener("input", (event) => {
        typingStatusNode.innerText = "Typing...";
        window.clearTimeout(timeOutId);
        timeOutId = window.setTimeout(() => {
            noteSaveBtnNode.setAttribute("disabled", "true");
            typingStatusNode.innerText = "Saved locally";
            window.localStorage.setItem("note", event.target.value);
            window.clearTimeout(timeOutId);
            noteSaveBtnNode.removeAttribute("disabled");
        },1000);
    });
    noteSaveBtnNode.addEventListener("click", async () => {
        saveBtnSpinnerNode.classList.remove("d-none");
        noteSaveBtnNode.setAttribute("disabled", "true");
        let noteContent = window.localStorage.getItem("note");
        try {
            let data = await noteApi.addNote(noteContent);
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
}

checkUserAuthentication().then(session => {
    if (session) {
        main();
    } else {
        window.location.href = "/";
    }
}).catch(error => {
    if (error) {
        window.location.href = "/";
    }
});