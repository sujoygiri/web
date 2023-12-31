export function handelError(error, errorType, alertNode) {
    alertNode.classList.add(`alert-${errorType}`);
    alertNode.classList.remove("d-none");
    alertNode.innerText = error.message;
    let TIMEOUT_ID = setTimeout(() => {
        alertNode.classList.add("d-none");
        clearTimeout(TIMEOUT_ID);
    }, 3000);
}