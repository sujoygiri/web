import {noteApi,authApi} from "./supabse-api.js";
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
    noteSaveBtnNode.addEventListener("click", async () => {
        spinnerNode.classList.remove("d-none");
        noteSaveBtnNode.setAttribute("disabled", "true");
        let noteContent = window.localStorage.getItem("note");
        try {
            const {session} = await authApi.getUser();
            if (session && session.user) {
                //     update username to the nav bar -> to be implemented
                let data = await noteApi.addNote(noteContent);
                if (data) {
                    localStorage.removeItem("note");
                    window.location.href = "/view-note.html";
                } else {
                    let error = new Error("Something went wrong! Failed to save your note.");
                    handelError(error, "danger", alertNode);
                }
            } else {
                let error = new Error("Before creating a note you must need to sign in/sign up.");
                handelError(error, "danger", alertNode);
            }
        } catch (error) {
            handelError(error, "danger", alertNode);
        }
        spinnerNode.classList.add("d-none");
        noteSaveBtnNode.removeAttribute("disabled");
    });
}

main();