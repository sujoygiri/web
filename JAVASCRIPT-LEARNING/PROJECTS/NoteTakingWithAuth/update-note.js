'use strict';
import { noteApi } from "./supabse-api.js";
import { encodeHTML } from "./util.js";

const noteUpdateAlertNode = document.getElementById("note-update-alert");
const noteUpdateTextAreaNode = document.getElementById("note-update-textarea");
const noteUpdateBtnNode = document.getElementById("note-update-btn");
const updateBtnSpinnerNode = document.getElementById("update-btn-spinner");


export function onUpdateNote(noteId,noteContent) {
    
    console.log(noteId);
    console.log(noteContent);
    function demo(){
        console.log(noteId);
        console.log(noteContent);
    }
    noteUpdateTextAreaNode.value = noteContent
    noteUpdateAlertNode.classList.add("d-none");

    noteUpdateTextAreaNode.addEventListener("input", (event) => {
        event.stopImmediatePropagation()
        noteContent = encodeHTML(event.target.value);
    });

    noteUpdateBtnNode.addEventListener("click", async (event) => {
        // event.stopImmediatePropagation()
        demo()
        // let updateDate = new Date().toLocaleDateString();
        // let updateTime = new Date().toLocaleTimeString();
        // updateBtnSpinnerNode.classList.remove("d-none");
        // noteUpdateBtnNode.setAttribute("disabled", "true");
        // noteUpdateAlertNode.classList.add("d-none");
        // const data = await noteApi.updateNote(noteId, noteContent, updateDate, updateTime);
        // updateBtnSpinnerNode.classList.add("d-none");
        // noteUpdateBtnNode.removeAttribute("disabled");
        // if (data && data[0].id) {
        //     noteUpdateAlertNode.innerText = "Note updated successfully!";
        //     noteUpdateAlertNode.classList.add("alert-success");
        //     noteUpdateAlertNode.classList.remove("d-none");
        //     console.log(data);
        // } else {

        // }
    });
}
