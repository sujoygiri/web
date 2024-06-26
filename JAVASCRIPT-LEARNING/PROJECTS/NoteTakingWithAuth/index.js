import { authApi, checkUserAuthentication } from "./supabase-api.js";
import { handelError } from "./util.js";

/**
 * getting reference of create and view note btn
 * And attaching click event listener for
 * calling 'isUserAuthenticated'
 */
function main() {
    const createNoteBtn = document.getElementById("create-note-btn");
    const viewNoteBtn = document.getElementById("view-note-btn");
    const profileDropdownBtnNode = document.getElementById("profile-dropdown");
    const navBarSignInBtnNode = document.getElementById("navbar-sign-in-btn");
    const logOutBtn = document.getElementById("logout-btn");
    const modalObj = new bootstrap.Modal("#main-modal");
    const modalNode = document.getElementById("main-modal");
    const alertPlaceholder = document.getElementById('alert-placeholder');

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    };

    /**
     * @param {string} action
     * @param {bootstrap.Modal} modalObj
     * @param {HTMLElement} modalNode
     * rendering correct modal format based on user interaction,
     * upon clicking on sign up btn rendering a confirmation password field.
     * upon clicking on sign in btn removing confirm password field
     */
    function showCorrectAuthFormAndAuthenticate(action) {
        const authFormNode = document.getElementById("auth-form");
        const authFormTitleNode = document.querySelector(".modal-title");
        const confirmPasswordBoxNode = document.getElementById("confirm-password-box");
        const signUpBtnBoxNode = document.getElementById("signup-btn-box");
        const signInBtnBoxNode = document.getElementById("signin-btn-box");
        const signUpBtnNode = document.getElementById("signup-btn");
        const signInBtnNode = document.getElementById("signin-btn");
        const submitBtnNode = document.getElementById("submit-btn");
        const spinnerNode = document.getElementById("spinner");
        const alertNode = document.getElementById("modal-alert");
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
                try {
                    let userData = await authApi.signIn(emailId, password);
                    if (userData && action) {
                        modalObj.hide(modalNode);
                        window.location.href = action + "-" + "note" + "." + "html";
                    } else {
                        modalObj.hide(modalNode);
                        appendAlert("Sign in successful", "success");
                        navBarSignInBtnNode.classList.add("d-none");
                        profileDropdownBtnNode.classList.remove("d-none");
                    }
                } catch (error) {
                    handelError(error, "danger", alertNode);
                }
            } else if (authFormTitleNode.dataset.name === "signup") {
                if (password === confirmPassword) {
                    try {
                        let userData = await authApi.signUp(emailId, password);
                        if (userData && action) {
                            modalObj.hide(modalNode);
                            window.location.href = action + "-" + "note" + "." + "html";
                        } else {
                            modalObj.hide(modalNode);
                            appendAlert("Sign up successful", "success");
                            navBarSignInBtnNode.classList.add("d-none");
                            profileDropdownBtnNode.classList.remove("d-none");
                        }
                    } catch (error) {

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
        const createSpinnerNode = document.getElementById("create-spinner");
        const viewSpinnerNode = document.getElementById("view-spinner");
        try {
            action === "create" ?
                createSpinnerNode.classList.remove("d-none") :
                viewSpinnerNode.classList.remove("d-none");
            createNoteBtn.setAttribute("disabled", "true");
            viewNoteBtn.setAttribute("disabled", "true");
            const { session } = await authApi.getUser();
            if (session && session.user) {
                switch (action) {
                    case "create":
                        window.location.href = "create-note.html";
                        break;
                    case "view":
                        window.location.href = "view-note.html";
                        break;
                    default:
                        console.log("action not allowed");
                        break;
                }
            } else {
                modalObj.show(modalNode);
                showCorrectAuthFormAndAuthenticate(action);
            }
        } catch (error) {
            appendAlert(error, "danger");
        }
        action === "create" ?
            createSpinnerNode.classList.add("d-none") :
            viewSpinnerNode.classList.add("d-none");
        createNoteBtn.removeAttribute("disabled");
        viewNoteBtn.removeAttribute("disabled");
    }

    navBarSignInBtnNode.addEventListener("click", () => {
        modalObj.show(modalNode);
        showCorrectAuthFormAndAuthenticate(null);
    });

    logOutBtn.addEventListener("click", async () => {
        try {
            await authApi.logOut();
            appendAlert("Logout successful", "success");
            navBarSignInBtnNode.classList.remove("d-none");
            profileDropdownBtnNode.classList.add("d-none");
        } catch (error) {
            appendAlert(error, "danger");
        }
    });

    createNoteBtn.addEventListener("click", () => isUserAuthenticated("create"));
    viewNoteBtn.addEventListener("click", () => isUserAuthenticated("view"));

    checkUserAuthentication().then(session => {
        if (session && session.user) {
            navBarSignInBtnNode.classList.add("d-none");
            profileDropdownBtnNode.classList.remove("d-none");
        } else {
            navBarSignInBtnNode.classList.remove("d-none");
            profileDropdownBtnNode.classList.add("d-none");
        }
    }).catch(error => {
        if (error) {
            navBarSignInBtnNode.classList.remove("d-none");
            profileDropdownBtnNode.classList.add("d-none");
        }
    });
}

main();
