let modalOpenBtn = document.getElementById("modal_open-btn");
let modalCloseBtn = document.getElementById("modal_close-btn");
let modal = document.querySelector(".modal-backdrop");

modalOpenBtn.addEventListener("click",()=>{
    modal.style.display = "block"
})

modalCloseBtn.addEventListener("click",()=>{
    modal.style.display = "none"
})