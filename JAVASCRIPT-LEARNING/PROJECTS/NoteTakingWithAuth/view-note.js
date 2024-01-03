import {noteApi, checkUserAuthentication} from "./supabse-api.js";
import {getNoteHtmlStructure} from "./util.js";


function main() {
    let notes = []
    const noteListNode = document.getElementById("note-list");
    const searchContentNode = document.getElementById("searched-content");
    searchContentNode.addEventListener("input",()=>{
        console.log("hi");
    })
    console.log(searchContentNode);

    window.addEventListener("load", async () => {
        notes = await noteApi.getNote();
        notes && notes.forEach(note => {
            // console.log(note);
            let noteStructureHtml = getNoteHtmlStructure(note.id,note.note_content,note.updated_at)
            noteListNode.innerHTML += noteStructureHtml
        });
    });
}

checkUserAuthentication().then(session=>{
    if (session) {
        main()
    }else{
        window.location.href = "/";
    }
}).catch(error => {
    if(error){
        window.location.href = "/"
    }
})