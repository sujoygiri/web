import { connectToClient } from "./main-script.js"; 

function main(){
    const createNoteBtn = document.getElementById("create-note-btn");
    const viewNoteBtn = document.getElementById("view-note-btn");
    connectToClient()
}

main()
