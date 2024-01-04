import { noteApi, checkUserAuthentication } from "./supabse-api.js";
import { getNoteHtmlStructure } from "./util.js";

function renderNotes(notes,renderingDiv,notesInfoNode){
    if(notes.length){
        notes.forEach(note => {
            let noteStructureHtml = getNoteHtmlStructure(note.id, note.note_content, note.updated_at);
            renderingDiv.innerHTML += noteStructureHtml;
            notesInfoNode.classList.add("d-none")
        });
    }else{
        notesInfoNode.innerText = "No notes found!"
        notesInfoNode.classList.remove("d-none")
    }
}

function main() {
    const searchContentNode = document.getElementById("searched-content");
    const loadMoreBtnNode = document.getElementById("load-more-btn");
    const notesInfoNode = document.getElementById("notes-info")
    const noteListNode = document.getElementById("note-list");
    let timeOutId = null;

    window.addEventListener("load", async () => {
        let from = 0;
        const {data,count} = await noteApi.getNote(from,from=from+4);
        if(count > from){
            loadMoreBtnNode.classList.remove("d-none")
        }
        renderNotes(data,noteListNode,notesInfoNode)
        searchContentNode.addEventListener("input",(event) => {
            let searchedValue = event.target.value;
            searchedValue.length ? loadMoreBtnNode.classList.add("d-none") : loadMoreBtnNode.classList.remove("d-none")
            window.clearTimeout(timeOutId);
            timeOutId = window.setTimeout(async ()=>{
                const {data,count} = await noteApi.searchNote(searchedValue,0,4)
                noteListNode.innerHTML = ''
                renderNotes(data,noteListNode,notesInfoNode)
                window.clearTimeout(timeOutId);
            },1000)
        });

        loadMoreBtnNode.addEventListener("click",async ()=>{
            const {data,count} = await noteApi.getNote(from+1,from=from+5);
            console.log(count);
            renderNotes(data,noteListNode,notesInfoNode)
            if(from > count ){
                loadMoreBtnNode.classList.add("d-none");
                notesInfoNode.innerText = "No more notes"
                notesInfoNode.classList.remove("d-none")
            }
        })
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