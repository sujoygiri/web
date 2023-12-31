import authApi from "./auth-script.js";
import {handelError} from "./util.js";

const alertNode = document.querySelector(".alert");

/**
 * @param {string} emailId
 * @param {string} password
 */
async function signUpUser(emailId, password) {
    try {
        return await authApi.signUp(emailId, password);
    } catch (error) {
        handelError(error, "danger", alertNode);
    }
}

/**
 * @param {string} emailId
 * @param {string} password
 */
async function signInUser(emailId, password) {
    try {
        return await authApi.signIn(emailId, password);
    } catch (error) {
        error.message = "Invalid sign in credentials";
        handelError(error, "danger", alertNode);
    }
}

/**
 * @param {string} action
 * @param {bootstrap.Modal} modalObj
 * @param {HTMLElement} modalNode
 * rendering correct modal format based on user interaction,
 * upon clicking on signup btn rendering a confirm password field.
 * upon clicking on signin btn removing confirm password field
 */
function showCorrectAuthFormAndAuthenticate(action, modalObj, modalNode) {
    const authFormNode = document.getElementById("auth-form");
    const authFormTitleNode = document.querySelector(".modal-title");
    const confirmPasswordBoxNode = document.getElementById("confirm-password-box");
    const signUpBtnBoxNode = document.getElementById("signup-btn-box");
    const signInBtnBoxNode = document.getElementById("signin-btn-box");
    const signUpBtnNode = document.getElementById("signup-btn");
    const signInBtnNode = document.getElementById("signin-btn");
    const submitBtnNode = document.getElementById("submit-btn");
    const spinnerNode = document.getElementById("spinner");
    const inputNode = document.querySelectorAll("input");
    confirmPasswordBoxNode.classList.add("d-none");
    signInBtnBoxNode.classList.add("d-none");

    // function for clearing input node upon change authentication mode
    function clearInputField(nodes) {
        nodes.forEach((input) => {
            input.value = "";
        });
    }

    signUpBtnNode.addEventListener("click", () => {
        confirmPasswordBoxNode.classList.remove("d-none");
        authFormTitleNode.innerText = "Sign Up";
        authFormTitleNode.dataset.name = "signup";
        signUpBtnBoxNode.classList.add("d-none");
        signInBtnBoxNode.classList.remove("d-none");
        clearInputField(inputNode);
    });
    signInBtnNode.addEventListener("click", () => {
        confirmPasswordBoxNode.classList.add("d-none");
        authFormTitleNode.innerText = "Sign In";
        authFormTitleNode.dataset.name = "signin";
        signUpBtnBoxNode.classList.remove("d-none");
        signInBtnBoxNode.classList.add("d-none");
        clearInputField(inputNode);
    });
    authFormNode.addEventListener("submit", async (event) => {
        event.preventDefault();
        submitBtnNode.setAttribute("disabled", "true");
        spinnerNode.classList.remove("d-none");
        let emailId = event.target[0].value;
        let password = event.target[1].value;
        let confirmPassword = event.target[2].value;
        if (authFormTitleNode.dataset.name === "signin") {
            let userData = await signInUser(emailId, password);
            if (userData) {
                modalObj.hide(modalNode);
                window.location.href = action + "-" + "note" + "." + "html";
            }
        } else if (authFormTitleNode.dataset.name === "signup") {
            if (password === confirmPassword) {
                let userData = await signUpUser(emailId, password);
                if (userData) {
                    modalObj.hide(modalNode);
                    window.location.href = action + "-" + "note" + "." + "html";
                }
            } else {
                let error = new Error("Password did not match");
                handelError(error, "warning", alertNode);
            }
        }
        submitBtnNode.removeAttribute("disabled");
        spinnerNode.classList.add("d-none");
    });
}

/**
 * @param {string} action
 *
 * calling getUser() method from authApi object
 * and checking if user exist or not
 * if exist go to respective page
 * if not open authentication modal
 * also calling 'showCorrectAuthFormAndAuthenticate()' for rendering correct auth form
 */
async function isUserAuthenticated(action) {
    const modalObj = new bootstrap.Modal("#main-modal");
    const modalNode = document.getElementById("main-modal");
    try {
        const {session: {user}} = await authApi.getUser();
        if (user && user.id) {
            switch (action) {
                case "create":
                    window.location.href = "create-note.html";
                    break;
                case "view":
                    window.location.href = "view-note.html";
                    break;
                default:
                    console.log("action not allowed");
            }
        } else {
            modalObj.show(modalNode);
            showCorrectAuthFormAndAuthenticate(action, modalObj, modalNode);
        }
    } catch (e) {
        modalObj.show(modalNode);
        showCorrectAuthFormAndAuthenticate(action, modalObj, modalNode);
    }
}

/**
 * getting reference of create and view note btn
 * And attaching click event listener for
 * calling 'isUserAuthenticated'
 */
function main() {
    const createNoteBtn = document.getElementById("create-note-btn");
    const viewNoteBtn = document.getElementById("view-note-btn");
    createNoteBtn.addEventListener("click", () => isUserAuthenticated("create"));
    viewNoteBtn.addEventListener("click", () => isUserAuthenticated("view"));
}

main();
