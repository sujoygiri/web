import { noteApi, checkUserAuthentication } from "./supabase-api.js";
import { getNoteHtmlStructure, encodeHTML, handelError } from "./util.js";

const noteViewLinkNode = document.querySelector(".note-view-link")
const textInputNode = document.getElementById("text-input");
const dateInputNode = document.getElementById("date-input");
const loadMoreBtnNode = document.getElementById("load-more-btn");
const notesInfoNode = document.getElementById("notes-info");
const noteListNode = document.getElementById("note-list");
const loadingSpinnerNode = document.getElementById("loading-spinner");
const loadMoreBtnSpinnerNode = document.getElementById("load-more-btn-spinner");
// const sortingSelectNode = document.getElementById("sort-select")
const dateCheckBoxNode = document.getElementById("date-checkbox");
const noteActionModalObj = new bootstrap.Modal("#note-action-modal");
const noteActionModalNode = document.getElementById("note-action-modal");
const noteActionModalHeaderNode = document.getElementById("modal-header-text");
const noteUpdateAlertNode = document.getElementById("note-update-alert");
const mainAlertNode = document.getElementById("main-alert")
const noteUpdateTextAreaNode = document.getElementById("note-update-textarea");
const noteUpdateBtnNode = document.getElementById("note-update-btn");
const updateBtnSpinnerNode = document.getElementById("update-btn-spinner");
const noteDeleteBtnNode = document.getElementById("note-delete-btn");
const deleteBtnSpinnerNode = document.getElementById("delete-btn-spinner");
const noteDeleteCancelBtnNode = document.getElementById("note-delete-cancel-btn");

let noteId = null;
let updatedNoteContent = "";
let noteForUpdateNode = null;
let noteForDeleteNode = null;

function renderNotes(notes) {
    if (notes.length) {
        notes.forEach(note => {
            let noteHtmlStructure = getNoteHtmlStructure(note.id, note.note_content, note.updated_at, note.n_time);
            noteListNode.innerHTML += noteHtmlStructure;
        });
    } else {
        notesInfoNode.innerText = "No notes found!";
        notesInfoNode.classList.remove("d-none");
    }
    document.querySelectorAll(".update").forEach((node) => {
        node.addEventListener("click", (event) => {
            event.stopPropagation();
            noteForUpdateNode = event.target;
            noteId = Number.parseInt(event.target.dataset.noteid);
            updatedNoteContent = event.target.parentNode.parentNode.children[1].innerText;
            noteUpdateAlertNode.classList.add("d-none");
            noteUpdateTextAreaNode.classList.remove("d-none");
            noteUpdateBtnNode.classList.remove("d-none");
            noteDeleteBtnNode.classList.add("d-none");
            noteDeleteCancelBtnNode.classList.add("d-none");
            noteActionModalHeaderNode.textContent = "Modify your note bellow";
            noteUpdateTextAreaNode.value = updatedNoteContent;
            noteActionModalObj.show(noteActionModalNode);
        });
    });
    document.querySelectorAll(".delete").forEach((node) => {
        node.addEventListener("click", (event) => {
            event.stopPropagation();
            noteForDeleteNode = event.target.parentNode.parentNode;
            noteId = Number.parseInt(event.target.dataset.noteid);
            noteUpdateTextAreaNode.classList.add("d-none");
            noteUpdateBtnNode.classList.add("d-none");
            noteDeleteBtnNode.classList.remove("d-none");
            noteDeleteCancelBtnNode.classList.remove("d-none");
            noteActionModalHeaderNode.textContent = "Are you sure you want to delete?";
            noteActionModalObj.show(noteActionModalNode);
        });
    });
}

async function getNotes(selectType, searchedValue, from, to) {
    try {
        const { data, count } = await noteApi.searchAndGet(selectType, searchedValue, from, to);
        return { data, count };
    } catch (error) {
        handelError(error,"danger",mainAlertNode)
    }
}

/** Need to implement note sort function */
// async function getSortedNote(selectDataType,isAscending){
//     const data = await noteApi.sortNote(selectDataType,isAscending);
//     return data;
// }
/** -------- */

function main() {
    let timeOutId = null;
    let from = 0;
    let maxFetchedNote = 4;
    let searchedValue = "";
    let selectType = "";
    window.addEventListener("load", async () => {
        window.location.pathname === "/view-note.html" && noteViewLinkNode.classList.add("active")
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
        searchedValue = encodeHTML(event.target.value);
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
            }
        }, 1000);
    });

    dateInputNode.addEventListener("change", async (event) => {
        let chooseDate = event.target.value;
        searchedValue = new Date(chooseDate).toISOString().split("T")[0];
        from = 0;
        selectType = "updated_at";
        noteListNode.innerHTML = "";
        loadingSpinnerNode.classList.remove("d-none");
        loadMoreBtnNode.classList.add("d-none");
        notesInfoNode.classList.add("d-none");
        const { data, count } = await getNotes(selectType, searchedValue, from, from = from + maxFetchedNote);
        loadingSpinnerNode.classList.add("d-none");
        renderNotes(data);
        if (count > from + 1) {
            loadMoreBtnNode.classList.remove("d-none");
        } else {
            loadMoreBtnNode.classList.add("d-none");
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
            noteForUpdateNode.parentNode.parentNode.children[1].innerText = data[0].note_content;
        } else {
            /** need to implement error handel */
        }
    });

    noteDeleteBtnNode.addEventListener("click", async () => {
        deleteBtnSpinnerNode.classList.remove("d-none");
        /** If there is an invalid note id then note should not remove from frontend view */
        const status = await noteApi.deleteNote(noteId);
        if(status === 204){
            deleteBtnSpinnerNode.classList.add("d-none");
            noteActionModalObj.hide(noteActionModalNode);
            noteListNode.removeChild(noteForDeleteNode);
        }
    });

    noteDeleteCancelBtnNode.addEventListener("click",()=>{
        noteActionModalObj.hide(noteActionModalNode);
    })

    /**need to implement note sorting function */
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
    /** --------- */

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
