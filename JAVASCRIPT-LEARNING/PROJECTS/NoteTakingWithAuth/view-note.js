import { noteApi, checkUserAuthentication } from "./supabse-api.js";
import { getNoteHtmlStructure } from "./util.js";

const searchInputNode = document.getElementById("search-input");
const loadMoreBtnNode = document.getElementById("load-more-btn");
const notesInfoNode = document.getElementById("notes-info");
const noteListNode = document.getElementById("note-list");
const loadingSpinnerNode = document.getElementById("loading-spinner");
const loadMoreBtnSpinnerNode = document.getElementById("load-more-btn-spinner");

function renderNotes(notes) {
    if (notes.length) {
        notes.forEach(note => {
            let noteStructureHtml = getNoteHtmlStructure(note.id, note.note_content, note.updated_at);
            noteListNode.innerHTML += noteStructureHtml;
        });
    } else {
        notesInfoNode.innerText = "No notes found!";
        notesInfoNode.classList.remove("d-none");
    }
}

async function getNotes(searchedValue, from, to) {
    const { data, count } = await noteApi.searchAndGet(searchedValue, from, to);
    return { data, count };
}

function main() {

    let timeOutId = null;
    let from = 0;
    let maxFetchedNote = 4;
    let searchedValue = "";
    window.addEventListener("load", async () => {
        const { data, count } = await getNotes(searchedValue, from, from = from + maxFetchedNote);
        renderNotes(data);
        loadingSpinnerNode.classList.add("d-none");
        noteListNode.classList.remove("d-none");
        if (count > from) {
            loadMoreBtnNode.classList.remove("d-none");
        }
    });

    loadMoreBtnNode.addEventListener("click", async () => {
        loadMoreBtnNode.setAttribute("disabled", "true");
        loadMoreBtnSpinnerNode.classList.remove("d-none");
        const { data, count } = await getNotes(searchedValue, from = from + 1, from = from + maxFetchedNote);
        renderNotes(data);
        loadMoreBtnNode.removeAttribute("disabled");
        loadMoreBtnSpinnerNode.classList.add("d-none");
        if (count > from) {
            loadMoreBtnNode.classList.remove("d-none");
        } else {
            loadMoreBtnNode.classList.add("d-none");
            notesInfoNode.classList.remove("d-none");
            notesInfoNode.innerText = "No more notes!";
        }
    });

    searchInputNode.addEventListener("input", (event) => {
        searchedValue = event.target.value;
        from = 0;
        noteListNode.innerHTML = "";
        loadingSpinnerNode.classList.remove("d-none");
        loadMoreBtnNode.classList.add("d-none");
        notesInfoNode.classList.add("d-none");
        window.clearInterval(timeOutId);
        timeOutId = window.setTimeout(async () => {
            const { data, count } = await getNotes(searchedValue, from, from = from + maxFetchedNote);
            loadingSpinnerNode.classList.add("d-none");
            renderNotes(data);
            if (count > from) {
                loadMoreBtnNode.classList.remove("d-none");
            } else {
                loadMoreBtnNode.classList.add("d-none");
                notesInfoNode.classList.remove("d-none");
                notesInfoNode.innerText = "No more notes!";
            }
        }, 1000);
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
