import authApi from "./main-script.js";


async function isUserAuthenticated(action) {
    const modalObj = new bootstrap.Modal("#main-modal");
    const modalNode = document.getElementById("main-modal");
    try {
        const {session: {user}} = await authApi.getUser();
        if (user && user.id) {
            switch (action) {
                case "create":
                    window.location.href = "create";
                    break;
                case "view":
                    window.location.href = "view";
                    break;
                default:
                    console.log("action not allowed");
            }
        } else {
            modalObj.show(modalNode);
        }
    } catch (e) {
        modalObj.show(modalNode);
    }
}

function main() {
    const createNoteBtn = document.getElementById("create-note-btn");
    const viewNoteBtn = document.getElementById("view-note-btn");
    createNoteBtn.addEventListener("click", () => isUserAuthenticated("create"));
    viewNoteBtn.addEventListener("click", () => isUserAuthenticated("view"));
}

main();
