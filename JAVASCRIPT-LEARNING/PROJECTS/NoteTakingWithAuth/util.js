export function handelError(error, errorType, alertNode) {
    alertNode.classList.add(`alert-${errorType}`);
    alertNode.classList.remove("d-none");
    alertNode.innerText = error.message;
    let TIMEOUT_ID = setTimeout(() => {
        alertNode.classList.add("d-none");
        clearTimeout(TIMEOUT_ID);
    }, 3000);
}

export function getNoteHtmlStructure(noteId, noteContent, date) {
    let newDate = new Date(date);
    let getDateAsString = newDate.toDateString()
    let getTimeAsString = newDate.toLocaleTimeString()
    return `<div class="p-2 text-white position-relative rounded-2 shadow-lg border-top border-5 border-info" style="background-color: #281d1d"><span class="ps-3" style="font-size: 0.8rem; color: #f6cd02">${getDateAsString} at ${getTimeAsString}</span><span class="d-block p-3 text-truncate">${noteContent}</span><div class="position-absolute end-0 top-0 pt-2 me-2"><i class="bi bi-pencil-fill me-2" role="button" title="Edit" style="font-size: 1rem; color: #148306;"></i><i class="bi bi-trash-fill" role="button" title="Delete" style="font-size: 1rem; color: #ce0404;"></i></div></div>`;
}