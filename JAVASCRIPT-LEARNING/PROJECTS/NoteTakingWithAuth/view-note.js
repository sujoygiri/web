import { noteApi, checkUserAuthentication } from "./supabse-api.js";
import { getNoteHtmlStructure, encodeHTML } from "./util.js";

const textInputNode = document.getElementById("text-input");
const dateInputNode = document.getElementById("date-input");
const loadMoreBtnNode = document.getElementById("load-more-btn");
const notesInfoNode = document.getElementById("notes-info");
const noteListNode = document.getElementById("note-list");
const loadingSpinnerNode = document.getElementById("loading-spinner");
const loadMoreBtnSpinnerNode = document.getElementById("load-more-btn-spinner");
// const sortingSelectNode = document.getElementById("sort-select")
const dateCheckBoxNode = document.getElementById("date-checkbox");
const viewNoteModalObj = new bootstrap.Modal("#view-note-modal");
const viewNoteModalNode = document.getElementById("view-note-modal");
const noteUpdateAlertNode = document.getElementById("note-update-alert");
const noteUpdateTextAreaNode = document.getElementById("note-update-textarea");
const noteUpdateBtnNode = document.getElementById("note-update-btn");
const updateBtnSpinnerNode = document.getElementById("update-btn-spinner");

let noteId = null;
let updatedNoteContent = "";


function renderNotes(notes) {
    if (notes.length) {
        notes.forEach(note => {
            let noteStructureHtml = getNoteHtmlStructure(note.id, note.note_content, note.updated_at, note.n_time);
            noteListNode.innerHTML += noteStructureHtml;
        });
    } else {
        notesInfoNode.innerText = "No notes found!";
        notesInfoNode.classList.remove("d-none");
    }
    document.querySelectorAll(".update").forEach((node) => {
        node.addEventListener("click", (event) => {
            event.stopPropagation();
            noteId = Number.parseInt(event.target.dataset.noteid);
            updatedNoteContent = event.target.parentNode.parentNode.children[1].innerText;
            noteUpdateAlertNode.classList.add("d-none");
            noteUpdateTextAreaNode.value = updatedNoteContent;
            viewNoteModalObj.show(viewNoteModalNode);
            // onUpdateNote(noteId,noteContent);
        });
    });
    document.querySelectorAll(".delete").forEach((node) => {
        node.addEventListener("click", (event) => {
            console.log(event);
        });
    });
}

async function getNotes(selectType, searchedValue, from, to) {
    const { data, count } = await noteApi.searchAndGet(selectType, searchedValue, from, to);
    return { data, count };
}

// async function getSortedNote(selectDataType,isAscending){
//     const data = await noteApi.sortNote(selectDataType,isAscending);
//     return data;
// }

function main() {

    let timeOutId = null;
    let from = 0;
    let maxFetchedNote = 4;
    let searchedValue = "";
    let selectType = "";
    window.addEventListener("load", async () => {
        selectType = "note_content";
        const { data, count } = await getNotes(selectType, searchedValue, from, from = from + maxFetchedNote);
        renderNotes(data);
        loadingSpinnerNode.classList.add("d-none");
        noteListNode.classList.remove("d-none");
        if (count > from + 1) {
            loadMoreBtnNode.classList.remove("d-none");
        }
    });

    loadMoreBtnNode.addEventListener("click", async () => {
        loadMoreBtnNode.setAttribute("disabled", "true");
        loadMoreBtnSpinnerNode.classList.remove("d-none");
        const { data, count } = await getNotes(selectType, searchedValue, from = from + 1, from = from + maxFetchedNote);
        renderNotes(data);
        loadMoreBtnNode.removeAttribute("disabled");
        loadMoreBtnSpinnerNode.classList.add("d-none");
        if (count > from + 1) {
            loadMoreBtnNode.classList.remove("d-none");
        } else {
            loadMoreBtnNode.classList.add("d-none");
            notesInfoNode.classList.remove("d-none");
            notesInfoNode.innerText = "No more notes!";
        }
    });

    textInputNode.addEventListener("input", (event) => {
        searchedValue = event.target.value;
        from = 0;
        selectType = "note_content";
        noteListNode.innerHTML = "";
        loadingSpinnerNode.classList.remove("d-none");
        loadMoreBtnNode.classList.add("d-none");
        notesInfoNode.classList.add("d-none");
        window.clearInterval(timeOutId);
        timeOutId = window.setTimeout(async () => {
            const { data, count } = await getNotes(selectType, searchedValue, from, from = from + maxFetchedNote);
            loadingSpinnerNode.classList.add("d-none");
            renderNotes(data);
            if (count > from + 1) {
                loadMoreBtnNode.classList.remove("d-none");
            } else {
                loadMoreBtnNode.classList.add("d-none");
                // notesInfoNode.classList.remove("d-none");
                // notesInfoNode.innerText = "No more notes!";
            }
        }, 1000);
    });

    dateInputNode.addEventListener("change", async (event) => {
        let chooseDate = event.target.value;
        let date = new Date(chooseDate).toISOString().split("T")[0];
        from = 0;
        selectType = "updated_at";
        noteListNode.innerHTML = "";
        loadingSpinnerNode.classList.remove("d-none");
        loadMoreBtnNode.classList.add("d-none");
        notesInfoNode.classList.add("d-none");
        const { data, count } = await getNotes(selectType, date, from, from = from + maxFetchedNote);
        loadingSpinnerNode.classList.add("d-none");
        renderNotes(data);
        if (count > from + 1) {
            loadMoreBtnNode.classList.remove("d-none");
        } else {
            loadMoreBtnNode.classList.add("d-none");
            // notesInfoNode.classList.remove("d-none");
            // notesInfoNode.innerText = "No more notes!";
        }
    });

    dateCheckBoxNode.addEventListener("click", (event) => {
        let radioInputId = event.target.checked;
        if (!radioInputId) {
            textInputNode.classList.remove("d-none");
            dateInputNode.classList.add("d-none");
        } else {
            textInputNode.classList.add("d-none");
            dateInputNode.classList.remove("d-none");
        }
    });

    noteUpdateTextAreaNode.addEventListener("input", (event) => {
        updatedNoteContent = encodeHTML(event.target.value);
    });

    noteUpdateBtnNode.addEventListener("click", async () => {
        console.log(noteId, updatedNoteContent);
        let updateDate = new Date().toLocaleDateString();
        let updateTime = new Date().toLocaleTimeString();
        updateBtnSpinnerNode.classList.remove("d-none");
        noteUpdateBtnNode.setAttribute("disabled", "true");
        noteUpdateAlertNode.classList.add("d-none");
        const data = await noteApi.updateNote(noteId, updatedNoteContent, updateDate, updateTime);
        updateBtnSpinnerNode.classList.add("d-none");
        noteUpdateBtnNode.removeAttribute("disabled");
        if (data && data[0].id) {
            noteUpdateAlertNode.innerText = "Note updated successfully!";
            noteUpdateAlertNode.classList.add("alert-success");
            noteUpdateAlertNode.classList.remove("d-none");
            console.log(data);
        } else {

        }
    });

    // sortingSelectNode.addEventListener("change",async (event)=>{
    //     let selectValue = event.target.value;
    //     switch (selectValue) {
    //         case "1":
    //             getSortedNote("note_content",true)
    //             break;
    //         case "2":
    //             getSortedNote("note_content",false)
    //             break;
    //         case "3":
    //             getSortedNote("updated_at",true)
    //             break;
    //         case "4":
    //             getSortedNote("updated_at",false)
    //             break;
    //         default:
    //             break;
    //     }
    // })


}

checkUserAuthentication().then(session => {
    if (session) {
        main();
    } else {
        window.location.href = "/";
    }
}).catch(error => {
    if (error) {
        console.log(error);
        // window.location.href = "/";
    }
});
