import {noteApi} from "./supabse-api.js";
import {getNoteHtmlStructure} from "./util.js";

function main() {
    window.addEventListener("load", async () => {
        const noteListNode = document.getElementById("note-list");
        let notes = await noteApi.getNote();
        notes && notes.forEach(note => {
            // console.log(note);
            let noteStructureHtml = getNoteHtmlStructure(note.id,note.note_content,note.updated_at)
            noteListNode.innerHTML += noteStructureHtml
        });
    });
}

main();