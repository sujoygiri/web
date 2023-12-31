import noteApi from "./db-script.js";
import {handelError} from "./util.js";

function main() {
    const noteWriterNode = document.getElementById("note-writer");
    const typingStatusNode = document.getElementById("typing-status");
    const noteSaveBtnNode = document.getElementById("note-save-btn");
    const spinnerNode = document.getElementById("spinner");
    const alertNode = document.querySelector(".alert");
    let intervalId;
    let noteContent = window.localStorage.getItem("note");
    if (noteContent && noteContent.length) {
        console.log(noteContent);
        noteWriterNode.value = noteContent;
    }
    noteWriterNode.addEventListener("input", () => {
        typingStatusNode.innerText = "Typing...";
    });
    noteWriterNode.addEventListener("keyup", (event) => {
        let prevKeyStrokeTime = new Date().getTime();
        window.clearInterval(intervalId);
        intervalId = window.setInterval(() => {
            let delay = new Date().getTime() - prevKeyStrokeTime;
            noteSaveBtnNode.setAttribute("disabled", "true");
            if (delay >= 1000) {
                typingStatusNode.innerText = "Saved locally";
                window.localStorage.setItem("note", event.target.value);
                window.clearInterval(intervalId);
                noteSaveBtnNode.removeAttribute("disabled");
            }
        });
    });
    noteSaveBtnNode.addEventListener("click", () => {
        spinnerNode.classList.remove("d-none");
        noteSaveBtnNode.setAttribute("disabled", "true");
        let noteContent = window.localStorage.getItem("note");
        noteApi.addNote(noteContent).then(data => {
            if (data) {
                spinnerNode.classList.add("d-none");
                localStorage.removeItem("note");
                window.location.href = "/view-note.html";
            }
        }).catch(error => {
            handelError(error, "danger", alertNode);
        });
    });
}

main();